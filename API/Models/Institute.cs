using System.ComponentModel.DataAnnotations;

namespace API.Models
{
    public class Institute
    {
        [Key]
        public int Id { get; set; }
        public string InstituteName { get; set; }
    }
}