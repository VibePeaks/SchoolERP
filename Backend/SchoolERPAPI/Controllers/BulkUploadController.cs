using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using SchoolERP.API.Data;
using SchoolERP.API.Models;
using System.Globalization;
using Dapper;
using System.Data;

namespace SchoolERP.API.Controllers
{
    [ApiController]
    [Route("api/bulk-upload")]
    [Authorize]
    public class BulkUploadController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<BulkUploadController> _logger;

        public BulkUploadController(AppDbContext context, ILogger<BulkUploadController> logger)
        {
            _context = context;
            _logger = logger;
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
        }

        // POST: api/bulk-upload/students
        [HttpPost("students")]
        [RequestSizeLimit(10 * 1024 * 1024)] // 10MB limit
        public async Task<IActionResult> UploadStudents(IFormFile file, [FromQuery] BulkUploadOptions options)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            try
            {
                var result = new BulkUploadResult
                {
                    Total = 0,
                    Success = 0,
                    Errors = 0,
                    ErrorDetails = new List<string>(),
                    Data = new List<object>()
                };

                // Parse the Excel file
                using var stream = file.OpenReadStream();
                using var package = new ExcelPackage(stream);
                var worksheet = package.Workbook.Worksheets[0];

                if (worksheet == null)
                    return BadRequest("No worksheets found in the file");

                var rowCount = worksheet.Dimension?.Rows ?? 0;
                result.Total = Math.Max(0, rowCount - 1); // Exclude header row

                if (result.Total == 0)
                    return BadRequest("No data rows found in the file");

                // Get column mappings
                var headers = new Dictionary<string, int>();
                for (int col = 1; col <= worksheet.Dimension.Columns; col++)
                {
                    var headerValue = worksheet.Cells[1, col].Text?.Trim();
                    if (!string.IsNullOrEmpty(headerValue))
                    {
                        headers[headerValue] = col;
                    }
                }

                // Validate required headers
                var requiredHeaders = new[] { "FirstName", "LastName", "StudentId", "Email", "Class", "RollNumber" };
                var missingHeaders = requiredHeaders.Where(h => !headers.ContainsKey(h)).ToList();

                if (missingHeaders.Any())
                {
                    return BadRequest($"Missing required columns: {string.Join(", ", missingHeaders)}");
                }

                // =====================================================
                // HYBRID APPROACH: EF Core for logic, Dapper for bulk inserts
                // =====================================================

                var tenantId = GetCurrentTenantId();
                var validStudents = new List<StudentUploadData>();
                var validParents = new List<ParentUploadData>();
                var studentParentLinks = new List<StudentParentLinkData>();

                // Phase 1: Parse and Validate with EF Core (complex business logic)
                for (int row = 2; row <= rowCount; row++)
                {
                    try
                    {
                        var studentData = ParseStudentRow(worksheet, headers, row);

                        // Validate student data
                        var validationErrors = ValidateStudentData(studentData);
                        if (validationErrors.Any())
                        {
                            result.Errors++;
                            result.ErrorDetails.Add($"Row {row}: {string.Join(", ", validationErrors)}");
                            continue;
                        }

                        // Check for duplicates if not skipping
                        if (!options.SkipDuplicates)
                        {
                            var existingStudent = await _context.Students
                                .FirstOrDefaultAsync(s => s.StudentId == studentData.StudentId && s.TenantId == tenantId);

                            if (existingStudent != null)
                            {
                                result.Errors++;
                                result.ErrorDetails.Add($"Row {row}: Student with ID '{studentData.StudentId}' already exists");
                                continue;
                            }
                        }

                        // Collect valid data for bulk insert
                        validStudents.Add(studentData);
                        result.Success++;

                        // Handle parent creation/linking
                        if (!string.IsNullOrEmpty(studentData.ParentEmail))
                        {
                            // Check if parent already exists
                            var existingParent = await _context.Parents
                                .FirstOrDefaultAsync(p => p.Email == studentData.ParentEmail && p.TenantId == tenantId);

                            if (existingParent == null)
                            {
                                // New parent to create
                                validParents.Add(new ParentUploadData
                                {
                                    TenantId = tenantId,
                                    FirstName = studentData.ParentName?.Split(' ').FirstOrDefault() ?? "Parent",
                                    LastName = studentData.ParentName?.Split(' ').LastOrDefault() ?? "Guardian",
                                    Email = studentData.ParentEmail,
                                    Phone = studentData.ParentPhone,
                                    ParentName = studentData.ParentName,
                                    ParentPhone = studentData.ParentPhone
                                });
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        result.Errors++;
                        result.ErrorDetails.Add($"Row {row}: {ex.Message}");
                        _logger.LogError(ex, $"Error processing row {row}");
                    }
                }

                // Phase 2: Bulk Insert with Dapper + Stored Procedures (high performance)
                if (validStudents.Any())
                {
                    using var connection = _context.Database.GetDbConnection();
                    await connection.OpenAsync();

                    using var transaction = await connection.BeginTransactionAsync();

                    try
                    {
                        // For now, use EF Core for bulk insert (simplified approach)
                        // TODO: Implement stored procedures for better performance
                        foreach (var studentData in validStudents)
                        {
                            var student = new Student
                            {
                                FirstName = studentData.FirstName,
                                LastName = studentData.LastName,
                                StudentId = studentData.StudentId,
                                Email = studentData.Email,
                                Phone = studentData.Phone,
                                DateOfBirth = studentData.DateOfBirth ?? DateTime.UtcNow.Date,
                                Gender = studentData.Gender,
                                Address = studentData.Address,
                                ClassId = null, // Will be set later based on Class name
                                RollNumber = studentData.RollNumber,
                                AdmissionDate = DateTime.UtcNow.Date,
                                Status = StudentStatus.Active,
                                ParentName = studentData.ParentName,
                                ParentPhone = studentData.ParentPhone,
                                ParentEmail = studentData.ParentEmail,
                                BranchId = 1, // Default branch
                                HomeBranchId = 1,
                                TenantId = tenantId
                            };

                            _context.Students.Add(student);
                        }

                        await _context.SaveChangesAsync();

                        // Handle parents after students are saved
                        if (validParents.Any())
                        {
                            foreach (var parentData in validParents)
                            {
                                var existingParent = await _context.Parents
                                    .FirstOrDefaultAsync(p => p.Email == parentData.Email && p.TenantId == tenantId);

                                if (existingParent == null)
                                {
                                    var parent = new Parent
                                    {
                                        FirstName = parentData.FirstName,
                                        LastName = parentData.LastName,
                                        Email = parentData.Email,
                                        Phone = parentData.Phone,
                                        RelationshipType = "Parent",
                                        Username = parentData.Email,
                                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("TempPass123!"),
                                        IsActive = true,
                                        TenantId = tenantId
                                    };

                                    _context.Parents.Add(parent);
                                }
                            }

                            await _context.SaveChangesAsync();
                        }

                        // Create student-parent links
                        foreach (var studentData in validStudents)
                        {
                            if (!string.IsNullOrEmpty(studentData.ParentEmail))
                            {
                                var student = await _context.Students
                                    .FirstOrDefaultAsync(s => s.StudentId == studentData.StudentId && s.TenantId == tenantId);

                                var parent = await _context.Parents
                                    .FirstOrDefaultAsync(p => p.Email == studentData.ParentEmail && p.TenantId == tenantId);

                                if (student != null && parent != null)
                                {
                                    var existingLink = await _context.StudentParents
                                        .FirstOrDefaultAsync(sp => sp.StudentId == student.Id && sp.ParentId == parent.Id);

                                    if (existingLink == null)
                                    {
                                        var link = new StudentParent
                                        {
                                            StudentId = student.Id,
                                            ParentId = parent.Id,
                                            TenantId = tenantId,
                                            IsPrimaryContact = true,
                                            CanPickup = true,
                                            EmergencyContact = true
                                        };

                                        _context.StudentParents.Add(link);
                                    }
                                }
                            }
                        }

                        await _context.SaveChangesAsync();

                        result.Data = validStudents.Select(s => (object)new
                        {
                            s.StudentId,
                            s.FirstName,
                            s.LastName,
                            s.Email
                        }).ToList();

                    }
                    catch (Exception ex)
                    {
                        await transaction.RollbackAsync();
                        _logger.LogError(ex, "Bulk insert failed");
                        throw;
                    }
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing bulk upload");
                return StatusCode(500, "An error occurred while processing the file");
            }
        }

        // POST: api/bulk-upload/teachers
        [HttpPost("teachers")]
        [RequestSizeLimit(10 * 1024 * 1024)]
        public async Task<IActionResult> UploadTeachers(IFormFile file, [FromQuery] BulkUploadOptions options)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            try
            {
                var result = new BulkUploadResult
                {
                    Total = 0,
                    Success = 0,
                    Errors = 0,
                    ErrorDetails = new List<string>(),
                    Data = new List<object>()
                };

                // Parse the Excel file
                using var stream = file.OpenReadStream();
                using var package = new ExcelPackage(stream);
                var worksheet = package.Workbook.Worksheets[0];

                var rowCount = worksheet.Dimension?.Rows ?? 0;
                result.Total = Math.Max(0, rowCount - 1);

                // Get headers and validate
                var headers = GetHeaders(worksheet);
                var requiredHeaders = new[] { "FirstName", "LastName", "Email", "EmployeeId", "Subject" };
                var missingHeaders = requiredHeaders.Where(h => !headers.ContainsKey(h)).ToList();

                if (missingHeaders.Any())
                    return BadRequest($"Missing required columns: {string.Join(", ", missingHeaders)}");

                // Process each row
                for (int row = 2; row <= rowCount; row++)
                {
                    try
                    {
                        var teacherData = ParseTeacherRow(worksheet, headers, row);
                        var validationErrors = ValidateTeacherData(teacherData);

                        if (validationErrors.Any())
                        {
                            result.Errors++;
                            result.ErrorDetails.Add($"Row {row}: {string.Join(", ", validationErrors)}");
                            continue;
                        }

                        // Check for duplicates
                        if (!options.SkipDuplicates)
                        {
                            var existingTeacher = await _context.Users
                                .FirstOrDefaultAsync(u => u.Email == teacherData.Email && u.TenantId == GetCurrentTenantId());

                            if (existingTeacher != null)
                            {
                                result.Errors++;
                                result.ErrorDetails.Add($"Row {row}: Teacher with email '{teacherData.Email}' already exists");
                                continue;
                            }
                        }

                        // Create teacher user
                        var teacher = new User
                        {
                            FirstName = teacherData.FirstName,
                            LastName = teacherData.LastName,
                            Email = teacherData.Email,
                            Phone = teacherData.Phone,
                            Role = "teacher",
                            IsActive = true,
                            TenantId = GetCurrentTenantId()
                        };

                        _context.Users.Add(teacher);
                        result.Success++;
                        result.Data.Add(teacher);

                        // Create teacher profile
                        var teacherProfile = new Teacher
                        {
                            FirstName = teacherData.FirstName,
                            LastName = teacherData.LastName,
                            EmployeeId = teacherData.EmployeeId,
                            Email = teacherData.Email,
                            Subjects = teacherData.Subject, // Store as comma-separated subjects
                            Qualification = teacherData.Qualification,
                            JoinDate = teacherData.DateOfJoining ?? DateTime.UtcNow.Date,
                            BranchId = 1, // Default branch
                            TenantId = GetCurrentTenantId()
                        };

                        _context.Teachers.Add(teacherProfile);
                    }
                    catch (Exception ex)
                    {
                        result.Errors++;
                        result.ErrorDetails.Add($"Row {row}: {ex.Message}");
                    }
                }

                await _context.SaveChangesAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing teacher bulk upload");
                return StatusCode(500, "An error occurred while processing the file");
            }
        }

        // POST: api/bulk-upload/hostel
        [HttpPost("hostel")]
        [RequestSizeLimit(10 * 1024 * 1024)]
        public async Task<IActionResult> UploadHostelData(IFormFile file, [FromQuery] BulkUploadOptions options)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            try
            {
                var result = new BulkUploadResult
                {
                    Total = 0,
                    Success = 0,
                    Errors = 0,
                    ErrorDetails = new List<string>(),
                    Data = new List<object>()
                };

                // Parse the Excel file
                using var stream = file.OpenReadStream();
                using var package = new ExcelPackage(stream);
                var worksheet = package.Workbook.Worksheets[0];

                var rowCount = worksheet.Dimension?.Rows ?? 0;
                result.Total = Math.Max(0, rowCount - 1);

                // Get headers and validate
                var headers = GetHeaders(worksheet);
                var requiredHeaders = new[] { "HostelName", "RoomNumber", "StudentId" };
                var missingHeaders = requiredHeaders.Where(h => !headers.ContainsKey(h)).ToList();

                if (missingHeaders.Any())
                    return BadRequest($"Missing required columns: {string.Join(", ", missingHeaders)}");

                // Process each row
                for (int row = 2; row <= rowCount; row++)
                {
                    try
                    {
                        var hostelData = ParseHostelRow(worksheet, headers, row);

                        // Validate student exists
                        var student = await _context.Students
                            .FirstOrDefaultAsync(s => s.StudentId == hostelData.StudentId && s.TenantId == GetCurrentTenantId());

                        if (student == null)
                        {
                            result.Errors++;
                            result.ErrorDetails.Add($"Row {row}: Student with ID '{hostelData.StudentId}' not found");
                            continue;
                        }

                        // Create or update room allocation
                        var existingAllocation = await _context.RoomAllocations
                            .FirstOrDefaultAsync(ra => ra.StudentId == student.Id && ra.IsActive);

                        if (existingAllocation != null)
                        {
                            // End current allocation
                            existingAllocation.CheckOutDate = DateTime.UtcNow.Date;
                            existingAllocation.IsActive = false;
                        }

                        // Create new allocation
                        var allocation = new RoomAllocation
                        {
                            StudentId = student.Id,
                            HostelId = await GetOrCreateHostel(hostelData.HostelName),
                            RoomNumber = hostelData.RoomNumber,
                            CheckInDate = hostelData.CheckInDate ?? DateTime.UtcNow.Date,
                            CheckOutDate = hostelData.CheckOutDate,
                            MonthlyRent = hostelData.MonthlyRent ?? 0,
                            IsActive = true,
                            TenantId = GetCurrentTenantId()
                        };

                        _context.RoomAllocations.Add(allocation);
                        result.Success++;
                        result.Data.Add(allocation);
                    }
                    catch (Exception ex)
                    {
                        result.Errors++;
                        result.ErrorDetails.Add($"Row {row}: {ex.Message}");
                    }
                }

                await _context.SaveChangesAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing hostel bulk upload");
                return StatusCode(500, "An error occurred while processing the file");
            }
        }

