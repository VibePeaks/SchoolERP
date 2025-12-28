using Microsoft.EntityFrameworkCore;
using SchoolERP.API.Models;
using System.Linq;
using System.Linq.Expressions;
using System;

namespace SchoolERP.API.Data
{
    public class AppDbContext : DbContext
    {
        private readonly int? _tenantId;

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
            // Get tenant ID from async local storage or middleware context
            _tenantId = TenantContext.GetTenantId();
        }

        // Authentication
        public DbSet<User> Users { get; set; }

        // Subscription Management
        public DbSet<SubscriptionPlan> SubscriptionPlans { get; set; }
        public DbSet<UserSubscription> UserSubscriptions { get; set; }
        public DbSet<SubscriptionPayment> SubscriptionPayments { get; set; }
        public DbSet<SubscriptionFeature> SubscriptionFeatures { get; set; }

        // Multi-Tenant Architecture
        public DbSet<Tenant> Tenants { get; set; }
        public DbSet<TenantSetting> TenantSettings { get; set; }
        public DbSet<TenantUsage> TenantUsage { get; set; }

        // Branch Management
        public DbSet<Branch> Branches { get; set; }
        public DbSet<UserBranch> UserBranches { get; set; }

        // Parent Portal
        public DbSet<Parent> Parents { get; set; }
        public DbSet<StudentParent> StudentParents { get; set; }
        public DbSet<ParentMessage> ParentMessages { get; set; }
        public DbSet<ParentNotification> ParentNotifications { get; set; }

        // Student Progress Tracking
        public DbSet<Assignment> Assignments { get; set; }
        public DbSet<AssignmentSubmission> AssignmentSubmissions { get; set; }
        public DbSet<Grade> Grades { get; set; }
        public DbSet<StudentProgressReport> StudentProgressReports { get; set; }
        public DbSet<StudentAchievement> StudentAchievements { get; set; }
        public DbSet<LearningObjective> LearningObjectives { get; set; }
        public DbSet<StudentLearningProgress> StudentLearningProgress { get; set; }

        // Academics
        public DbSet<Student> Students { get; set; }
        public DbSet<Teacher> Teachers { get; set; }
        public DbSet<Class> Classes { get; set; }
        public DbSet<Subject> Subjects { get; set; }
        public DbSet<AttendanceRecord> AttendanceRecords { get; set; }

        // Exams & Results
        public DbSet<Exam> Exams { get; set; }
        public DbSet<ExamResult> ExamResults { get; set; }

        // Finance
        public DbSet<FeeStructure> FeeStructures { get; set; }
        public DbSet<StudentFee> StudentFees { get; set; }
        public DbSet<FeePayment> FeePayments { get; set; }
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

        // Bus Tracking System
        public DbSet<BusLocation> BusLocations { get; set; }
        public DbSet<BusTrip> BusTrips { get; set; }
        public DbSet<BusStopLog> BusStopLogs { get; set; }
        public DbSet<BusAlert> BusAlerts { get; set; }
        public DbSet<BusGeofence> BusGeofences { get; set; }
        public DbSet<BusMaintenance> BusMaintenances { get; set; }
        public DbSet<BusRouteStop> BusRouteStops { get; set; }
        public DbSet<ParentBusTracking> ParentBusTracking { get; set; }



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Apply tenant filtering to all tenant-aware entities
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                if (typeof(BaseEntity).IsAssignableFrom(entityType.ClrType))
                {
                    var tenantIdProperty = entityType.FindProperty("TenantId");
                    if (tenantIdProperty != null)
                    {
                        modelBuilder.Entity(entityType.ClrType)
                            .HasQueryFilter(CreateTenantFilter(entityType.ClrType));
                    }
                }
            }

            // Configure relationships
            modelBuilder.Entity<User>()
                .HasOne(u => u.Tenant)
                .WithMany(t => t.Users)
                .HasForeignKey(u => u.TenantId);

            modelBuilder.Entity<TenantSetting>()
                .HasOne(ts => ts.Tenant)
                .WithMany(t => t.Settings)
                .HasForeignKey(ts => ts.TenantId);

            modelBuilder.Entity<TenantUsage>()
                .HasOne(tu => tu.Tenant)
                .WithMany()
                .HasForeignKey(tu => tu.TenantId);

            // Branch relationships
            modelBuilder.Entity<Branch>()
                .HasOne(b => b.Tenant)
                .WithMany(t => t.Branches)
                .HasForeignKey(b => b.TenantId);

            modelBuilder.Entity<UserBranch>()
                .HasKey(ub => new { ub.UserId, ub.BranchId });

            modelBuilder.Entity<UserBranch>()
                .HasOne(ub => ub.User)
                .WithMany(u => u.UserBranches)
                .HasForeignKey(ub => ub.UserId);

            modelBuilder.Entity<UserBranch>()
                .HasOne(ub => ub.Branch)
                .WithMany(b => b.UserBranches)
                .HasForeignKey(ub => ub.BranchId);

            modelBuilder.Entity<UserBranch>()
                .HasOne(ub => ub.Tenant)
                .WithMany()
                .HasForeignKey(ub => ub.TenantId);

            // Student and Teacher branch relationships
            modelBuilder.Entity<Student>()
                .HasOne(s => s.Branch)
                .WithMany(b => b.Students)
                .HasForeignKey(s => s.BranchId);

            modelBuilder.Entity<Student>()
                .HasOne(s => s.HomeBranch)
                .WithMany()
                .HasForeignKey(s => s.HomeBranchId);

            modelBuilder.Entity<Teacher>()
                .HasOne(t => t.Branch)
                .WithMany(b => b.Teachers)
                .HasForeignKey(t => t.BranchId);

            // Parent relationships
            modelBuilder.Entity<StudentParent>()
                .HasKey(sp => new { sp.StudentId, sp.ParentId });

            modelBuilder.Entity<StudentParent>()
                .HasOne(sp => sp.Student)
                .WithMany(s => s.StudentParents)
                .HasForeignKey(sp => sp.StudentId);

            modelBuilder.Entity<StudentParent>()
                .HasOne(sp => sp.Parent)
                .WithMany(p => p.StudentParents)
                .HasForeignKey(sp => sp.ParentId);

            modelBuilder.Entity<StudentParent>()
                .HasOne(sp => sp.Tenant)
                .WithMany()
                .HasForeignKey(sp => sp.TenantId);

            modelBuilder.Entity<ParentMessage>()
                .HasOne(pm => pm.Sender)
                .WithMany(p => p.SentMessages)
                .HasForeignKey(pm => pm.SenderId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ParentMessage>()
                .HasOne(pm => pm.Receiver)
                .WithMany()
                .HasForeignKey(pm => pm.ReceiverId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ParentMessage>()
                .HasOne(pm => pm.Student)
                .WithMany()
                .HasForeignKey(pm => pm.StudentId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ParentNotification>()
                .HasOne(pn => pn.Parent)
                .WithMany(p => p.Notifications)
                .HasForeignKey(pn => pn.ParentId);

            modelBuilder.Entity<ParentNotification>()
                .HasOne(pn => pn.RelatedStudent)
                .WithMany()
                .HasForeignKey(pn => pn.RelatedStudentId);
        }

        private LambdaExpression CreateTenantFilter(Type entityType)
        {
            var parameter = Expression.Parameter(entityType, "e");
            var property = Expression.Property(parameter, "TenantId");
            var tenantId = Expression.Constant(_tenantId ?? 1);
            var body = Expression.Equal(property, tenantId);

            return Expression.Lambda(body, parameter);
        }
    }
}
