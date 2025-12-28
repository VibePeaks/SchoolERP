-- =====================================================
-- Bulk Upload Stored Procedures
-- Optimized for high-performance bulk operations
-- =====================================================

USE SchoolERP;
GO

-- =====================================================
-- TABLE-VALUED PARAMETERS (TVPs) for Bulk Operations
-- =====================================================

-- Students TVP
CREATE TYPE dbo.StudentBulkInsertType AS TABLE (
    TenantId INT,
    FirstName NVARCHAR(100),
    LastName NVARCHAR(100),
    StudentId NVARCHAR(50),
    Email NVARCHAR(200),
    Class NVARCHAR(50),
    RollNumber NVARCHAR(20),
    DateOfBirth DATETIME2,
    Gender NVARCHAR(20),
    Phone NVARCHAR(20),
    Address NVARCHAR(500),
    ParentName NVARCHAR(200),
    ParentPhone NVARCHAR(20),
    ParentEmail NVARCHAR(200),
    AdmissionDate DATETIME2,
    BranchId INT
);
GO

-- Teachers TVP
CREATE TYPE dbo.TeacherBulkInsertType AS TABLE (
    TenantId INT,
    FirstName NVARCHAR(100),
    LastName NVARCHAR(100),
    Email NVARCHAR(200),
    EmployeeId NVARCHAR(50),
    Subject NVARCHAR(100),
    Phone NVARCHAR(20),
    Qualification NVARCHAR(200),
    ExperienceYears INT,
    DateOfJoining DATETIME2,
    BranchId INT
);
GO

-- Parents TVP
CREATE TYPE dbo.ParentBulkInsertType AS TABLE (
    TenantId INT,
    FirstName NVARCHAR(100),
    LastName NVARCHAR(100),
    Email NVARCHAR(200),
    Phone NVARCHAR(20),
    ParentName NVARCHAR(200),
    ParentPhone NVARCHAR(20)
);
GO

-- Student-Parent Relationships TVP
CREATE TYPE dbo.StudentParentBulkInsertType AS TABLE (
    StudentId INT,
    ParentId INT,
    TenantId INT,
    IsPrimaryContact BIT,
    CanPickup BIT,
    EmergencyContact BIT
);
GO

-- =====================================================
-- BULK INSERT STORED PROCEDURES
-- =====================================================

-- Students Bulk Insert SP
CREATE PROCEDURE dbo.BulkInsertStudents
    @Students dbo.StudentBulkInsertType READONLY,
    @SkipDuplicates BIT = 1
AS
BEGIN
    SET NOCOUNT ON;

    -- Create temporary table for processing
    CREATE TABLE #StudentsToInsert (
        TenantId INT,
        FirstName NVARCHAR(100),
        LastName NVARCHAR(100),
        StudentId NVARCHAR(50),
        Email NVARCHAR(200),
        Class NVARCHAR(50),
        RollNumber NVARCHAR(20),
        DateOfBirth DATETIME2,
        Gender NVARCHAR(20),
        Phone NVARCHAR(20),
        Address NVARCHAR(500),
        ParentName NVARCHAR(200),
        ParentPhone NVARCHAR(20),
        ParentEmail NVARCHAR(200),
        AdmissionDate DATETIME2,
        BranchId INT
    );

    -- Insert data into temp table
    INSERT INTO #StudentsToInsert
    SELECT * FROM @Students;

    -- Handle duplicates based on flag
    IF @SkipDuplicates = 1
    BEGIN
        -- Remove duplicates based on StudentId within tenant
        DELETE s1 FROM #StudentsToInsert s1
        INNER JOIN Students s2 ON s1.StudentId = s2.StudentId AND s1.TenantId = s2.TenantId;
    END
    ELSE
    BEGIN
        -- Update existing records (merge operation)
        UPDATE s
        SET
            s.FirstName = t.FirstName,
            s.LastName = t.LastName,
            s.Email = t.Email,
            s.Class = t.Class,
            s.RollNumber = t.RollNumber,
            s.DateOfBirth = t.DateOfBirth,
            s.Gender = t.Gender,
            s.Phone = t.Phone,
            s.Address = t.Address,
            s.ParentName = t.ParentName,
            s.ParentPhone = t.ParentPhone,
            s.ParentEmail = t.ParentEmail,
            s.UpdatedAt = GETUTCDATE()
        FROM Students s
        INNER JOIN #StudentsToInsert t ON s.StudentId = t.StudentId AND s.TenantId = t.TenantId;
    END;

    -- Bulk insert new students
    INSERT INTO Students (
        TenantId, FirstName, LastName, StudentId, Email, Class, RollNumber,
        DateOfBirth, Gender, Phone, Address, ParentName, ParentPhone, ParentEmail,
        AdmissionDate, Status, BranchId, CreatedAt, UpdatedAt
    )
    SELECT
        TenantId, FirstName, LastName, StudentId, Email, Class, RollNumber,
        DateOfBirth, Gender, Phone, Address, ParentName, ParentPhone, ParentEmail,
        AdmissionDate, 'Active', BranchId, GETUTCDATE(), GETUTCDATE()
    FROM #StudentsToInsert;

    -- Return inserted student IDs for parent linking
    SELECT
        s.Id,
        s.StudentId,
        s.ParentEmail,
        s.ParentName,
        s.ParentPhone,
        s.TenantId
    FROM Students s
    INNER JOIN #StudentsToInsert t ON s.StudentId = t.StudentId AND s.TenantId = t.TenantId
    WHERE s.ParentEmail IS NOT NULL;

    -- Cleanup
    DROP TABLE #StudentsToInsert;
