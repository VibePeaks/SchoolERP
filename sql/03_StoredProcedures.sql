USE SchoolERP;
GO

-- Stored procedure for student registration
CREATE PROCEDURE sp_RegisterStudent
    @FirstName NVARCHAR(50),
    @LastName NVARCHAR(50),
    @DateOfBirth DATE,
    @Gender NVARCHAR(10),
    @Address NVARCHAR(255),
    @Phone NVARCHAR(20),
    @Email NVARCHAR(100),
    @AdmissionDate DATE,
    @ClassId INT
AS
BEGIN
    INSERT INTO Students (FirstName, LastName, DateOfBirth, Gender, Address, Phone, Email, AdmissionDate, ClassId)
    VALUES (@FirstName, @LastName, @DateOfBirth, @Gender, @Address, @Phone, @Email, @AdmissionDate, @ClassId);
    
    RETURN SCOPE_IDENTITY();
END;
GO

-- Stored procedure for fee payment
CREATE PROCEDURE sp_PayFee
    @StudentId INT,
    @FeeStructureId INT,
    @Amount DECIMAL(10,2),
    @PaymentDate DATE
AS
BEGIN
    UPDATE StudentFees
    SET PaidAmount = PaidAmount + @Amount,
        PaymentDate = @PaymentDate,
        Status = CASE WHEN PaidAmount + @Amount >= Amount THEN 'Paid' ELSE 'Partial' END
    WHERE StudentId = @StudentId AND FeeStructureId = @FeeStructureId;
END;
GO

-- Stored procedure for exam result calculation
CREATE PROCEDURE sp_CalculateExamResults
    @ExamId INT
AS
BEGIN
    UPDATE ExamResults
    SET Grade = CASE 
        WHEN (MarksObtained/MaxMarks)*100 >= 90 THEN 'A+'
        WHEN (MarksObtained/MaxMarks)*100 >= 80 THEN 'A'
        WHEN (MarksObtained/MaxMarks)*100 >= 70 THEN 'B+'
        WHEN (MarksObtained/MaxMarks)*100 >= 60 THEN 'B'
        WHEN (MarksObtained/MaxMarks)*100 >= 50 THEN 'C'
        WHEN (MarksObtained/MaxMarks)*100 >= 40 THEN 'D'
        ELSE 'F'
    END
    WHERE ExamId = @ExamId;
END;
GO