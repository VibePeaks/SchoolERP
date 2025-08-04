USE SchoolERP;
GO

-- Insert sample buses
INSERT INTO Buses (RegistrationNumber, BusType, Capacity, DriverName, DriverContact, IsActive)
VALUES
('KA01AB1234', 'Mini Bus', 30, 'Rajesh Kumar', '9876543210', 1),
('KA01CD5678', 'Large Bus', 50, 'Mohan Singh', '9876543211', 1);
GO

-- Insert sample routes
INSERT INTO TransportRoutes (RouteName, StartPoint, EndPoint, Stops, BusId, MonthlyFee, IsActive)
VALUES
('North Route', 'MG Road', 'School', '["Stop 1", "Stop 2", "Stop 3"]', 1, 1500.00, 1),
('South Route', 'Electronic City', 'School', '["Stop A", "Stop B", "Stop C"]', 2, 2000.00, 1);
GO

-- Assign transport to students
EXEC sp_AssignTransport @StudentId = 1, @RouteId = 1, @StartDate = '2023-09-01';
EXEC sp_AssignTransport @StudentId = 2, @RouteId = 2, @StartDate = '2023-09-01';
GO

-- View current transport assignments
SELECT s.FirstName, s.LastName, tr.RouteName, b.RegistrationNumber
FROM TransportAssignments ta
JOIN Students s ON ta.StudentId = s.Id
JOIN TransportRoutes tr ON ta.RouteId = tr.Id
JOIN Buses b ON tr.BusId = b.Id
WHERE ta.IsActive = 1;
GO