using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;

namespace API.Models
{
    public class InstituteDbContext : DbContext
    {
        public InstituteDbContext(DbContextOptions<InstituteDbContext> options) : base(options)
        {
        }

        public DbSet<Institute> Institutes { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Data Source=.;Initial Catalog=Student;User Id=sa;Password=1234;TrustServerCertificate=true;");
        }

        public async Task<List<Institute>> GetAllinstitutesAsync()
        {
            return await Institutes.FromSqlRaw("EXEC GetAllinstitutes").ToListAsync();
        }

        public async Task SaveInstituteAsync(Institute institute)
        {
            await Database.ExecuteSqlRawAsync("EXEC SaveInstitutes @InstituteName",
                new SqlParameter("@InstituteName", institute.InstituteName));
        }

        public async Task UpdateInstituteAsync(Institute institute)
        {
            await Database.ExecuteSqlRawAsync("EXEC UpdateInstitutes @Id, @InstituteName",
                new SqlParameter("@Id", institute.Id),
                new SqlParameter("@InstituteName", institute.InstituteName));
        }

        public async Task DeleteInstituteByIdAsync(int id)
        {
            await Database.ExecuteSqlRawAsync("EXEC DeleteInstitute @Id",
                new SqlParameter("@Id", id));
        }
    }
}
