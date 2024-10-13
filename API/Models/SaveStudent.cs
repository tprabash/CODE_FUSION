using System.ComponentModel.DataAnnotations;

namespace API.Models
{
    public class SaveStudent
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string Country { get; set; }
        public int InstituteId  { get; set; }
        public DateTime Intake { get; set; }
        public string CourseTitle { get; set; }
        public string StudentIdCard { get; set; }
        public int ApprovalStatus { get; set; }
    }
}