        // Helper methods
        private Dictionary<string, int> GetHeaders(ExcelWorksheet worksheet)
        {
            var headers = new Dictionary<string, int>();
            for (int col = 1; col <= worksheet.Dimension.Columns; col++)
            {
                var headerValue = worksheet.Cells[1, col].Text?.Trim();
                if (!string.IsNullOrEmpty(headerValue))
                {
                    headers[headerValue] = col;
                }
            }
            return headers;
        }

        private StudentUploadData ParseStudentRow(ExcelWorksheet worksheet, Dictionary<string, int> headers, int row)
        {
            return new StudentUploadData
            {
                FirstName = worksheet.Cells[row, headers["FirstName"]].Text?.Trim(),
                LastName = worksheet.Cells[row, headers["LastName"]].Text?.Trim(),
                StudentId = worksheet.Cells[row, headers["StudentId"]].Text?.Trim(),
                Email = worksheet.Cells[row, headers["Email"]].Text?.Trim(),
                Class = worksheet.Cells[row, headers["Class"]].Text?.Trim(),
                RollNumber = worksheet.Cells[row, headers["RollNumber"]].Text?.Trim(),
                DateOfBirth = ParseDate(worksheet.Cells[row, headers.GetValueOrDefault("DateOfBirth", 0)].Text),
                Gender = worksheet.Cells[row, headers.GetValueOrDefault("Gender", 0)].Text?.Trim(),
                Phone = worksheet.Cells[row, headers.GetValueOrDefault("Phone", 0)].Text?.Trim(),
                Address = worksheet.Cells[row, headers.GetValueOrDefault("Address", 0)].Text?.Trim(),
                ParentName = worksheet.Cells[row, headers.GetValueOrDefault("ParentName", 0)].Text?.Trim(),
                ParentPhone = worksheet.Cells[row, headers.GetValueOrDefault("ParentPhone", 0)].Text?.Trim(),
                ParentEmail = worksheet.Cells[row, headers.GetValueOrDefault("ParentEmail", 0)].Text?.Trim()
            };
        }

