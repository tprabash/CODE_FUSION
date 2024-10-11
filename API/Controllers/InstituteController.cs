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
    public class InstituteController : ControllerBase
    {
        private readonly InstituteDbContext _instituteDbContext;

        public InstituteController(InstituteDbContext instituteDbContext)
        {
            _instituteDbContext = instituteDbContext;
        }

        [HttpGet]
        [Route("GetInstitute")]
        public async Task<IEnumerable<Institute>> GetInstitute()
        {
            return await _instituteDbContext.GetAllinstitutesAsync();
        }

        [HttpPost]
        [Route("AddInstitute")]
        public async Task<IActionResult> AddInstitute([FromForm] Institute institute)
        {
            if (institute == null)
            {
                return BadRequest("Institute data is null");
            }

            await _instituteDbContext.SaveInstituteAsync(institute);
            return Ok(institute);
        }
        [HttpPut]
        [Route("UpdateInstitute/{id}")]
        public async Task<IActionResult> UpdateInstitute(int id, [FromBody] Institute institute)
        {
            if (id != institute.Id)
            {
                return BadRequest("Institute ID mismatch");
            }

            await _instituteDbContext.UpdateInstituteAsync(institute);
            return Ok(institute);
        }


        [HttpDelete]
        [Route("DeleteInstitute/{id}")]
        public async Task<IActionResult> DeleteInstitute(int id)
        {
            await _instituteDbContext.DeleteInstituteByIdAsync(id);
            return NoContent();
        }
    }
}
