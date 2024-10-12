using API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        private readonly StudentDbContext _studentDbContext;

        public StudentController(StudentDbContext studentDbContext)
        {
            _studentDbContext = studentDbContext;
        }

        [HttpGet]
        [Route("GetStudent")]
        public async Task<IEnumerable<Student>> GetStudent()
        {
            return await _studentDbContext.GetAllstudentsAsync();
        }

        [HttpPost]
        [Route("AddStudent")]
        public async Task<IActionResult> AddStudent([FromForm] SaveStudent saveStudent)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _studentDbContext.SaveStudentAsync(saveStudent);
            return Ok(saveStudent);
        }

        [HttpPatch]
        [Route("UpdateStudent")]
        public async Task<IActionResult> UpdateStudent([FromForm] Student student)
        {
            await _studentDbContext.UpdateStudentAsync(student);
            return Ok(student);
        }

        [HttpDelete]
        [Route("DeleteStudent/{id}")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            await _studentDbContext.DeleteStudentByIdAsync(id);
            return NoContent();
        }

        // [HttpGet]
        // [Route("CheckEmailExists/{email}")]
        // public async Task<IActionResult> CheckEmailExists(string email)
        // {
        //     if (string.IsNullOrWhiteSpace(email))
        //     {
        //         return BadRequest("Email is required.");
        //     }

        //     bool emailExists = await _studentDbContext.CheckEmailExistsAsync(email);
        //     return Ok(new { EmailExists = emailExists });
        // }

        [HttpGet]
        [Route("CheckEmailExists/{email}")]
        public async Task<IActionResult> CheckEmailExists(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return BadRequest("Email is required.");
            }

            bool emailExists = await _studentDbContext.CheckEmailExistsAsync(email);
            return Ok(emailExists);  // Return the boolean directly
        }

    }
}
