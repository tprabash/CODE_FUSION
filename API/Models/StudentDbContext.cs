using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;

namespace API.Models
{
    public class StudentDbContext : DbContext
    {
        public StudentDbContext(DbContextOptions<StudentDbContext> options) : base(options)
        {
        }

        public DbSet<Student> Students { get; set; }
        public DbSet<EmailCheckResult> EmailCheckResults { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Data Source=.;Initial Catalog=Student;User Id=sa;Password=1234;TrustServerCertificate=true;");
        }

         protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<EmailCheckResult>()
                .HasNoKey();
        }

        public async Task<List<Student>> GetAllstudentsAsync()
        {
            return await Students.FromSqlRaw("EXEC GetAllstudents").ToListAsync();
        }

        public async Task SaveStudentAsync(SaveStudent saveStudent)
        {

            await Database.ExecuteSqlRawAsync("EXEC SaveStudents @FirstName, @LastName, @Email, @Phone, @Address, @Country, @InstituteId, @Intake, @CourseTitle, @StudentIdCard",
                new SqlParameter("@FirstName", saveStudent.FirstName),
                new SqlParameter("@LastName", saveStudent.LastName),
                new SqlParameter("@Email", saveStudent.Email),
                new SqlParameter("@Phone", saveStudent.Phone),
                new SqlParameter("@Address", saveStudent.Address ?? (object)DBNull.Value),
                new SqlParameter("@Country", saveStudent.Country),
                new SqlParameter("@InstituteId", saveStudent.InstituteId),
                new SqlParameter("@Intake", saveStudent.Intake),
                new SqlParameter("@CourseTitle", saveStudent.CourseTitle),
                new SqlParameter("@StudentIdCard", saveStudent.StudentIdCard ?? (object)DBNull.Value));

        }

        public async Task UpdateStudentAsync(Student student)
        {
            await Database.ExecuteSqlRawAsync("EXEC UpdateStudents @Id, @FirstName, @LastName, @Email, @Phone, @Address, @Country, @InstituteId, @Intake, @CourseTitle, @StudentIdCard",
                new SqlParameter("@Id", student.Id),
                new SqlParameter("@FirstName", student.FirstName),
                new SqlParameter("@LastName", student.LastName),
                new SqlParameter("@Email", student.Email),
                new SqlParameter("@Phone", student.Phone),
                new SqlParameter("@Address", student.Address ?? (object)DBNull.Value),
                new SqlParameter("@Country", student.Country),
                new SqlParameter("@InstituteId", student.InstituteId),
                new SqlParameter("@Intake", student.Intake),
                new SqlParameter("@CourseTitle", student.CourseTitle),
                new SqlParameter("@StudentIdCard", student.StudentIdCard ?? (object)DBNull.Value));
        }

        public async Task DeleteStudentByIdAsync(int id)
        {
            await Database.ExecuteSqlRawAsync("EXEC DeleteStudent @Id",
                new SqlParameter("@Id", id));
        }

        public async Task<bool> CheckEmailExistsAsync(string email)
        {
            var emailParameter = new SqlParameter("@Email", email);
            var result = await EmailCheckResults
                .FromSqlRaw("EXEC CheckEmailExists @Email", emailParameter)
                .ToListAsync();

            return result.Any() && result[0].EmailExists == 1;
        }

    }
}
