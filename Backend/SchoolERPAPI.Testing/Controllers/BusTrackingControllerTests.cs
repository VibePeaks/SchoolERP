using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using SchoolERP.API.Controllers;
using SchoolERP.API.Data;
using SchoolERP.API.Models;

namespace SchoolERPAPI.Testing.Controllers;

public class BusTrackingControllerTests
{
    private readonly Mock<AppDbContext> _mockContext;
    private readonly Mock<ILogger<BusTrackingController>> _mockLogger;
    private readonly BusTrackingController _controller;

    public BusTrackingControllerTests()
    {
        _mockContext = new Mock<AppDbContext>();
        _mockLogger = new Mock<ILogger<BusTrackingController>>();
        _controller = new BusTrackingController(_mockContext.Object, _mockLogger.Object);
    }

    [Fact]
    public async Task GetBusLocations_ReturnsOkResult()
    {
        // Arrange
        var mockBusLocations = new List<BusLocation>
        {
            new BusLocation
            {
                Id = 1,
                BusId = 1,
                Latitude = 12.9716m,
                Longitude = 77.5946m,
                Status = BusStatus.Active,
                Timestamp = DateTime.UtcNow
            }
        }.AsQueryable();

        var mockBusLocationsDbSet = new Mock<DbSet<BusLocation>>();
        mockBusLocationsDbSet.As<IQueryable<BusLocation>>().Setup(m => m.Provider).Returns(mockBusLocations.Provider);
        mockBusLocationsDbSet.As<IQueryable<BusLocation>>().Setup(m => m.Expression).Returns(mockBusLocations.Expression);
        mockBusLocationsDbSet.As<IQueryable<BusLocation>>().Setup(m => m.ElementType).Returns(mockBusLocations.ElementType);
        mockBusLocationsDbSet.As<IQueryable<BusLocation>>().Setup(m => m.GetEnumerator()).Returns(mockBusLocations.GetEnumerator());

        _mockContext.Setup(c => c.BusLocations).Returns(mockBusLocationsDbSet.Object);

        // Mock Buses for the join
        var mockBuses = new List<Bus>
        {
            new Bus { Id = 1, RegistrationNumber = "KA01AB1234" }
        }.AsQueryable();

        var mockBusesDbSet = new Mock<DbSet<Bus>>();
        mockBusesDbSet.As<IQueryable<Bus>>().Setup(m => m.Provider).Returns(mockBuses.Provider);
        mockBusesDbSet.As<IQueryable<Bus>>().Setup(m => m.Expression).Returns(mockBuses.Expression);
        mockBusesDbSet.As<IQueryable<Bus>>().Setup(m => m.ElementType).Returns(mockBuses.ElementType);
        mockBusesDbSet.As<IQueryable<Bus>>().Setup(m => m.GetEnumerator()).Returns(mockBuses.GetEnumerator());

        _mockContext.Setup(c => c.Buses).Returns(mockBusesDbSet.Object);

        // Mock TransportAssignments
        var mockTransportAssignments = new List<TransportAssignment>().AsQueryable();
        var mockTransportAssignmentsDbSet = new Mock<DbSet<TransportAssignment>>();
        mockTransportAssignmentsDbSet.As<IQueryable<TransportAssignment>>().Setup(m => m.Provider).Returns(mockTransportAssignments.Provider);
        mockTransportAssignmentsDbSet.As<IQueryable<TransportAssignment>>().Setup(m => m.Expression).Returns(mockTransportAssignments.Expression);
        mockTransportAssignmentsDbSet.As<IQueryable<TransportAssignment>>().Setup(m => m.ElementType).Returns(mockTransportAssignments.ElementType);
        mockTransportAssignmentsDbSet.As<IQueryable<TransportAssignment>>().Setup(m => m.GetEnumerator()).Returns(mockTransportAssignments.GetEnumerator());

        _mockContext.Setup(c => c.TransportAssignments).Returns(mockTransportAssignmentsDbSet.Object);

        // Mock TransportRoutes
        var mockTransportRoutes = new List<TransportRoute>().AsQueryable();
        var mockTransportRoutesDbSet = new Mock<DbSet<TransportRoute>>();
        mockTransportRoutesDbSet.As<IQueryable<TransportRoute>>().Setup(m => m.Provider).Returns(mockTransportRoutes.Provider);
        mockTransportRoutesDbSet.As<IQueryable<TransportRoute>>().Setup(m => m.Expression).Returns(mockTransportRoutes.Expression);
        mockTransportRoutesDbSet.As<IQueryable<TransportRoute>>().Setup(m => m.ElementType).Returns(mockTransportRoutes.ElementType);
        mockTransportRoutesDbSet.As<IQueryable<TransportRoute>>().Setup(m => m.GetEnumerator()).Returns(mockTransportRoutes.GetEnumerator());

        _mockContext.Setup(c => c.TransportRoutes).Returns(mockTransportRoutesDbSet.Object);

        // Act
        var result = await _controller.GetBusLocations();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);
    }

    [Fact]
    public async Task GetTrips_ReturnsOkResult()
    {
        // Arrange
        var mockBusTrips = new List<BusTrip>
        {
            new BusTrip
            {
                Id = 1,
                BusId = 1,
                RouteId = 1,
                DriverId = 1,
                StartTime = DateTime.UtcNow.AddHours(-2),
                EndTime = DateTime.UtcNow,
                Status = TripStatus.Completed,
                DistanceTravelled = 50.5m,
                StudentsPickedUp = 25,
                StudentsDroppedOff = 25,
                ActualDuration = TimeSpan.FromHours(2)
            }
        }.AsQueryable();

        var mockBusTripsDbSet = new Mock<DbSet<BusTrip>>();
        mockBusTripsDbSet.As<IQueryable<BusTrip>>().Setup(m => m.Provider).Returns(mockBusTrips.Provider);
        mockBusTripsDbSet.As<IQueryable<BusTrip>>().Setup(m => m.Expression).Returns(mockBusTrips.Expression);
        mockBusTripsDbSet.As<IQueryable<BusTrip>>().Setup(m => m.ElementType).Returns(mockBusTrips.ElementType);
        mockBusTripsDbSet.As<IQueryable<BusTrip>>().Setup(m => m.GetEnumerator()).Returns(mockBusTrips.GetEnumerator());

        _mockContext.Setup(c => c.BusTrips).Returns(mockBusTripsDbSet.Object);

        // Mock Bus
        var mockBus = new Bus { Id = 1, RegistrationNumber = "KA01AB1234" };
        _mockContext.Setup(c => c.Buses.FindAsync(1)).ReturnsAsync(mockBus);

        // Mock Route
        var mockRoute = new TransportRoute { Id = 1, RouteName = "Route A" };
        _mockContext.Setup(c => c.TransportRoutes.FindAsync(1)).ReturnsAsync(mockRoute);

        // Mock Driver
        var mockDriver = new User { Id = 1, FirstName = "John", LastName = "Doe" };
        _mockContext.Setup(c => c.Users.FindAsync(1)).ReturnsAsync(mockDriver);

        // Act
        var result = await _controller.GetTrips();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);
    }
}
