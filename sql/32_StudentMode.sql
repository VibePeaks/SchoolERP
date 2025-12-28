-- =====================================================
-- STUDENT MODE IMPLEMENTATION
-- Parent-controlled student access within parent app
-- =====================================================

USE SchoolERP;
GO

-- Add student passkey fields to Students table
ALTER TABLE Students
ADD StudentPasskey NVARCHAR(255) NULL,           -- Hashed passkey (BCrypt)
    StudentPasskeySalt NVARCHAR(50) NULL,        -- Salt for additional security
    IsStudentModeEnabled BIT NOT NULL DEFAULT 0,-- Parent controls access
    StudentModeLastAccess DATETIME NULL,         -- Track last access
    StudentModeAccessCount INT NOT NULL DEFAULT 0,-- Usage statistics
    StudentModeCreatedAt DATETIME NULL DEFAULT GETUTCDATE(),
    StudentModeUpdatedAt DATETIME NULL DEFAULT GETUTCDATE();

-- Create index for performance
CREATE INDEX IX_Students_StudentMode ON Students (IsStudentModeEnabled, StudentModeLastAccess)
WHERE IsStudentModeEnabled = 1;

-- Add audit table for student mode access
CREATE TABLE StudentModeAudit (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    StudentId INT NOT NULL,
    ParentId INT NOT NULL,
    TenantId INT NOT NULL,
    ActionType NVARCHAR(50) NOT NULL, -- 'LOGIN_ATTEMPT', 'LOGIN_SUCCESS', 'LOGOUT', 'PASSKEY_CHANGE'
    Success BIT NOT NULL,
    IpAddress NVARCHAR(50) NULL,
    UserAgent NVARCHAR(500) NULL,
    DeviceInfo NVARCHAR(200) NULL,
    CreatedAt DATETIME NOT NULL DEFAULT GETUTCDATE(),

    FOREIGN KEY (StudentId) REFERENCES Students(Id) ON DELETE CASCADE,
    FOREIGN KEY (ParentId) REFERENCES Parents(Id) ON DELETE CASCADE,
    FOREIGN KEY (TenantId) REFERENCES Tenants(Id) ON DELETE CASCADE
);

-- Create index for audit queries
CREATE INDEX IX_StudentModeAudit_Student ON StudentModeAudit (StudentId, CreatedAt DESC);
CREATE INDEX IX_StudentModeAudit_Parent ON StudentModeAudit (ParentId, CreatedAt DESC);

-- Sample data for testing
-- Note: In production, passkeys should be set by parents through the UI

-- Update existing students with sample passkeys (hashed)
-- In production, this would be done through parent UI with proper hashing
UPDATE Students
SET StudentPasskey = '$2a$11$example.hash.for.demo.purposes.only',
    IsStudentModeEnabled = 1,
    StudentModeCreatedAt = GETUTCDATE()
WHERE Id IN (SELECT TOP 3 Id FROM Students ORDER BY Id);

PRINT 'Student Mode database schema created successfully!';
PRINT 'Next steps:';
PRINT '1. Parents can enable Student Mode for their children through the app';
PRINT '2. Students use simple passkeys (4-8 characters) to access their dashboard';
PRINT '3. All student access is logged and can be monitored by parents';
PRINT '4. Parents maintain full control over student access and can revoke it anytime';