        private TeacherUploadData ParseTeacherRow(ExcelWorksheet worksheet, Dictionary<string, int> headers, int row)
        {
            return new TeacherUploadData
            {
                FirstName = worksheet.Cells[row, headers["FirstName"]].Text?.Trim(),
                LastName = worksheet.Cells[row, headers["LastName"]].Text?.Trim(),
                Email = worksheet.Cells[row, headers["Email"]].Text?.Trim(),
                EmployeeId = worksheet.Cells[row, headers["EmployeeId"]].Text?.Trim(),
                Subject = worksheet.Cells[row, headers["Subject"]].Text?.Trim(),
                Phone = worksheet.Cells[row, headers.GetValueOrDefault("Phone", 0)].Text?.Trim(),
                Qualification = worksheet.Cells[row, headers.GetValueOrDefault("Qualification", 0)].Text?.Trim(),
                ExperienceYears = ParseInt(worksheet.Cells[row, headers.GetValueOrDefault("ExperienceYears", 0)].Text),
                DateOfJoining = ParseDate(worksheet.Cells[row, headers.GetValueOrDefault("DateOfJoining", 0)].Text)
            };
        }

        private HostelUploadData ParseHostelRow(ExcelWorksheet worksheet, Dictionary<string, int> headers, int row)
        {
            return new HostelUploadData
            {
                HostelName = worksheet.Cells[row, headers["HostelName"]].Text?.Trim(),
                RoomNumber = worksheet.Cells[row, headers["RoomNumber"]].Text?.Trim(),
                StudentId = worksheet.Cells[row, headers["StudentId"]].Text?.Trim(),
                CheckInDate = ParseDate(worksheet.Cells[row, headers.GetValueOrDefault("CheckInDate", 0)].Text),
                CheckOutDate = ParseDate(worksheet.Cells[row, headers.GetValueOrDefault("CheckOutDate", 0)].Text),
                MonthlyRent = ParseDecimal(worksheet.Cells[row, headers.GetValueOrDefault("MonthlyRent", 0)].Text)
            };
        }

