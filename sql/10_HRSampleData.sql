USE SchoolERP;
GO

-- Insert sample payroll records
INSERT INTO PayrollRecords (
    EmployeeId, EmployeeType, BasicSalary, Allowances, Deductions, NetSalary, PaymentDate, PaymentMethod)
VALUES
(1, 'Teacher', 50000.00, 10000.00, 5000.00, 55000.00, '2023-10-31', 'Bank Transfer'),
(2, 'Teacher', 55000.00, 11000.00, 5500.00, 60500.00, '2023-10-31', 'Bank Transfer'),
(1, 'Teacher', 50000.00, 10000.00, 5000.00, 55000.00, '2023-11-30', 'Bank Transfer');
GO

-- Example of using payroll calculation procedure
DECLARE @BasicSalary DECIMAL(10,2);
DECLARE @Allowances DECIMAL(10,2);
DECLARE @Deductions DECIMAL(10,2);
DECLARE @NetSalary DECIMAL(10,2);

EXEC sp_CalculatePayroll 
    @EmployeeId = 1,
    @EmployeeType = 'Teacher',
    @Month = 12,
    @Year = 2023,
    @BasicSalary = @BasicSalary OUTPUT,
    @Allowances = @Allowances OUTPUT,
    @Deductions = @Deductions OUTPUT,
    @NetSalary = @NetSalary OUTPUT;

SELECT @BasicSalary AS BasicSalary, 
       @Allowances AS Allowances,
       @Deductions AS Deductions,
       @NetSalary AS NetSalary;
GO