using System.Text.Json.Serialization;

namespace SchoolERP.API.Models
{
    public class Assignment : BaseEntity
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public int ClassId { get; set; }
        public Class Class { get; set; }
        public int TeacherId { get; set; }
        public Teacher Teacher { get; set; }
        public DateTime DueDate { get; set; }
        public int MaxPoints { get; set; }
        public string Subject { get; set; }
        public string AssignmentType { get; set; } // Homework, Project, Quiz, etc.
        public string Instructions { get; set; }
        public string Attachments { get; set; } // JSON array of file URLs

        // Navigation properties
        [JsonIgnore]
        public ICollection<AssignmentSubmission> Submissions { get; set; }
    }

    public class AssignmentSubmission : BaseEntity
    {
        public int AssignmentId { get; set; }
        public Assignment Assignment { get; set; }
        public int StudentId { get; set; }
        public Student Student { get; set; }
        public DateTime SubmittedAt { get; set; }
        public string SubmissionText { get; set; }
        public string Attachments { get; set; } // JSON array of file URLs
        public int? PointsEarned { get; set; }
        public string Feedback { get; set; }
        public DateTime? GradedAt { get; set; }
        public int? GradedBy { get; set; } // Teacher ID
        public SubmissionStatus Status { get; set; } = SubmissionStatus.Submitted;

        // Navigation properties
        [JsonIgnore]
        public User GradedByTeacher { get; set; }
    }

    public enum SubmissionStatus
    {
        Draft,
        Submitted,
        Late,
        Graded,
        Returned
    }

    public class AssignmentGrade : BaseEntity
    {
        public int StudentId { get; set; }
        public Student Student { get; set; }
        public int ClassId { get; set; }
        public Class Class { get; set; }
        public string Subject { get; set; }
        public string GradeType { get; set; } // Exam, Quiz, Homework, Project
        public string Title { get; set; } // "Mid-term Exam", "Math Quiz 1"
        public decimal Score { get; set; }
        public decimal MaxScore { get; set; }
        public decimal Percentage { get; set; }
        public string LetterGrade { get; set; } // A, B+, B, etc.
        public string Comments { get; set; }
        public DateTime GradedDate { get; set; }
        public int GradedBy { get; set; } // Teacher ID
        public bool IsFinal { get; set; } = false;

        // Navigation properties
        [JsonIgnore]
        public User Teacher { get; set; }
    }

    public class StudentProgressReport : BaseEntity
    {
        public int StudentId { get; set; }
        public Student Student { get; set; }
        public string ReportPeriod { get; set; } // "Fall 2024", "Q1 2025"
        public DateTime ReportDate { get; set; }
        public string OverallGrade { get; set; }
        public decimal GPA { get; set; }
        public int AttendanceDays { get; set; }
        public int TotalDays { get; set; }
        public decimal AttendancePercentage { get; set; }

        // Subject-wise performance
        public string SubjectGrades { get; set; } // JSON object with subject: grade pairs

        // Teacher comments
        public string AcademicComments { get; set; }
        public string BehavioralComments { get; set; }
        public string Recommendations { get; set; }

        // Achievements and concerns
        public string Achievements { get; set; }
        public string AreasOfConcern { get; set; }

        public int PreparedBy { get; set; } // Teacher/Admin ID
        public DateTime? SharedWithParents { get; set; }
        public bool ParentsAcknowledged { get; set; } = false;

        // Navigation properties
        [JsonIgnore]
        public User PreparedByUser { get; set; }
    }

    public class StudentAcademicAchievement : BaseEntity
    {
        public int StudentId { get; set; }
        public Student Student { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Category { get; set; } // Academic, Sports, Arts, Leadership
        public DateTime AchievementDate { get; set; }
        public string AwardedBy { get; set; }
        public string CertificateUrl { get; set; }
        public string RecognitionLevel { get; set; } // School, District, State, National

        // Points for gamification
        public int PointsEarned { get; set; }
    }

    public class LearningObjective : BaseEntity
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string Subject { get; set; }
        public int ClassId { get; set; }
        public Class Class { get; set; }
        public string GradeLevel { get; set; }
        public LearningObjectiveCategory Category { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public enum LearningObjectiveCategory
    {
        Knowledge,
        Skills,
        Understanding,
        Application
    }

    public class StudentLearningProgress : BaseEntity
    {
        public int StudentId { get; set; }
        public Student Student { get; set; }
        public int LearningObjectiveId { get; set; }
        public LearningObjective LearningObjective { get; set; }
        public LearningProgressStatus Status { get; set; } = LearningProgressStatus.NotStarted;
        public DateTime? CompletedDate { get; set; }
        public string Notes { get; set; }
        public int AssessedBy { get; set; } // Teacher ID
        public DateTime AssessmentDate { get; set; }

        // Navigation properties
        [JsonIgnore]
        public User AssessedByTeacher { get; set; }
    }

    public enum LearningProgressStatus
    {
        NotStarted,
        InProgress,
        Completed,
        NeedsImprovement,
        Mastered
    }
}
