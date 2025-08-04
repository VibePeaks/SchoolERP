using Microsoft.EntityFrameworkCore;
using SchoolERP.API.Models;

namespace SchoolERP.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // Authentication
        public DbSet<User> Users { get; set; }

        // Academics
        public DbSet<Student> Students { get; set; }
        public DbSet<Teacher> Teachers { get; set; }
        public DbSet<Class> Classes { get; set; }
        public DbSet<AttendanceRecord> AttendanceRecords { get; set; }
        
        // Exams & Results
        public DbSet<Exam> Exams { get; set; }
        public DbSet<ExamResult> ExamResults { get; set; }

        // Finance
        public DbSet<FeeStructure> FeeStructures { get; set; }
        public DbSet<StudentFee> StudentFees { get; set; }
        public DbSet<PayrollRecord> PayrollRecords { get; set; }

        // Library
        public DbSet<Book> Books { get; set; }

        // Transport
        public DbSet<Bus> Buses { get; set; }
        public DbSet<TransportRoute> TransportRoutes { get; set; }
        public DbSet<TransportAssignment> TransportAssignments { get; set; }

        // Inventory
        public DbSet<InventoryItem> InventoryItems { get; set; }

        // Notices & Communication
        public DbSet<Notice> Notices { get; set; }
        public DbSet<ParentMessage> ParentMessages { get; set; }

        // E-Learning
        public DbSet<Course> Courses { get; set; }
        public DbSet<CourseMaterial> CourseMaterials { get; set; }

        // Gamification
        public DbSet<Reward> Rewards { get; set; }
        public DbSet<StudentAchievement> StudentAchievements { get; set; }

        // Hostel Management
        public DbSet<Hostel> Hostels { get; set; }
        public DbSet<RoomAllocation> RoomAllocations { get; set; }
        public DbSet<HostelMaintenance> HostelMaintenances { get; set; }

        // Audit Logging
        public DbSet<AuditLog> AuditLogs { get; set; }
    }
}