        private List<string> ValidateStudentData(StudentUploadData data)
        {
            var errors = new List<string>();

            if (string.IsNullOrEmpty(data.FirstName)) errors.Add("FirstName is required");
            if (string.IsNullOrEmpty(data.LastName)) errors.Add("LastName is required");
            if (string.IsNullOrEmpty(data.StudentId)) errors.Add("StudentId is required");
            if (string.IsNullOrEmpty(data.Email)) errors.Add("Email is required");
            else if (!IsValidEmail(data.Email)) errors.Add("Invalid email format");
            if (string.IsNullOrEmpty(data.Class)) errors.Add("Class is required");
            if (string.IsNullOrEmpty(data.RollNumber)) errors.Add("RollNumber is required");

            return errors;
        }

        private List<string> ValidateTeacherData(TeacherUploadData data)
        {
            var errors = new List<string>();

            if (string.IsNullOrEmpty(data.FirstName)) errors.Add("FirstName is required");
            if (string.IsNullOrEmpty(data.LastName)) errors.Add("LastName is required");
            if (string.IsNullOrEmpty(data.Email)) errors.Add("Email is required");
            else if (!IsValidEmail(data.Email)) errors.Add("Invalid email format");
            if (string.IsNullOrEmpty(data.EmployeeId)) errors.Add("EmployeeId is required");
            if (string.IsNullOrEmpty(data.Subject)) errors.Add("Subject is required");

            return errors;
        }

