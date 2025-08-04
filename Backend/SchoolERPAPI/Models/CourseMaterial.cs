namespace SchoolERP.API.Models
{
    public class CourseMaterial
    {
        public int Id { get; set; }
        public int CourseId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string MaterialType { get; set; } // Video, Document, Quiz, etc.
        public string FilePath { get; set; }
        public DateTime UploadDate { get; set; }
        public bool IsActive { get; set; }
    }
}