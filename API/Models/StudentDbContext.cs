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

        public async Task SaveStudents(SaveStudent saveStudent)
        {

            await Database.ExecuteSqlRawAsync("EXEC SaveStudents @FirstName, @LastName, @Email, @Phone, @Address, @Country, @InstituteId,@Intake, @CourseTitle, @ApprovalStatus, @StudentIdCard",
                new SqlParameter("@FirstName", saveStudent.firstName),
                new SqlParameter("@LastName", saveStudent.lastName),
                new SqlParameter("@Email", saveStudent.email),
                new SqlParameter("@Phone", saveStudent.phone),
                new SqlParameter("@Address", saveStudent.address ?? (object)DBNull.Value),
                new SqlParameter("@Country", saveStudent.country),
                new SqlParameter("@InstituteId", saveStudent.instituteId),
                new SqlParameter("@Intake", saveStudent.intake),
                new SqlParameter("@CourseTitle", saveStudent.courseTitle),
                new SqlParameter("@ApprovalStatus", saveStudent.approvalStatus),
                new SqlParameter("@StudentIdCard", saveStudent.studentIdCard ?? (object)DBNull.Value));
        }

        public async Task UpdateStudentAsync(Student student)
        {
            await Database.ExecuteSqlRawAsync("EXEC UpdateStudents @Id, @FirstName, @LastName, @Email, @Phone, @Address, @Country, @InstituteId, @Intake, @CourseTitle, @ApprovalStatus, @StudentIdCard",
                new SqlParameter("@Id", student.id),
                new SqlParameter("@FirstName", student.firstName),
                new SqlParameter("@LastName", student.lastName),
                new SqlParameter("@Email", student.email),
                new SqlParameter("@Phone", student.phone),
                new SqlParameter("@Address", student.address ?? (object)DBNull.Value),
                new SqlParameter("@Country", student.country),
                new SqlParameter("@InstituteId", student.instituteId),
                new SqlParameter("@Intake", student.intake),
                new SqlParameter("@CourseTitle", student.courseTitle),
                new SqlParameter("@ApprovalStatus", student.approvalStatus),
                new SqlParameter("@StudentIdCard", student.studentIdCard ?? (object)DBNull.Value));
        }

        public async Task DeactiveStudentByIdAsync(int id)
        {
            var sqlParam = new SqlParameter("@Id", id);
            await Database.ExecuteSqlRawAsync("EXEC DeactiveStudent @Id", sqlParam);
        }


        public async Task ActivateStudentByIdAsync(int id)
        {
            var sqlParam = new SqlParameter("@Id", id);
            await Database.ExecuteSqlRawAsync("EXEC ActivateStudent @Id", sqlParam);
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