        private async Task CreateOrLinkParent(Student student, StudentUploadData data)
        {
            if (string.IsNullOrEmpty(data.ParentEmail)) return;

            var existingParent = await _context.Parents
                .FirstOrDefaultAsync(p => p.Email == data.ParentEmail && p.TenantId == GetCurrentTenantId());

            Parent parent;
            if (existingParent != null)
            {
                parent = existingParent;
            }
            else
            {
                parent = new Parent
                {
                    FirstName = data.ParentName?.Split(' ').FirstOrDefault() ?? "Parent",
                    LastName = data.ParentName?.Split(' ').LastOrDefault() ?? "Guardian",
                    Email = data.ParentEmail,
                    Phone = data.ParentPhone,
                    RelationshipType = "Parent",
                    Username = data.ParentEmail,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("temp123"), // Temporary password
                    IsActive = true,
                    TenantId = GetCurrentTenantId()
                };
                _context.Parents.Add(parent);
            }

            // Link parent to student
            var existingLink = await _context.StudentParents
                .FirstOrDefaultAsync(sp => sp.StudentId == student.Id && sp.ParentId == parent.Id);

            if (existingLink == null)
            {
                var studentParent = new StudentParent
                {
                    StudentId = student.Id,
                    ParentId = parent.Id,
                    TenantId = GetCurrentTenantId(),
                    IsPrimaryContact = true,
                    CanPickup = true,
                    EmergencyContact = true
                };
                _context.StudentParents.Add(studentParent);
            }
        }

