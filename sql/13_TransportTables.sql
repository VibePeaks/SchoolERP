USE SchoolERP;
GO

-- Create Buses table
CREATE TABLE Buses (
    Id INT PRIMARY KEY IDENTITY(1,1),
    RegistrationNumber NVARCHAR(20) NOT NULL UNIQUE,
    BusType NVARCHAR(50) NOT NULL,
    Capacity INT NOT NULL,
    DriverName NVARCHAR(100) NOT NULL,
    DriverContact NVARCHAR(20) NOT NULL,
    IsActive BIT DEFAULT 1
);
GO

-- Create TransportRoutes table
CREATE TABLE TransportRoutes (
    Id INT PRIMARY KEY IDENTITY(1,1),
    RouteName NVARCHAR(100) NOT NULL,
    StartPoint NVARCHAR(100) NOT NULL,
    EndPoint NVARCHAR(100) NOT NULL,
    Stops NVARCHAR(MAX) NOT NULL, -- JSON array of stops
    BusId INT NOT NULL,
    MonthlyFee DECIMAL(10,2) NOT NULL,
    IsActive BIT DEFAULT 1,
    FOREIGN KEY (BusId) REFERENCES Buses(Id)
);
GO

-- Create TransportAssignments table
CREATE TABLE TransportAssignments (
    Id INT PRIMARY KEY IDENTITY(1,1),
    StudentId INT NOT NULL,
    RouteId INT NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE,
    IsActive BIT DEFAULT 1,
    FOREIGN KEY (StudentId) REFERENCES Students(Id),
    FOREIGN KEY (RouteId) REFERENCES TransportRoutes(Id)
);
GO

-- Create stored procedure for transport assignment
CREATE PROCEDURE sp_AssignTransport
    @StudentId INT,
    @RouteId INT,
    @StartDate DATE
AS
BEGIN
    -- End any existing active assignment
    UPDATE TransportAssignments
    SET EndDate = @StartDate, IsActive = 0
    WHERE StudentId = @StudentId AND IsActive = 1;
    
    -- Create new assignment
    INSERT INTO TransportAssignments (StudentId, RouteId, StartDate, IsActive)
    VALUES (@StudentId, @RouteId, @StartDate, 1);
END;
GO