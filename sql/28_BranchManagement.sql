-- Branch Management Tables
-- Enables support for multiple branches/campuses within a single tenant

USE SchoolERP;
GO

-- Create Branches table
CREATE TABLE Branches (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TenantId INT NOT NULL,
    Name NVARCHAR(200) NOT NULL,
    Code NVARCHAR(50) NOT NULL, -- Unique within tenant (MAIN, NORTH, SOUTH)
    Address NVARCHAR(500),
    Phone NVARCHAR(20),
    Email NVARCHAR(100),
    BranchType NVARCHAR(50) DEFAULT 'Satellite', -- Main, Satellite, Campus, Extension, Online
    IsActive BIT DEFAULT 1,
    Description NVARCHAR(500),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),
    CreatedBy NVARCHAR(100),
    UpdatedBy NVARCHAR(100),

    FOREIGN KEY (TenantId) REFERENCES Tenants(Id) ON DELETE CASCADE,
    UNIQUE(TenantId, Code) -- Branch codes unique within tenant
);
GO

-- Create UserBranches table (many-to-many relationship)
CREATE TABLE UserBranches (
    UserId INT NOT NULL,
    BranchId INT NOT NULL,
    TenantId INT NOT NULL, -- For composite key and tenant isolation
    Role NVARCHAR(50) DEFAULT 'Staff', -- SuperAdmin, BranchAdmin, Principal, Teacher, Staff, Student, Parent
    IsPrimary BIT DEFAULT 1, -- User's main branch
    AssignedAt DATETIME2 DEFAULT GETUTCDATE(),

    PRIMARY KEY (UserId, BranchId),
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    FOREIGN KEY (BranchId) REFERENCES Branches(Id) ON DELETE CASCADE,
    FOREIGN KEY (TenantId) REFERENCES Tenants(Id) ON DELETE CASCADE
);
GO

-- Add BranchId to existing tables
ALTER TABLE Students ADD BranchId INT REFERENCES Branches(Id);
ALTER TABLE Teachers ADD BranchId INT REFERENCES Branches(Id);
ALTER TABLE Classes ADD BranchId INT REFERENCES Branches(Id);
ALTER TABLE AttendanceRecords ADD BranchId INT REFERENCES Branches(Id);
ALTER TABLE FeeStructures ADD BranchId INT REFERENCES Branches(Id);
ALTER TABLE StudentFees ADD BranchId INT REFERENCES Branches(Id);
ALTER TABLE PayrollRecords ADD BranchId INT REFERENCES Branches(Id);
ALTER TABLE Books ADD BranchId INT REFERENCES Branches(Id);
ALTER TABLE Buses ADD BranchId INT REFERENCES Branches(Id);
ALTER TABLE TransportRoutes ADD BranchId INT REFERENCES Branches(Id);
ALTER TABLE TransportAssignments ADD BranchId INT REFERENCES Branches(Id);
ALTER TABLE InventoryItems ADD BranchId INT REFERENCES Branches(Id);
ALTER TABLE Notices ADD BranchId INT REFERENCES Branches(Id);
ALTER TABLE ParentMessages ADD BranchId INT REFERENCES Branches(Id);
ALTER TABLE Courses ADD BranchId INT REFERENCES Branches(Id);
ALTER TABLE CourseMaterials ADD BranchId INT REFERENCES Branches(Id);
ALTER TABLE Rewards ADD BranchId INT REFERENCES Branches(Id);
ALTER TABLE StudentAchievements ADD BranchId INT REFERENCES Branches(Id);
ALTER TABLE Hostels ADD BranchId INT REFERENCES Branches(Id);
ALTER TABLE RoomAllocations ADD BranchId INT REFERENCES Branches(Id);
ALTER TABLE HostelMaintenances ADD BranchId INT REFERENCES Branches(Id);
ALTER TABLE AuditLogs ADD BranchId INT REFERENCES Branches(Id);
GO

-- Create indexes for performance
CREATE INDEX IX_Branches_TenantId ON Branches(TenantId);
CREATE INDEX IX_Branches_Code ON Branches(Code);
CREATE INDEX IX_UserBranches_UserId ON UserBranches(UserId);
CREATE INDEX IX_UserBranches_BranchId ON UserBranches(BranchId);
CREATE INDEX IX_UserBranches_TenantId ON UserBranches(TenantId);
CREATE INDEX IX_UserBranches_IsPrimary ON UserBranches(IsPrimary);

-- Add indexes for branch-filtered queries
CREATE INDEX IX_Students_BranchId ON Students(BranchId);
CREATE INDEX IX_Teachers_BranchId ON Teachers(BranchId);
CREATE INDEX IX_Classes_BranchId ON Classes(BranchId);
GO

-- Insert sample branches for default tenant
INSERT INTO Branches (TenantId, Name, Code, Address, Phone, Email, BranchType, Description)
VALUES
(1, 'Main Campus', 'MAIN', '123 Main Street, City, State 12345', '+1-555-0101', 'main@school.com', 'Main', 'Primary campus with administrative offices'),
(1, 'North Branch', 'NORTH', '456 North Avenue, City, State 12346', '+1-555-0102', 'north@school.com', 'Satellite', 'Northern district campus'),
(1, 'South Branch', 'SOUTH', '789 South Boulevard, City, State 12347', '+1-555-0103', 'south@school.com', 'Satellite', 'Southern district campus');
GO

-- Assign existing users to main branch (assuming user IDs start from 1)
-- Note: In production, this would be done through the admin interface
INSERT INTO UserBranches (UserId, BranchId, TenantId, Role, IsPrimary)
SELECT
    u.Id,
    1, -- Main branch
    u.TenantId,
    CASE
        WHEN u.Role = 'admin' THEN 'SuperAdmin'
        WHEN u.Role = 'teacher' THEN 'Teacher'
        ELSE 'Staff'
    END,
    1 -- IsPrimary
FROM Users u
WHERE u.TenantId = 1;
GO

-- Update existing students and teachers to main branch
UPDATE Students SET BranchId = 1 WHERE TenantId = 1 AND BranchId IS NULL;
UPDATE Teachers SET BranchId = 1 WHERE TenantId = 1 AND BranchId IS NULL;
UPDATE Classes SET BranchId = 1 WHERE TenantId = 1 AND BranchId IS NULL;
GO

-- Create StudentTransfer table for tracking branch changes
CREATE TABLE StudentTransfers (
    Id INT PRIMARY KEY IDENTITY(1,1),
    StudentId INT NOT NULL,
    FromBranchId INT,
    ToBranchId INT NOT NULL,
    TransferDate DATETIME2 DEFAULT GETUTCDATE(),
    Reason NVARCHAR(500),
    ApprovedBy INT, -- User who approved the transfer
    Notes NVARCHAR(1000),

    FOREIGN KEY (StudentId) REFERENCES Students(Id),
    FOREIGN KEY (FromBranchId) REFERENCES Branches(Id),
    FOREIGN KEY (ToBranchId) REFERENCES Branches(Id),
    FOREIGN KEY (ApprovedBy) REFERENCES Users(Id)
);
GO

PRINT 'Branch Management tables created successfully!';
PRINT 'Sample branches inserted for default tenant.';
PRINT 'Existing users, students, and teachers assigned to main branch.';
GO
