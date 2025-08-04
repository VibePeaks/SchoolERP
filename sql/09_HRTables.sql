USE SchoolERP;
GO

-- Create PayrollRecords table
CREATE TABLE PayrollRecords (
    Id INT PRIMARY KEY IDENTITY(1,1),
    EmployeeId INT NOT NULL,
    EmployeeType NVARCHAR(20) NOT NULL,
    BasicSalary DECIMAL(10,2) NOT NULL,
    Allowances DECIMAL(10,2) NOT NULL,
    Deductions DECIMAL(10,2) NOT NULL,
    NetSalary DECIMAL(10,2) NOT NULL,
    PaymentDate DATE NOT NULL,
    PaymentMethod NVARCHAR(20) NOT NULL,
    Remarks NVARCHAR(255)
);
GO

-- Create stored procedure for payroll calculation
CREATE PROCEDURE sp_CalculatePayroll
    @EmployeeId INT,
    @EmployeeType NVARCHAR(20),
    @Month INT,
    @Year INT
AS
BEGIN
    DECLARE @BasicSalary DECIMAL(10,2);
    DECLARE @Allowances DECIMAL(10,2);
    DECLARE @Deductions DECIMAL(10,2);
    
    -- Get base salary based on employee type
    IF @EmployeeType = 'Teacher'
        SELECT @BasicSalary = 50000 FROM Teachers WHERE Id = @EmployeeId;
    ELSE
        SELECT @BasicSalary = 30000 FROM Staff WHERE Id = @EmployeeId;
    
    -- Calculate allowances (example: 20% of basic)
    SET @Allowances = @BasicSalary * 0.2;
    
    -- Calculate deductions (example: 10% for taxes)
    SET @Deductions = @BasicSalary * 0.1;
    
    -- Return calculated values
    SELECT 
        @BasicSalary AS BasicSalary,
        @Allowances AS Allowances,
        @Deductions AS Deductions,
        (@BasicSalary + @Allowances - @Deductions) AS NetSalary;
END;
GO