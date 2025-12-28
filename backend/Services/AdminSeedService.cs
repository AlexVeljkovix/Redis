using backend.Repos;
using backend.Models;

namespace backend.Services
{
    public class AdminSeedService
    {
        private readonly IUserRepo _userRepo;

        public AdminSeedService(IUserRepo userRepo)
        {
            _userRepo = userRepo;
        }

        public async Task SeedAdminAsync()
        {
            var users= await _userRepo.GetAll();
            if (users.Any(u => u.Role == "Admin"))
            {
                return;
            }

            var admin = new User
            {
                Name = "Admin",
                Email = "admin@admin.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin"),
                Role = "Admin"
            };

            await _userRepo.Create(admin);
        }
    }
}