        private async Task<int> GetOrCreateHostel(string hostelName)
        {
            var hostel = await _context.Hostels
                .FirstOrDefaultAsync(h => h.Name == hostelName && h.TenantId == GetCurrentTenantId());

            if (hostel != null) return hostel.Id;

            var newHostel = new Hostel
            {
                Name = hostelName,
                TotalRooms = 100, // Default
                OccupiedRooms = 0,
                IsActive = true,
                TenantId = GetCurrentTenantId()
            };

            _context.Hostels.Add(newHostel);
            await _context.SaveChangesAsync();
            return newHostel.Id;
        }

        // Utility methods
        private DateTime? ParseDate(string dateString)
        {
            if (string.IsNullOrEmpty(dateString)) return null;

            if (DateTime.TryParse(dateString, CultureInfo.InvariantCulture, DateTimeStyles.None, out var date))
                return date;

            return null;
        }

        private int? ParseInt(string value)
        {
            if (string.IsNullOrEmpty(value)) return null;
            if (int.TryParse(value, out var result)) return result;
            return null;
        }

        private decimal? ParseDecimal(string value)
        {
            if (string.IsNullOrEmpty(value)) return null;
            if (decimal.TryParse(value, out var result)) return result;
            return null;
        }

        private bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }

        private int GetCurrentTenantId()
        {
            // In a real implementation, get from claims or context
            return 1; // Default tenant
        }

        // DataTable creation helpers (moved inside class)
        private DataTable CreateStudentDataTable(List<StudentUploadData> students, int tenantId)
        {
            var table = new DataTable();
            table.Columns.Add("TenantId", typeof(int));
            table.Columns.Add("FirstName", typeof(string));
            table.Columns.Add("LastName", typeof(string));
            table.Columns.Add("StudentId", typeof(string));
            table.Columns.Add("Email", typeof(string));
            table.Columns.Add("Class", typeof(string));
            table.Columns.Add("RollNumber", typeof(string));
            table.Columns.Add("DateOfBirth", typeof(DateTime));
            table.Columns.Add("Gender", typeof(string));
            table.Columns.Add("Phone", typeof(string));
            table.Columns.Add("Address", typeof(string));
            table.Columns.Add("ParentName", typeof(string));
            table.Columns.Add("ParentPhone", typeof(string));
            table.Columns.Add("ParentEmail", typeof(string));
            table.Columns.Add("AdmissionDate", typeof(DateTime));
            table.Columns.Add("BranchId", typeof(int));

            foreach (var student in students)
            {
                table.Rows.Add(
                    tenantId,
                    student.FirstName,
                    student.LastName,
                    student.StudentId,
                    student.Email,
                    student.Class,
                    student.RollNumber,
                    student.DateOfBirth ?? DateTime.UtcNow.Date,
                    student.Gender,
                    student.Phone,
                    student.Address,
                    student.ParentName,
                    student.ParentPhone,
                    student.ParentEmail,
                    DateTime.UtcNow.Date,
                    1 // Default branch ID
                );
            }

            return table;
        }

        private DataTable CreateParentDataTable(List<ParentUploadData> parents)
        {
            var table = new DataTable();
            table.Columns.Add("TenantId", typeof(int));
            table.Columns.Add("FirstName", typeof(string));
            table.Columns.Add("LastName", typeof(string));
            table.Columns.Add("Email", typeof(string));
            table.Columns.Add("Phone", typeof(string));
            table.Columns.Add("ParentName", typeof(string));
            table.Columns.Add("ParentPhone", typeof(string));

            foreach (var parent in parents)
            {
                table.Rows.Add(
                    parent.TenantId,
                    parent.FirstName,
                    parent.LastName,
                    parent.Email,
                    parent.Phone,
                    parent.ParentName,
                    parent.ParentPhone
                );
            }

            return table;
        }

        private DataTable CreateStudentParentLinkDataTable(List<StudentParentLinkData> links)
        {
            var table = new DataTable();
            table.Columns.Add("StudentId", typeof(int));
            table.Columns.Add("ParentId", typeof(int));
            table.Columns.Add("TenantId", typeof(int));
            table.Columns.Add("IsPrimaryContact", typeof(bool));
            table.Columns.Add("CanPickup", typeof(bool));
            table.Columns.Add("EmergencyContact", typeof(bool));

            foreach (var link in links)
            {
                table.Rows.Add(
                    link.StudentId,
                    link.ParentId,
                    link.TenantId,
                    true, // IsPrimaryContact
                    true, // CanPickup
                    true  // EmergencyContact
                );
            }

            return table;
        }

        private DataTable CreateParentPasswordDataTable(List<ParentPasswordUpdate> updates)
        {
            var table = new DataTable();
            table.Columns.Add("ParentId", typeof(int));
            table.Columns.Add("NewPasswordHash", typeof(string));

            foreach (var update in updates)
            {
                table.Rows.Add(update.ParentId, update.NewPasswordHash);
            }

            return table;
        }
    }

    // Data models for upload processing
    public class StudentUploadData
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string StudentId { get; set; }
        public string Email { get; set; }
        public string Class { get; set; }
        public string RollNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string Gender { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string ParentName { get; set; }
        public string ParentPhone { get; set; }
        public string ParentEmail { get; set; }
    }

    public class TeacherUploadData
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string EmployeeId { get; set; }
        public string Subject { get; set; }
        public string Phone { get; set; }
        public string Qualification { get; set; }
        public int? ExperienceYears { get; set; }
        public DateTime? DateOfJoining { get; set; }
    }

    public class HostelUploadData
    {
        public string HostelName { get; set; }
        public string RoomNumber { get; set; }
        public string StudentId { get; set; }
        public DateTime? CheckInDate { get; set; }
        public DateTime? CheckOutDate { get; set; }
        public decimal? MonthlyRent { get; set; }
    }

    public class BulkUploadResult
    {
        public int Total { get; set; }
        public int Success { get; set; }
        public int Errors { get; set; }
        public List<string> ErrorDetails { get; set; }
        public List<object> Data { get; set; }
    }

    public class BulkUploadOptions
    {
        public bool SkipDuplicates { get; set; } = true;
        public bool UpdateExisting { get; set; } = false;
        public bool ValidateOnly { get; set; } = false;
    }

    // Additional models for hybrid bulk upload
    public class ParentUploadData
    {
        public int TenantId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string ParentName { get; set; }
        public string ParentPhone { get; set; }
    }

    public class StudentParentLinkData
    {
        public int StudentId { get; set; }
        public int ParentId { get; set; }
        public int TenantId { get; set; }
    }

    public class StudentResult
    {
        public int Id { get; set; }
        public string StudentId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string ParentEmail { get; set; }
        public string ParentName { get; set; }
        public string ParentPhone { get; set; }
        public int TenantId { get; set; }
    }

    public class ParentResult
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public int TenantId { get; set; }
    }

    public class ParentPasswordUpdate
    {
        public int ParentId { get; set; }
        public string NewPasswordHash { get; set; }
    }
}
