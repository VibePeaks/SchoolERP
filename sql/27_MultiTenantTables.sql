-- Multi-Tenant Architecture Tables
-- Enables support for multiple schools/institutions

USE SchoolERP;
GO

-- Create Tenants table (represents schools/institutions)
CREATE TABLE Tenants (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TenantCode NVARCHAR(50) NOT NULL UNIQUE, -- Unique identifier (e.g., 'school123')
    Name NVARCHAR(200) NOT NULL,
    Domain NVARCHAR(100) UNIQUE, -- Custom domain (optional)
    Description NVARCHAR(500),
    Address NVARCHAR(500),
    Phone NVARCHAR(20),
    Email NVARCHAR(100),
    LogoUrl NVARCHAR(500),
    IsActive BIT DEFAULT 1,
    SubscriptionPlan NVARCHAR(50) DEFAULT 'basic', -- Institution-wide plan
    MaxUsers INT DEFAULT 100,
    MaxStorageGB INT DEFAULT 10,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),
    SubscriptionStartDate DATETIME2 NULL,
    SubscriptionEndDate DATETIME2 NULL
);
GO

-- Add TenantId to all existing tables
ALTER TABLE Users ADD TenantId INT NOT NULL DEFAULT 1;
ALTER TABLE Students ADD TenantId INT NOT NULL DEFAULT 1;
ALTER TABLE Teachers ADD TenantId INT NOT NULL DEFAULT 1;
ALTER TABLE Classes ADD TenantId INT NOT NULL DEFAULT 1;
ALTER TABLE AttendanceRecords ADD TenantId INT NOT NULL DEFAULT 1;
ALTER TABLE FeeStructures ADD TenantId INT NOT NULL DEFAULT 1;
ALTER TABLE StudentFees ADD TenantId INT NOT NULL DEFAULT 1;
ALTER TABLE PayrollRecords ADD TenantId INT NOT NULL DEFAULT 1;
ALTER TABLE Books ADD TenantId INT NOT NULL DEFAULT 1;
ALTER TABLE Buses ADD TenantId INT NOT NULL DEFAULT 1;
ALTER TABLE TransportRoutes ADD TenantId INT NOT NULL DEFAULT 1;
ALTER TABLE TransportAssignments ADD TenantId INT NOT NULL DEFAULT 1;
ALTER TABLE InventoryItems ADD TenantId INT NOT NULL DEFAULT 1;
ALTER TABLE Notices ADD TenantId INT NOT NULL DEFAULT 1;
ALTER TABLE ParentMessages ADD TenantId INT NOT NULL DEFAULT 1;
ALTER TABLE Courses ADD TenantId INT NOT NULL DEFAULT 1;
ALTER TABLE CourseMaterials ADD TenantId INT NOT NULL DEFAULT 1;
ALTER TABLE Rewards ADD TenantId INT NOT NULL DEFAULT 1;
ALTER TABLE StudentAchievements ADD TenantId INT NOT NULL DEFAULT 1;
ALTER TABLE Hostels ADD TenantId INT NOT NULL DEFAULT 1;
ALTER TABLE RoomAllocations ADD TenantId INT NOT NULL DEFAULT 1;
ALTER TABLE HostelMaintenances ADD TenantId INT NOT NULL DEFAULT 1;
ALTER TABLE AuditLogs ADD TenantId INT NOT NULL DEFAULT 1;

-- Add TenantId to subscription tables
ALTER TABLE UserSubscriptions ADD TenantId INT NOT NULL DEFAULT 1;
ALTER TABLE SubscriptionPayments ADD TenantId INT NOT NULL DEFAULT 1;

-- Create foreign key constraints
ALTER TABLE Users ADD CONSTRAINT FK_Users_Tenants FOREIGN KEY (TenantId) REFERENCES Tenants(Id);
-- Note: Adding FKs to all tables would be done in production migration scripts

-- Create indexes for tenant isolation performance
CREATE INDEX IX_Users_TenantId ON Users(TenantId);
CREATE INDEX IX_Students_TenantId ON Students(TenantId);
CREATE INDEX IX_UserSubscriptions_TenantId ON UserSubscriptions(TenantId);
CREATE INDEX IX_SubscriptionPayments_TenantId ON SubscriptionPayments(TenantId);

-- Create TenantSettings table for customizable features per tenant
CREATE TABLE TenantSettings (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TenantId INT NOT NULL,
    SettingKey NVARCHAR(100) NOT NULL,
    SettingValue NVARCHAR(MAX),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (TenantId) REFERENCES Tenants(Id) ON DELETE CASCADE,
    UNIQUE(TenantId, SettingKey)
);
GO

-- Create TenantUsage table for tracking resource usage
CREATE TABLE TenantUsage (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TenantId INT NOT NULL,
    Metric NVARCHAR(100) NOT NULL, -- 'storage_used', 'users_active', 'api_calls', etc.
    Value DECIMAL(18,2) NOT NULL,
    RecordedAt DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (TenantId) REFERENCES Tenants(Id) ON DELETE CASCADE
);
GO

-- Insert default tenant (main school)
INSERT INTO Tenants (TenantCode, Name, Description, Email, IsActive, MaxUsers, MaxStorageGB)
VALUES ('default', 'Default School', 'Default school instance', 'admin@defaultschool.com', 1, 1000, 100);

-- Update existing data to use default tenant
UPDATE Users SET TenantId = 1 WHERE TenantId = 1;
UPDATE UserSubscriptions SET TenantId = 1 WHERE TenantId = 1;
UPDATE SubscriptionPayments SET TenantId = 1 WHERE TenantId = 1;

PRINT 'Multi-tenant architecture tables created successfully!';
GO
