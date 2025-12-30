using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolERP.API.Data;
using SchoolERP.API.Models;
using System.Security.Claims;

namespace SchoolERP.API.Controllers
{
    [ApiController]
    [Route("api/bus-tracking")]
    [Authorize]
    public class BusTrackingController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<BusTrackingController> _logger;

        public BusTrackingController(AppDbContext context, ILogger<BusTrackingController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/bus-tracking/locations
        [HttpGet("locations")]
        public async Task<IActionResult> GetBusLocations([FromQuery] int? busId = null)
        {
            var query = _context.BusLocations
                .Where(bl => bl.IsActive);

            if (busId.HasValue)
            {
                query = query.Where(bl => bl.BusId == busId.Value);
            }

            // Get latest location for each bus
            var locations = await query
                .GroupBy(bl => bl.BusId)
                .Select(g => g.OrderByDescending(bl => bl.Timestamp).First())
                .Select(bl => new
                {
                    bl.Id,
                    bl.BusId,
                    BusNumber = _context.Buses
                        .Where(b => b.Id == bl.BusId)
                        .Select(b => b.RegistrationNumber)
                        .FirstOrDefault(),
                    bl.Latitude,
                    bl.Longitude,
                    bl.Speed,
                    bl.Heading,
                    bl.Accuracy,
                    Status = bl.Status.ToString().ToLower(),
                    bl.CurrentStop,
                    bl.NextStop,
                    bl.EstimatedArrival,
                    LastUpdate = bl.Timestamp,
                    StudentsOnBoard = _context.TransportAssignments
                        .Count(ta => ta.RouteId == bl.RouteId && ta.IsActive),
                    RouteName = _context.TransportRoutes
                        .Where(tr => tr.Id == bl.RouteId)
                        .Select(tr => tr.RouteName)
                        .FirstOrDefault(),
                    bl.IsEmergency,
                    bl.EmergencyMessage
                })
                .ToListAsync();

            return Ok(locations);
        }

        // GET: api/bus-tracking/parent/{parentId}
        [HttpGet("parent/{parentId}")]
        [AllowAnonymous] // Allow parents to access via their specific endpoint
        public async Task<IActionResult> GetParentBusTracking(int parentId)
        {
            // Get all students for this parent
            var studentIds = await _context.StudentParents
                .Where(sp => sp.ParentId == parentId)
                .Select(sp => sp.StudentId)
                .ToListAsync();

            if (!studentIds.Any())
            {
                return Ok(new { students = new List<object>(), buses = new List<object>() });
            }

            // Get transport assignments for these students
            var assignments = await _context.TransportAssignments
                .Where(ta => studentIds.Contains(ta.StudentId) && ta.IsActive)
                .ToListAsync();

            var studentAssignments = new List<object>();
            foreach (var ta in assignments)
            {
                var student = await _context.Students.FindAsync(ta.StudentId);
                var route = await _context.TransportRoutes.FindAsync(ta.RouteId);
                var bus = route != null ? await _context.Buses.FindAsync(route.BusId) : null;

                studentAssignments.Add(new
                {
                    StudentId = student?.Id ?? ta.StudentId,
                    StudentName = student != null ? $"{student.FirstName} {student.LastName}" : "Unknown",
                    BusId = bus?.Id ?? 0,
                    BusNumber = bus?.RegistrationNumber ?? "Unknown",
                    RouteName = route?.RouteName ?? "Unknown",
                    Status = "on_route"
                });
            }

            // Get current bus locations for assigned buses
            var busIds = assignments.Select(a => a.RouteId).Distinct().ToList();
            var routeBusIds = await _context.TransportRoutes
                .Where(tr => busIds.Contains(tr.Id))
                .Select(tr => tr.BusId)
                .Distinct()
                .ToListAsync();

            var busLocations = await _context.BusLocations
                .Where(bl => routeBusIds.Contains(bl.BusId) && bl.IsActive)
                .GroupBy(bl => bl.BusId)
                .Select(g => g.OrderByDescending(bl => bl.Timestamp).First())
                .Select(bl => new
                {
                    bl.BusId,
                    bl.Latitude,
                    bl.Longitude,
                    bl.Speed,
                    Status = bl.Status.ToString().ToLower(),
                    bl.CurrentStop,
                    bl.NextStop,
                    bl.EstimatedArrival,
                    LastUpdate = bl.Timestamp,
                    StudentsOnBoard = _context.TransportAssignments
                        .Count(ta => ta.RouteId == bl.RouteId && ta.IsActive)
                })
                .ToListAsync();

            return Ok(new
            {
                students = studentAssignments,
                buses = busLocations
            });
        }

        // GET: api/bus-tracking/routes/{routeId}
        [HttpGet("routes/{routeId}")]
        public async Task<IActionResult> GetRouteDetails(int routeId)
        {
            var route = await _context.TransportRoutes
                .FirstOrDefaultAsync(r => r.Id == routeId);

            if (route == null)
                return NotFound("Route not found");

            var studentCount = await _context.TransportAssignments
                .CountAsync(ta => ta.RouteId == routeId && ta.IsActive);

            var bus = await _context.Buses.FirstOrDefaultAsync(b => b.Id == route.BusId);

            return Ok(new
            {
                route = new
                {
                    route.Id,
                    route.RouteName,
                    route.StartPoint,
                    route.EndPoint,
                    route.Stops,
                    route.MonthlyFee,
                    StudentCount = studentCount
                },
                bus = bus != null ? new
                {
                    bus.Id,
                    bus.RegistrationNumber,
                    bus.Capacity,
                    bus.DriverName,
                    bus.DriverContact
                } : null
            });
        }

        // POST: api/bus-tracking/locations
        [HttpPost("locations")]
        [AllowAnonymous] // Allow GPS devices/buses to post location updates
        public async Task<IActionResult> UpdateBusLocation([FromBody] BusLocationUpdate update)
        {
            // In production, validate API key or JWT token for bus devices
            var tenantId = GetCurrentTenantId();

            // Find or create bus location record
            var existingLocation = await _context.BusLocations
                .FirstOrDefaultAsync(bl => bl.BusId == update.BusId && bl.IsActive);

            if (existingLocation != null)
            {
                // Update existing location
                existingLocation.Latitude = update.Latitude;
                existingLocation.Longitude = update.Longitude;
                existingLocation.Speed = update.Speed;
                existingLocation.Heading = update.Heading;
                existingLocation.Accuracy = update.Accuracy;
                existingLocation.LocationSource = update.LocationSource ?? "GPS";
                existingLocation.Timestamp = DateTime.UtcNow;
                existingLocation.Status = Enum.Parse<BusStatus>(update.Status ?? "Active");
                existingLocation.CurrentStop = update.CurrentStop;
                existingLocation.NextStop = update.NextStop;
                existingLocation.EstimatedArrival = update.EstimatedArrival;
                existingLocation.IsEmergency = update.IsEmergency ?? false;
                existingLocation.EmergencyMessage = update.EmergencyMessage;
            }
            else
            {
                // Create new location record
                var busLocation = new BusLocation
                {
                    BusId = update.BusId,
                    Latitude = update.Latitude,
                    Longitude = update.Longitude,
                    Speed = update.Speed,
                    Heading = update.Heading,
                    Accuracy = update.Accuracy,
                    LocationSource = update.LocationSource ?? "GPS",
                    Timestamp = DateTime.UtcNow,
                    Status = Enum.Parse<BusStatus>(update.Status ?? "Active"),
                    CurrentStop = update.CurrentStop,
                    NextStop = update.NextStop,
                    EstimatedArrival = update.EstimatedArrival,
                    IsEmergency = update.IsEmergency ?? false,
                    EmergencyMessage = update.EmergencyMessage,
                    TenantId = tenantId
                };
                _context.BusLocations.Add(busLocation);
            }

            await _context.SaveChangesAsync();

            // Check geofences and send alerts if needed
            await CheckGeofenceAlerts(update.BusId, update.Latitude, update.Longitude);

            return Ok(new { success = true, timestamp = DateTime.UtcNow });
        }

        // GET: api/bus-tracking/alerts
        [HttpGet("alerts")]
        public async Task<IActionResult> GetAlerts([FromQuery] DateTime? since = null, [FromQuery] bool unresolvedOnly = false)
        {
            var tenantId = GetCurrentTenantId();

            var query = _context.BusAlerts
                .Where(ba => ba.TenantId == tenantId);

            if (since.HasValue)
            {
                query = query.Where(ba => ba.Timestamp >= since.Value);
            }

            if (unresolvedOnly)
            {
                query = query.Where(ba => !ba.IsResolved);
            }

            var alerts = await query
                .OrderByDescending(ba => ba.Timestamp)
                .Take(50)
                .Select(ba => new
                {
                    ba.Id,
                    ba.Title,
                    ba.Message,
                    Type = ba.Type.ToString(),
                    Severity = ba.Severity.ToString(),
                    ba.Timestamp,
                    ba.IsResolved,
                    ba.ResolvedAt,
                    ba.Latitude,
                    ba.Longitude,
                    BusNumber = _context.Buses
                        .Where(b => b.Id == ba.BusId)
                        .Select(b => b.RegistrationNumber)
                        .FirstOrDefault(),
                    StudentName = _context.Students
                        .Where(s => s.Id == ba.StudentId)
                        .Select(s => s.FirstName + " " + s.LastName)
                        .FirstOrDefault()
                })
                .ToListAsync();

            return Ok(alerts);
        }

        // POST: api/bus-tracking/alerts/{alertId}/resolve
        [HttpPost("alerts/{alertId}/resolve")]
        public async Task<IActionResult> ResolveAlert(int alertId, [FromBody] ResolveAlertRequest request)
        {
            var tenantId = GetCurrentTenantId();

            var alert = await _context.BusAlerts
                .FirstOrDefaultAsync(ba => ba.Id == alertId && ba.TenantId == tenantId);

            if (alert == null)
                return NotFound("Alert not found");

            alert.IsResolved = true;
            alert.ResolvedAt = DateTime.UtcNow;
            alert.ResolvedBy = request.ResolvedBy ?? "System";

            await _context.SaveChangesAsync();

            return Ok(new { success = true });
        }

        // GET: api/bus-tracking/trips
        [HttpGet("trips")]
        public async Task<IActionResult> GetTrips([FromQuery] DateTime? date = null, [FromQuery] int? busId = null)
        {
            var tenantId = GetCurrentTenantId();
            var queryDate = date ?? DateTime.UtcNow.Date;

            var query = _context.BusTrips
                .Include(bt => bt.Bus)
                .Include(bt => bt.Route)
                .Include(bt => bt.Driver)
                .Where(bt => bt.TenantId == tenantId &&
                           bt.StartTime.Date == queryDate);

            if (busId.HasValue)
            {
                query = query.Where(bt => bt.BusId == busId.Value);
            }

            var trips = await query
                .OrderByDescending(bt => bt.StartTime)
                .Select(bt => new
                {
                    bt.Id,
                    bt.StartTime,
                    bt.EndTime,
                    Status = bt.Status.ToString(),
                    BusNumber = bt.Bus.RegistrationNumber,
                    RouteName = bt.Route.RouteName,
                    DriverName = bt.Driver.FirstName + " " + bt.Driver.LastName,
                    bt.DistanceTravelled,
                    bt.StudentsPickedUp,
                    bt.StudentsDroppedOff,
                    Duration = bt.ActualDuration.HasValue ? bt.ActualDuration.Value.ToString(@"hh\:mm\:ss") : null
                })
                .ToListAsync();

            return Ok(trips);
        }

        // POST: api/bus-tracking/trips
        [HttpPost("trips")]
        public async Task<IActionResult> StartTrip([FromBody] StartTripRequest request)
        {
            var tenantId = GetCurrentTenantId();

            var trip = new BusTrip
            {
                BusId = request.BusId,
                RouteId = request.RouteId,
                StartTime = DateTime.UtcNow,
                Status = TripStatus.InProgress,
                DriverId = request.DriverId,
                TenantId = tenantId
            };

            _context.BusTrips.Add(trip);
            await _context.SaveChangesAsync();

            return Ok(new { trip.Id, trip.StartTime });
        }

        // PUT: api/bus-tracking/trips/{tripId}/end
        [HttpPut("trips/{tripId}/end")]
        public async Task<IActionResult> EndTrip(int tripId, [FromBody] EndTripRequest request)
        {
            var tenantId = GetCurrentTenantId();

            var trip = await _context.BusTrips
                .FirstOrDefaultAsync(bt => bt.Id == tripId && bt.TenantId == tenantId);

            if (trip == null)
                return NotFound("Trip not found");

            trip.EndTime = DateTime.UtcNow;
            trip.Status = TripStatus.Completed;
            trip.DistanceTravelled = request.DistanceTravelled;
            trip.StudentsPickedUp = request.StudentsPickedUp;
            trip.StudentsDroppedOff = request.StudentsDroppedOff;
            trip.ActualDuration = trip.EndTime - trip.StartTime;

            await _context.SaveChangesAsync();

            return Ok(new { success = true, duration = trip.ActualDuration });
        }

        // Helper methods
        private async Task CheckGeofenceAlerts(int busId, decimal latitude, decimal longitude)
        {
            // Check if bus is in any geofences and trigger actions
            var geofences = await _context.BusGeofences
                .Where(gf => gf.IsActive && (gf.BusId == busId || gf.BusId == null))
                .ToListAsync();

            foreach (var geofence in geofences)
            {
                var distance = CalculateDistance(latitude, longitude,
                    geofence.CenterLatitude, geofence.CenterLongitude);

                if (distance <= (double)geofence.Radius)
                {
                    // Bus is inside geofence - trigger entry action
                    await TriggerGeofenceAction(geofence, busId, "entry", latitude, longitude);
                }
            }
        }

        private async Task TriggerGeofenceAction(BusGeofence geofence, int busId, string actionType, decimal lat, decimal lng)
        {
            // Create alert based on geofence action
            var geofenceName = geofence.Name ?? "Unknown Geofence";
            var alert = new BusAlert
            {
                BusId = busId,
                Type = actionType == "entry" ? AlertType.Safety : AlertType.Safety,
                Severity = AlertSeverity.Low,
                Title = $"{geofenceName} - Bus {actionType}",
                Message = $"Bus entered {geofenceName} geofence area",
                Timestamp = DateTime.UtcNow,
                Latitude = lat,
                Longitude = lng,
                TenantId = GetCurrentTenantId()
            };

            _context.BusAlerts.Add(alert);
            await _context.SaveChangesAsync();

            // TODO: Send notifications to parents and admin based on geofence settings
        }

        private double CalculateDistance(decimal lat1, decimal lon1, decimal lat2, decimal lon2)
        {
            // Haversine formula for distance calculation
            const double R = 6371; // Earth's radius in kilometers

            double dLat = ToRadians((double)(lat2 - lat1));
            double dLon = ToRadians((double)(lon2 - lon1));

            double a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                      Math.Cos(ToRadians((double)lat1)) * Math.Cos(ToRadians((double)lat2)) *
                      Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

            double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            return R * c * 1000; // Convert to meters
        }

        private double ToRadians(double degrees)
        {
            return degrees * Math.PI / 180;
        }

        private int GetCurrentTenantId()
        {
            // In a real implementation, get from claims or context
            return 1; // Default tenant
        }
    }

    // Request/Response models
    public class BusLocationUpdate
    {
        public int BusId { get; set; }
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
        public decimal? Speed { get; set; }
        public decimal? Heading { get; set; }
        public decimal? Accuracy { get; set; }
        public string? LocationSource { get; set; }
        public string? Status { get; set; }
        public string? CurrentStop { get; set; }
        public string? NextStop { get; set; }
        public DateTime? EstimatedArrival { get; set; }
        public bool? IsEmergency { get; set; }
        public string? EmergencyMessage { get; set; }
    }

    public class ResolveAlertRequest
    {
        public string? ResolvedBy { get; set; }
        public string? Notes { get; set; }
    }

    public class StartTripRequest
    {
        public int BusId { get; set; }
        public int RouteId { get; set; }
        public int DriverId { get; set; }
    }

    public class EndTripRequest
    {
        public decimal DistanceTravelled { get; set; }
        public int StudentsPickedUp { get; set; }
        public int StudentsDroppedOff { get; set; }
    }
}