END;
GO

-- Parents Bulk Insert SP
CREATE PROCEDURE dbo.BulkInsertParents
    @Parents dbo.ParentBulkInsertType READONLY
AS
BEGIN
    SET NOCOUNT ON;

    -- Insert parents (ignore duplicates based on email)
    INSERT INTO Parents (
        TenantId, FirstName, LastName, Email, Phone,
        RelationshipType, Username, PasswordHash, IsActive,
        CreatedAt, UpdatedAt
    )
    SELECT DISTINCT
        TenantId,
        FirstName,
        LastName,
        Email,
        Phone,
        'Parent',
        Email,
        '$2a$11$placeholder.hash.for.bulk.insert', -- Temporary hash, update later
        1,
        GETUTCDATE(),
        GETUTCDATE()
    FROM @Parents p
    WHERE NOT EXISTS (
        SELECT 1 FROM Parents existing
        WHERE existing.Email = p.Email AND existing.TenantId = p.TenantId
    );

    -- Return inserted parent IDs for linking
    SELECT
        p.Id,
        p.Email,
        p.TenantId
    FROM Parents p
    INNER JOIN @Parents input ON p.Email = input.Email AND p.TenantId = input.TenantId;
END;
GO

-- Student-Parent Relationships Bulk Insert SP
CREATE PROCEDURE dbo.BulkInsertStudentParentLinks
    @Links dbo.StudentParentBulkInsertType READONLY
AS
BEGIN
    SET NOCOUNT ON;

    -- Insert relationships (ignore duplicates)
    INSERT INTO StudentParents (
        StudentId, ParentId, TenantId,
        IsPrimaryContact, CanPickup, EmergencyContact,
        LinkedDate
    )
    SELECT
        StudentId, ParentId, TenantId,
        IsPrimaryContact, CanPickup, EmergencyContact,
        GETUTCDATE()
    FROM @Links l
    WHERE NOT EXISTS (
        SELECT 1 FROM StudentParents existing
        WHERE existing.StudentId = l.StudentId AND existing.ParentId = l.ParentId
    );
END;
GO

-- Teachers Bulk Insert SP
CREATE PROCEDURE dbo.BulkInsertTeachers
    @Teachers dbo.TeacherBulkInsertType READONLY,
    @SkipDuplicates BIT = 1
AS
BEGIN
    SET NOCOUNT ON;

    -- Create temporary table for processing
    CREATE TABLE #TeachersToInsert (
        TenantId INT,
        FirstName NVARCHAR(100),
        LastName NVARCHAR(100),
        Email NVARCHAR(200),
        EmployeeId NVARCHAR(50),
        Subject NVARCHAR(100),
        Phone NVARCHAR(20),
        Qualification NVARCHAR(200),
        ExperienceYears INT,
        DateOfJoining DATETIME2,
        BranchId INT
    );

    -- Insert data into temp table
    INSERT INTO #TeachersToInsert
    SELECT * FROM @Teachers;

    -- Handle duplicates
    IF @SkipDuplicates = 1
    BEGIN
        DELETE t1 FROM #TeachersToInsert t1
        INNER JOIN Users u ON t1.Email = u.Email AND t1.TenantId = u.TenantId;
    END;

    -- Insert users first
    INSERT INTO Users (
        TenantId, Username, Email, PasswordHash, FirstName, LastName, Phone,
        Role, IsActive, BranchId, CreatedAt, UpdatedAt
    )
    SELECT
        TenantId, Email, Email,
        '$2a$11$placeholder.hash.for.bulk.insert', -- Update with proper hash later
        FirstName, LastName, Phone,
        'teacher', 1, BranchId, GETUTCDATE(), GETUTCDATE()
    FROM #TeachersToInsert;

    -- Insert teacher profiles
    INSERT INTO Teachers (
        UserId, TenantId, EmployeeId, Subject, Qualification,
        ExperienceYears, DateOfJoining, BranchId, IsActive, CreatedAt, UpdatedAt
    )
    SELECT
        u.Id, t.TenantId, t.EmployeeId, t.Subject, t.Qualification,
        t.ExperienceYears, t.DateOfJoining, t.BranchId, 1, GETUTCDATE(), GETUTCDATE()
    FROM #TeachersToInsert t
    INNER JOIN Users u ON u.Email = t.Email AND u.TenantId = t.TenantId;

    -- Return results
    SELECT
        u.Id as UserId,
        t.EmployeeId,
        t.Email,
        t.TenantId
    FROM #TeachersToInsert t
    INNER JOIN Users u ON u.Email = t.Email AND u.TenantId = t.TenantId;

    -- Cleanup
    DROP TABLE #TeachersToInsert;
