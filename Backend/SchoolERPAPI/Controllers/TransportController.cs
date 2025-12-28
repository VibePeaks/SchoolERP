using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolERPAPI.Data;
using SchoolERPAPI.Services;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace SchoolERPAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TransportController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IDatabaseService _databaseService;

        public TransportController(AppDbContext context, IDatabaseService databaseService)
        {
            _context = context;
            _databaseService = databaseService;
        }

        // GET: api/transport/routes
        [HttpGet("routes")]
        public async Task<IActionResult> GetRoutes()
        {
            var routes = await _context.TransportRoutes
                .Include(tr => tr.Bus)
                .Include(tr => tr.Driver)
                .Where(tr => tr.IsActive)
                .Select(tr => new
                {
                    tr.Id,
                    tr.RouteName,
                    tr.RouteNumber,
                    tr.StartPoint,
                    tr.EndPoint,
                    tr.DistanceKm,
                    tr.EstimatedDuration,
                    tr.Status,
                    Bus = tr.Bus != null ? new
                    {
                        tr.Bus.Id,
                        tr.Bus.BusNumber,
                        tr.Bus.Capacity,
                        tr.Bus.Status
                    } : null,
                    Driver = tr.Driver != null ? new
                    {
                        tr.Driver.Id,
                        tr.Driver.FirstName,
                        tr.Driver.LastName,
                        tr.Driver.PhoneNumber
                    } : null,
                    StudentCount = _context.TransportAssignments
                        .Count(ta => ta.RouteId == tr.Id && ta.IsActive),
                    StopCount = _context.BusRouteStops
                        .Count(brs => brs.RouteId == tr.Id)
                })
                .ToListAsync();

            return Ok(new { success = true, data = routes });
        }

        // GET: api/transport/routes/{id}
        [HttpGet("routes/{id}")]
        public async Task<IActionResult> GetRoute(int id)
        {
            var route = await _context.TransportRoutes
                .Include(tr => tr.Bus)
                .Include(tr => tr.Driver)
                .Include(tr => tr.BusRouteStops)
                    .ThenInclude(brs => brs.StopLocation)
                .Include(tr => tr.TransportAssignments)
                    .ThenInclude(ta => ta.Student)
                .FirstOrDefaultAsync(tr => tr.Id == id);

            if (route == null)
            {
                return NotFound(new { success = false, message = "Route not found" });
            }

            return Ok(new
            {
                success = true,
                data = new
                {
                    route.Id,
                    route.RouteName,
                    route.RouteNumber,
                    route.StartPoint,
                    route.EndPoint,
                    route.DistanceKm,
                    route.EstimatedDuration,
                    route.Status,
                    Bus = route.Bus != null ? new
                    {
                        route.Bus.Id,
                        route.Bus.BusNumber,
                        route.Bus.Capacity,
                        route.Bus.Status
                    } : null,
                    Driver = route.Driver != null ? new
                    {
                        route.Driver.Id,
                        route.Driver.FirstName,
                        route.Driver.LastName,
                        route.Driver.PhoneNumber
                    } : null,
                    Stops = route.BusRouteStops.Select(brs => new
                    {
                        brs.Id,
                        brs.StopOrder,
                        brs.EstimatedArrival,
                        StopLocation = brs.StopLocation != null ? new
                        {
                            brs.StopLocation.Id,
                            brs.StopLocation.StopName,
                            brs.StopLocation.Latitude,
                            brs.StopLocation.Longitude
                        } : null,
                        StudentCount = _context.TransportAssignments
                            .Count(ta => ta.RouteId == route.Id && ta.StopId == brs.Id && ta.IsActive)
                    }),
                    Students = route.TransportAssignments
                        .Where(ta => ta.IsActive)
                        .Select(ta => new
                        {
                            ta.Id,
                            ta.StudentId,
                            Student = new
                            {
                                ta.Student.Id,
                                ta.Student.FirstName,
                                ta.Student.LastName,
                                ta.Student.Class,
                                ta.Student.Section
                            },
                            ta.PickupStopId,
                            ta.DropStopId,
                            ta.FareAmount,
                            ta.IsActive
                        })
                }
            });
        }

        // GET: api/transport/drivers/{driverId}/routes
        [HttpGet("drivers/{driverId}/routes")]
        public async Task<IActionResult> GetDriverRoutes(int driverId)
        {
            var routes = await _context.TransportRoutes
                .Where(tr => tr.DriverId == driverId && tr.IsActive)
                .Include(tr => tr.Bus)
                .Include(tr => tr.BusRouteStops)
                .Select(tr => new
                {
                    tr.Id,
                    tr.RouteName,
                    tr.RouteNumber,
                    tr.Status,
                    tr.StartPoint,
                    tr.EndPoint,
                    Bus = tr.Bus != null ? new
                    {
                        tr.Bus.Id,
                        tr.Bus.BusNumber,
                        tr.Bus.Status
                    } : null,
                    TotalStops = tr.BusRouteStops.Count,
                    CompletedStops = _context.BusTripLogs
                        .Count(btl => btl.RouteId == tr.Id && btl.Status == "completed"),
                    StudentCount = _context.TransportAssignments
                        .Count(ta => ta.RouteId == tr.Id && ta.IsActive)
                })
                .ToListAsync();

            return Ok(new { success = true, data = routes });
        }

        // GET: api/transport/bus/{busId}/location
        [HttpGet("bus/{busId}/location")]
        public async Task<IActionResult> GetBusLocation(int busId)
        {
            var bus = await _context.Buses
                .Include(b => b.Driver)
                .FirstOrDefaultAsync(b => b.Id == busId);

            if (bus == null)
            {
                return NotFound(new { success = false, message = "Bus not found" });
            }

            // Get latest location from bus locations table
            var latestLocation = await _context.BusLocations
                .Where(bl => bl.BusId == busId)
                .OrderByDescending(bl => bl.Timestamp)
                .FirstOrDefaultAsync();

            // Get current route and next stop
            var currentRoute = await _context.TransportRoutes
                .Where(tr => tr.BusId == busId && tr.Status == "in_progress")
                .Include(tr => tr.BusRouteStops)
                    .ThenInclude(brs => brs.StopLocation)
                .FirstOrDefaultAsync();

            var nextStop = currentRoute?.BusRouteStops
                .Where(brs => !brs.IsCompleted)
                .OrderBy(brs => brs.StopOrder)
                .FirstOrDefault();

            // Get students on board
            var studentsOnBoard = await _context.TransportAssignments
                .Where(ta => ta.RouteId == currentRoute?.Id && ta.Status == "picked_up")
                .Include(ta => ta.Student)
                .Select(ta => new
                {
                    ta.Student.Id,
                    ta.Student.FirstName,
                    ta.Student.LastName,
                    ta.Student.Class,
                    ta.Student.Section
                })
                .ToListAsync();

            return Ok(new
            {
                success = true,
                data = new
                {
                    busId = bus.Id,
                    busNumber = bus.BusNumber,
                    status = bus.Status,
                    currentLocation = latestLocation != null ? new
                    {
                        latitude = latestLocation.Latitude,
                        longitude = latestLocation.Longitude,
                        speed = latestLocation.Speed,
                        heading = latestLocation.Heading,
                        timestamp = latestLocation.Timestamp,
                        address = latestLocation.Address
                    } : null,
                    driver = bus.Driver != null ? new
                    {
                        bus.Driver.Id,
                        bus.Driver.FirstName,
                        bus.Driver.LastName,
                        bus.Driver.PhoneNumber
                    } : null,
                    currentRoute = currentRoute != null ? new
                    {
                        currentRoute.Id,
                        currentRoute.RouteName,
                        currentRoute.Status
                    } : null,
                    nextStop = nextStop != null ? new
                    {
                        nextStop.Id,
                        nextStop.StopOrder,
                        nextStop.EstimatedArrival,
                        stopLocation = nextStop.StopLocation != null ? new
                        {
                            nextStop.StopLocation.Id,
                            nextStop.StopLocation.StopName,
                            nextStop.StopLocation.Latitude,
                            nextStop.StopLocation.Longitude
                        } : null
                    } : null,
                    studentsOnBoard = studentsOnBoard,
                    summary = new
                    {
                        studentsOnBoardCount = studentsOnBoard.Count,
                        totalCapacity = bus.Capacity,
                        remainingCapacity = bus.Capacity - studentsOnBoard.Count
                    }
                }
            });
        }

        // POST: api/transport/bus/{busId}/location
        [HttpPost("bus/{busId}/location")]
        [Authorize(Roles = "driver")]
        public async Task<IActionResult> UpdateBusLocation(int busId, [FromBody] LocationUpdateRequest request)
        {
            var bus = await _context.Buses.FindAsync(busId);
            if (bus == null)
            {
                return NotFound(new { success = false, message = "Bus not found" });
            }

            var location = new BusLocation
            {
                BusId = busId,
                Latitude = request.Latitude,
                Longitude = request.Longitude,
                Speed = request.Speed ?? 0,
                Heading = request.Heading ?? 0,
                Address = request.Address,
                Timestamp = DateTime.UtcNow
            };

            _context.BusLocations.Add(location);

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Location updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Failed to update location", error = ex.Message });
            }
        }

        // POST: api/transport/pickups/{pickupId}/pickup
        [HttpPost("pickups/{pickupId}/pickup")]
        [Authorize(Roles = "driver")]
        public async Task<IActionResult> MarkStudentPickup(int pickupId, [FromBody] PickupUpdateRequest request)
        {
            var pickup = await _context.TransportAssignments
                .Include(ta => ta.Student)
                .FirstOrDefaultAsync(ta => ta.Id == pickupId);

            if (pickup == null)
            {
                return NotFound(new { success = false, message = "Pickup not found" });
            }

            pickup.Status = "picked_up";
            pickup.PickedUpAt = DateTime.UtcNow;
            pickup.PickedUpBy = request.DriverId;
            pickup.Notes = request.Notes;

            // Log the pickup
            var log = new BusTripLog
            {
                RouteId = pickup.RouteId,
                StudentId = pickup.StudentId,
                StopId = pickup.PickupStopId,
                Action = "pickup",
                Timestamp = DateTime.UtcNow,
                DriverId = request.DriverId,
                Notes = request.Notes
            };

            _context.BusTripLogs.Add(log);

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Student pickup recorded successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Failed to record pickup", error = ex.Message });
            }
        }

        // POST: api/transport/pickups/{pickupId}/dropoff
        [HttpPost("pickups/{pickupId}/dropoff")]
        [Authorize(Roles = "driver")]
        public async Task<IActionResult> MarkStudentDropoff(int pickupId, [FromBody] DropoffUpdateRequest request)
        {
            var pickup = await _context.TransportAssignments
                .Include(ta => ta.Student)
                .FirstOrDefaultAsync(ta => ta.Id == pickupId);

            if (pickup == null)
            {
                return NotFound(new { success = false, message = "Dropoff not found" });
            }

            pickup.Status = "dropped_off";
            pickup.DroppedOffAt = DateTime.UtcNow;
            pickup.DroppedOffBy = request.DriverId;
            pickup.Notes = request.Notes;

            // Log the dropoff
            var log = new BusTripLog
            {
                RouteId = pickup.RouteId,
                StudentId = pickup.StudentId,
                StopId = pickup.DropStopId,
                Action = "dropoff",
                Timestamp = DateTime.UtcNow,
                DriverId = request.DriverId,
                Notes = request.Notes
            };

            _context.BusTripLogs.Add(log);

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Student dropoff recorded successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Failed to record dropoff", error = ex.Message });
            }
        }

        // GET: api/transport/routes/{routeId}/students
        [HttpGet("routes/{routeId}/students")]
        public async Task<IActionResult> GetRouteStudents(int routeId, [FromQuery] string? status = null)
        {
            var query = _context.TransportAssignments
                .Where(ta => ta.RouteId == routeId)
                .Include(ta => ta.Student)
                .Include(ta => ta.PickupStop)
                    .ThenInclude(brs => brs.StopLocation)
                .Include(ta => ta.DropStop)
                    .ThenInclude(brs => brs.StopLocation)
                .AsQueryable();

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(ta => ta.Status == status);
            }

            var students = await query
                .Select(ta => new
                {
                    ta.Id,
                    ta.StudentId,
                    Student = new
                    {
                        ta.Student.Id,
                        ta.Student.FirstName,
                        ta.Student.LastName,
                        ta.Student.RollNumber,
                        ta.Student.Class,
                        ta.Student.Section,
                        ta.Student.PhoneNumber
                    },
                    ta.Status,
                    ta.FareAmount,
                    PickupStop = ta.PickupStop != null ? new
                    {
                        ta.PickupStop.Id,
                        ta.PickupStop.StopOrder,
                        ta.PickupStop.EstimatedArrival,
                        Location = ta.PickupStop.StopLocation != null ? new
                        {
                            ta.PickupStop.StopLocation.Id,
                            ta.PickupStop.StopLocation.StopName,
                            ta.PickupStop.StopLocation.Latitude,
                            ta.PickupStop.StopLocation.Longitude
                        } : null
                    } : null,
                    DropStop = ta.DropStop != null ? new
                    {
                        ta.DropStop.Id,
                        ta.DropStop.StopOrder,
                        ta.DropStop.EstimatedArrival,
                        Location = ta.DropStop.StopLocation != null ? new
                        {
                            ta.DropStop.StopLocation.Id,
                            ta.DropStop.StopLocation.StopName,
                            ta.DropStop.StopLocation.Latitude,
                            ta.DropStop.StopLocation.Longitude
                        } : null
                    } : null,
                    ta.PickedUpAt,
                    ta.DroppedOffAt,
                    ta.Notes
                })
                .ToListAsync();

            return Ok(new
            {
                success = true,
                data = students,
                summary = new
                {
                    totalStudents = students.Count,
                    pendingPickups = students.Count(s => s.Status == "assigned"),
                    pickedUp = students.Count(s => s.Status == "picked_up"),
                    droppedOff = students.Count(s => s.Status == "dropped_off")
                }
            });
        }

        // POST: api/transport/routes/{routeId}/start
        [HttpPost("routes/{routeId}/start")]
        [Authorize(Roles = "driver")]
        public async Task<IActionResult> StartRoute(int routeId, [FromBody] RouteStartRequest request)
        {
            var route = await _context.TransportRoutes.FindAsync(routeId);
            if (route == null)
            {
                return NotFound(new { success = false, message = "Route not found" });
            }

            route.Status = "in_progress";
            route.ActualStartTime = DateTime.UtcNow;

            // Log route start
            var log = new BusTripLog
            {
                RouteId = routeId,
                Action = "route_started",
                Timestamp = DateTime.UtcNow,
                DriverId = request.DriverId,
                Notes = request.Notes
            };

            _context.BusTripLogs.Add(log);

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Route started successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Failed to start route", error = ex.Message });
            }
        }

        // POST: api/transport/routes/{routeId}/complete
        [HttpPost("routes/{routeId}/complete")]
        [Authorize(Roles = "driver")]
        public async Task<IActionResult> CompleteRoute(int routeId, [FromBody] RouteCompleteRequest request)
        {
            var route = await _context.TransportRoutes.FindAsync(routeId);
            if (route == null)
            {
                return NotFound(new { success = false, message = "Route not found" });
            }

            route.Status = "completed";
            route.ActualEndTime = DateTime.UtcNow;

            // Log route completion
            var log = new BusTripLog
            {
                RouteId = routeId,
                Action = "route_completed",
                Timestamp = DateTime.UtcNow,
                DriverId = request.DriverId,
                Notes = request.Notes
            };

            _context.BusTripLogs.Add(log);

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Route completed successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Failed to complete route", error = ex.Message });
            }
        }
    }

    // Request/Response Models
    public class LocationUpdateRequest
    {
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public double? Speed { get; set; }
        public double? Heading { get; set; }
        public string? Address { get; set; }
    }

    public class PickupUpdateRequest
    {
        public int DriverId { get; set; }
        public string? Notes { get; set; }
    }

    public class DropoffUpdateRequest
    {
        public int DriverId { get; set; }
        public string? Notes { get; set; }
    }

    public class RouteStartRequest
    {
        public int DriverId { get; set; }
        public string? Notes { get; set; }
    }

    public class RouteCompleteRequest
    {
        public int DriverId { get; set; }
        public string? Notes { get; set; }
    }
}
