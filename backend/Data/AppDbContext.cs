using Microsoft.EntityFrameworkCore;
using SchoolERP.API.Models;

namespace SchoolERP.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<Teacher> Teachers { get; set; }
        public DbSet<Class> Classes { get; set; }
        public DbSet<AttendanceRecord> AttendanceRecords { get; set; }
        public DbSet<PayrollRecord> PayrollRecords { get; set; }
        public DbSet<Book> Books { get; set; }
        public DbSet<Bus> Buses { get; set; }
        public DbSet<TransportRoute> TransportRoutes { get; set; }
        public DbSet<TransportAssignment> TransportAssignments { get; set; }
        public DbSet<InventoryItem> InventoryItems { get; set; }
        public DbSet<Notice> Notices { get; set; }
        public DbSet<ParentMessage> ParentMessages { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<CourseMaterial> CourseMaterials { get; set; }
        public DbSet<Reward> Rewards { get; set; }
        public DbSet<StudentAchievement> StudentAchievements { get; set; }
    }
}