using System.ComponentModel.DataAnnotations;

namespace API.Models
{
    public class Student
    {
        public int id { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string email { get; set; }
        public string phone { get; set; }
        public string address { get; set; }
        public string country { get; set; }
        public int instituteId  { get; set; }
        public DateTime intake { get; set; }
        public DateTime expire { get; set; }
        public string courseTitle { get; set; }
        public int approvalStatus { get; set; }
        public string studentIdCard { get; set; }
    }
}