END;
GO

-- Hostel Bulk Insert SP
CREATE PROCEDURE dbo.BulkInsertHostelAllocations
    @Allocations dbo.HostelAllocationBulkInsertType READONLY
AS
BEGIN
    SET NOCOUNT ON;

    -- Update existing allocations to inactive
    UPDATE ra
    SET ra.CheckOutDate = GETUTCDATE(),
        ra.IsActive = 0
    FROM RoomAllocations ra
    INNER JOIN @Allocations a ON ra.StudentId = (
        SELECT s.Id FROM Students s WHERE s.StudentId = a.StudentId AND s.TenantId = a.TenantId
    ) AND ra.IsActive = 1;

    -- Insert new allocations
    INSERT INTO RoomAllocations (
        StudentId, HostelId, RoomNumber, CheckInDate, CheckOutDate,
        MonthlyRent, IsActive, TenantId, CreatedAt, UpdatedAt
    )
    SELECT
        s.Id, h.Id, a.RoomNumber, a.CheckInDate, a.CheckOutDate,
        a.MonthlyRent, 1, a.TenantId, GETUTCDATE(), GETUTCDATE()
    FROM @Allocations a
    INNER JOIN Students s ON s.StudentId = a.StudentId AND s.TenantId = a.TenantId
    INNER JOIN Hostels h ON h.Name = a.HostelName AND h.TenantId = a.TenantId;
END;
GO

-- Hostel Allocation TVP
CREATE TYPE dbo.HostelAllocationBulkInsertType AS TABLE (
    TenantId INT,
    StudentId NVARCHAR(50),
    HostelName NVARCHAR(200),
    RoomNumber NVARCHAR(20),
    CheckInDate DATETIME2,
    CheckOutDate DATETIME2,
    MonthlyRent DECIMAL(8,2)
);
GO

-- =====================================================
-- UTILITY STORED PROCEDURES
-- =====================================================

-- Update Parent Passwords (call after bulk insert)
CREATE PROCEDURE dbo.UpdateParentPasswords
    @ParentPasswords dbo.ParentPasswordUpdateType READONLY
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE p
    SET p.PasswordHash = pwd.NewPasswordHash,
        p.UpdatedAt = GETUTCDATE()
    FROM Parents p
    INNER JOIN @ParentPasswords pwd ON p.Id = pwd.ParentId;
END;
GO

-- Update Teacher Passwords
CREATE PROCEDURE dbo.UpdateTeacherPasswords
    @TeacherPasswords dbo.TeacherPasswordUpdateType READONLY
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE u
    SET u.PasswordHash = pwd.NewPasswordHash,
        u.UpdatedAt = GETUTCDATE()
    FROM Users u
    INNER JOIN @TeacherPasswords pwd ON u.Id = pwd.UserId;
END;
GO

-- TVPs for password updates
CREATE TYPE dbo.ParentPasswordUpdateType AS TABLE (
    ParentId INT,
    NewPasswordHash NVARCHAR(500)
);
GO

CREATE TYPE dbo.TeacherPasswordUpdateType AS TABLE (
    UserId INT,
    NewPasswordHash NVARCHAR(500)
);
GO

-- =====================================================
-- PERFORMANCE INDEXES for Bulk Operations
-- =====================================================

-- Students bulk operation indexes
CREATE INDEX IX_Students_BulkInsert_TenantStudentId
ON Students (TenantId, StudentId)
WITH (FILLFACTOR = 90);

-- Parents bulk operation indexes
CREATE INDEX IX_Parents_BulkInsert_TenantEmail
ON Parents (TenantId, Email)
WITH (FILLFACTOR = 90);

-- Users bulk operation indexes
CREATE INDEX IX_Users_BulkInsert_TenantEmail
ON Users (TenantId, Email)
WITH (FILLFACTOR = 90);

PRINT 'Bulk Upload Stored Procedures Created Successfully!';
PRINT 'Table-Valued Parameters and Performance Indexes added.';
GO
