using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace StandingOut.Data
{
    public class DbEntitiesContextFactory : IDesignTimeDbContextFactory<DbEntities>
    {
        public DbEntities CreateDbContext(string[] args)
        {
            var builder = new DbContextOptionsBuilder<DbEntities>();
            builder.UseSqlServer("Database=test.StandingOut_db;Server=(localdb)\\mssqllocaldb;Trusted_Connection=True;MultipleActiveResultSets=true");
            return new DbEntities(builder.Options);
        }
    }
}
