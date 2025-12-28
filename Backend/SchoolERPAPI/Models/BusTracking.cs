using System.Text.Json.Serialization;

namespace SchoolERP.API.Models
{
    public class BusLocation : BaseEntity
    {
        public int BusId { get; set; }
        public Bus Bus { get; set; }
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
        public decimal? Speed { get; set; } // km/h
        public decimal? Heading { get; set; } // degrees (0-360)
        public decimal? Accuracy { get; set; } // GPS accuracy in meters
        public string LocationSource { get; set; } // GPS, Network, Manual
        public DateTime Timestamp { get; set; }
        public bool IsActive { get; set; } = true;

        // Route information
        public int? RouteId { get; set; }
        public TransportRoute Route { get; set; }
        public string CurrentStop { get; set; }
        public string NextStop { get; set; }
        public DateTime? EstimatedArrival { get; set; }

        // Status
        public BusStatus Status { get; set; } = BusStatus.Inactive;
        public string StatusMessage { get; set; }

        // Emergency features
        public bool IsEmergency { get; set; } = false;
        public string EmergencyMessage { get; set; }
    }

    public enum BusStatus
    {
        Inactive,
        Active,
        OnRoute,
        AtStop,
        Delayed,
        Emergency,
        Maintenance,
        OffDuty
    }

    public class BusTrip : BaseEntity
    {
        public int BusId { get; set; }
        public Bus Bus { get; set; }
        public int RouteId { get; set; }
        public TransportRoute Route { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public TripStatus Status { get; set; } = TripStatus.Scheduled;
        public int DriverId { get; set; }
        public User Driver { get; set; }

        // Trip metrics
        public decimal DistanceTravelled { get; set; } // km
        public int StudentsPickedUp { get; set; }
        public int StudentsDroppedOff { get; set; }
        public TimeSpan? ActualDuration { get; set; }

        // Navigation
        [JsonIgnore]
        public ICollection<BusStopLog> StopLogs { get; set; }
    }

    public enum TripStatus
    {
        Scheduled,
        InProgress,
        Completed,
        Cancelled,
        Delayed
    }

    public class BusStopLog : BaseEntity
    {
        public int TripId { get; set; }
        public BusTrip Trip { get; set; }
        public string StopName { get; set; }
        public DateTime ScheduledArrival { get; set; }
        public DateTime? ActualArrival { get; set; }
        public DateTime? DepartureTime { get; set; }
        public int StudentsPickedUp { get; set; }
        public int StudentsDroppedOff { get; set; }
        public string Remarks { get; set; }

        // GPS coordinates of stop
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
    }

    public class BusAlert : BaseEntity
    {
        public int BusId { get; set; }
        public Bus Bus { get; set; }
        public AlertType Type { get; set; }
        public AlertSeverity Severity { get; set; }
        public string Title { get; set; }
        public string Message { get; set; }
        public DateTime Timestamp { get; set; }
        public bool IsResolved { get; set; } = false;
        public DateTime? ResolvedAt { get; set; }
        public string ResolvedBy { get; set; }

        // Location context
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }

        // Related entities
        public int? StudentId { get; set; }
        public Student RelatedStudent { get; set; }
        public int? TripId { get; set; }
        public BusTrip RelatedTrip { get; set; }

        // Notifications
        public bool ParentsNotified { get; set; } = false;
        public bool AdminNotified { get; set; } = false;
        public string NotificationDetails { get; set; }
    }

    public enum AlertType
    {
        Safety,
        Mechanical,
        Traffic,
        Weather,
        Student,
        Schedule,
        Emergency
    }

    public enum AlertSeverity
    {
        Low,
        Medium,
        High,
        Critical
    }

    public class BusGeofence : BaseEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public GeofenceType Type { get; set; } // School, Stop, Restricted, SafeZone
        public string Coordinates { get; set; } // JSON array of lat/lng points
        public decimal CenterLatitude { get; set; }
        public decimal CenterLongitude { get; set; }
        public decimal Radius { get; set; } // meters
        public bool IsActive { get; set; } = true;

        // Associated entities
        public int? BusId { get; set; }
        public Bus AssociatedBus { get; set; }
        public int? RouteId { get; set; }
        public TransportRoute AssociatedRoute { get; set; }

        // Actions
        public string EntryAction { get; set; } // Notify, Alert, Log
        public string ExitAction { get; set; }
        public string StayAction { get; set; } // For restricted zones
    }

    public enum GeofenceType
    {
        School,
        BusStop,
        RestrictedArea,
        SafeZone,
        SpeedZone
    }

    public class BusMaintenance : BaseEntity
    {
        public int BusId { get; set; }
        public Bus Bus { get; set; }
        public MaintenanceType Type { get; set; }
        public string Description { get; set; }
        public DateTime ScheduledDate { get; set; }
        public DateTime? CompletedDate { get; set; }
        public MaintenanceStatus Status { get; set; } = MaintenanceStatus.Scheduled;
        public decimal Cost { get; set; }
        public string PerformedBy { get; set; }
        public string Notes { get; set; }

        // Odometer readings
        public decimal OdometerBefore { get; set; }
        public decimal OdometerAfter { get; set; }
    }

    public enum MaintenanceType
    {
        Routine,
        Repair,
        Inspection,
        Emergency,
        TireReplacement,
        EngineService,
        BrakeService
    }

    public enum MaintenanceStatus
    {
        Scheduled,
        InProgress,
        Completed,
        Cancelled,
        Overdue
    }

    public class BusRouteStop : BaseEntity
    {
        public int RouteId { get; set; }
        public TransportRoute Route { get; set; }
        public string StopName { get; set; }
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
        public int OrderIndex { get; set; }
        public TimeSpan ScheduledArrival { get; set; }
        public TimeSpan ScheduledDeparture { get; set; }
        public int EstimatedDuration { get; set; } // minutes from previous stop

        // Student pickup/dropoff counts
        public int StudentsPickup { get; set; }
        public int StudentsDropoff { get; set; }

        // Facilities at stop
        public string Facilities { get; set; } // JSON: wifi, shelter, seating, etc.
        public bool IsActive { get; set; } = true;
    }

    public class ParentBusTracking : BaseEntity
    {
        public int ParentId { get; set; }
        public Parent Parent { get; set; }
        public int StudentId { get; set; }
        public Student Student { get; set; }
        public int BusId { get; set; }
        public Bus Bus { get; set; }

        // Tracking preferences
        public bool TrackLocation { get; set; } = true;
        public bool NotifyArrival { get; set; } = true;
        public bool NotifyDeparture { get; set; } = true;
        public bool NotifyDelays { get; set; } = true;
        public bool NotifyEmergencies { get; set; } = true;

        // Safe zones (lat,lng,radius in JSON)
        public string SafeZones { get; set; }

        // Contact preferences
        public string EmergencyContacts { get; set; } // JSON array of contacts
        public bool AllowRealTimeTracking { get; set; } = true;

        public DateTime LastAccess { get; set; }
        public int AccessCount { get; set; } = 0;
    }
}
