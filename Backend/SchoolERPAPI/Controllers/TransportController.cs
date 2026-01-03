using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolERPAPI.Services;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using SchoolERP.API.Data;

namespace SchoolERPAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TransportController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IDatabaseService _databaseService;

        public TransportController(AppDbContext context, IDatabaseService databaseService)
        {
            _context = context;
            _databaseService = databaseService;
        }

        // GET: api/transport/routes
        [HttpGet("routes")]
        public async Task<IActionResult> GetRoutes()
        {
            var routes = await _context.TransportRoutes
                .Where(tr => tr.IsActive)
                .ToListAsync();

            var busIds = routes.Select(r => r.BusId).Distinct().ToList();
            var buses = await _context.Buses
                .Where(b => busIds.Contains(b.Id))
                .ToDictionaryAsync(b => b.Id);

            var result = routes.Select(tr => new
            {
                tr.Id,
                tr.RouteName,
                tr.StartPoint,
                tr.EndPoint,
                tr.Stops,
                tr.MonthlyFee,
                Bus = buses.ContainsKey(tr.BusId) ? new
                {
                    buses[tr.BusId].Id,
                    buses[tr.BusId].RegistrationNumber,
                    buses[tr.BusId].Capacity,
                    buses[tr.BusId].DriverName,
                    buses[tr.BusId].DriverContact
                } : null,
                StudentCount = _context.TransportAssignments
                    .Count(ta => ta.RouteId == tr.Id && ta.IsActive)
            });

            return Ok(new { success = true, data = result });
        }

        // GET: api/transport/routes/{id}
        [HttpGet("routes/{id}")]
        public async Task<IActionResult> GetRoute(int id)
        {
            var route = await _context.TransportRoutes
                .FirstOrDefaultAsync(tr => tr.Id == id);

            if (route == null)
            {
                return NotFound(new { success = false, message = "Route not found" });
            }

            var bus = await _context.Buses.FirstOrDefaultAsync(b => b.Id == route.BusId);
            var assignments = await _context.TransportAssignments
                .Where(ta => ta.RouteId == id && ta.IsActive)
                .ToListAsync();

            var studentIds = assignments.Select(ta => ta.StudentId).Distinct().ToList();
            var students = await _context.Students
                .Where(s => studentIds.Contains(s.Id))
                .ToDictionaryAsync(s => s.Id);

            return Ok(new
            {
                success = true,
                data = new
                {
                    route.Id,
                    route.RouteName,
                    route.StartPoint,
                    route.EndPoint,
                    route.Stops,
                    route.MonthlyFee,
                    Bus = bus != null ? new
                    {
                        bus.Id,
                        bus.RegistrationNumber,
                        bus.Capacity,
                        bus.DriverName,
                        bus.DriverContact
                    } : null,
                    Students = assignments.Select(ta => new
                    {
                        ta.Id,
                        ta.StudentId,
                        Student = students.ContainsKey(ta.StudentId) ? new
                        {
                            students[ta.StudentId].Id,
                            students[ta.StudentId].FirstName,
                            students[ta.StudentId].LastName,
                            students[ta.StudentId].Class,
                            students[ta.StudentId].RollNumber
                        } : null,
                        ta.StartDate,
                        ta.EndDate,
                        ta.IsActive
                    })
                }
            });
        }

        // GET: api/transport/routes/{routeId}/students
        [HttpGet("routes/{routeId}/students")]
        public async Task<IActionResult> GetRouteStudents(int routeId)
        {
            var assignments = await _context.TransportAssignments
                .Where(ta => ta.RouteId == routeId && ta.IsActive)
                .ToListAsync();

            var studentIds = assignments.Select(ta => ta.StudentId).Distinct().ToList();
            var studentsDict = await _context.Students
                .Where(s => studentIds.Contains(s.Id))
                .ToDictionaryAsync(s => s.Id);

            var students = assignments.Select(ta => new
            {
                ta.Id,
                ta.StudentId,
                Student = studentsDict.ContainsKey(ta.StudentId) ? new
                {
                    studentsDict[ta.StudentId].Id,
                    studentsDict[ta.StudentId].FirstName,
                    studentsDict[ta.StudentId].LastName,
                    studentsDict[ta.StudentId].RollNumber,
                    studentsDict[ta.StudentId].ClassId,
                    Class = studentsDict[ta.StudentId].Class?.Name
                } : null,
                ta.StartDate,
                ta.EndDate,
                ta.IsActive
            }).ToList();

            return Ok(new
            {
                success = true,
                data = students,
                summary = new
                {
                    totalStudents = students.Count
                }
            });
        }

        // GET: api/transport/buses
        [HttpGet("buses")]
        public async Task<IActionResult> GetBuses()
        {
            var buses = await _context.Buses
                .Where(b => b.IsActive)
                .Select(b => new
                {
                    b.Id,
                    b.RegistrationNumber,
                    b.BusType,
                    b.Capacity,
                    b.DriverName,
                    b.DriverContact,
                    RouteCount = _context.TransportRoutes.Count(tr => tr.BusId == b.Id && tr.IsActive)
                })
                .ToListAsync();

            return Ok(new { success = true, data = buses });
        }

        // GET: api/transport/buses/{id}
        [HttpGet("buses/{id}")]
        public async Task<IActionResult> GetBus(int id)
        {
            var bus = await _context.Buses
                .FirstOrDefaultAsync(b => b.Id == id);

            if (bus == null)
            {
                return NotFound(new { success = false, message = "Bus not found" });
            }

            var routes = await _context.TransportRoutes
                .Where(tr => tr.BusId == id && tr.IsActive)
                .Select(tr => new
                {
                    tr.Id,
                    tr.RouteName,
                    tr.StartPoint,
                    tr.EndPoint,
                    tr.MonthlyFee
                })
                .ToListAsync();

            return Ok(new
            {
                success = true,
                data = new
                {
                    bus.Id,
                    bus.RegistrationNumber,
                    bus.BusType,
                    bus.Capacity,
                    bus.DriverName,
                    bus.DriverContact,
                    bus.IsActive,
                    Routes = routes
                }
            });
        }
    }

    // Request/Response Models
    public class LocationUpdateRequest
    {
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public double? Speed { get; set; }
        public double? Heading { get; set; }
        public string? Address { get; set; }
    }

    public class PickupUpdateRequest
    {
        public int DriverId { get; set; }
        public string? Notes { get; set; }
    }

    public class DropoffUpdateRequest
    {
        public int DriverId { get; set; }
        public string? Notes { get; set; }
    }

    public class RouteStartRequest
    {
        public int DriverId { get; set; }
        public string? Notes { get; set; }
    }

    public class RouteCompleteRequest
    {
        public int DriverId { get; set; }
        public string? Notes { get; set; }
    }
}
