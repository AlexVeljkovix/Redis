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
            try
            {
                var users = await _userRepo.GetAll();
                if (users.Any(u => u.Role == "Admin"))
                {
                    Console.WriteLine("Admin already exists");
                    return;
                }

                var admin = new User
                {
                    Name = "Admin",
                    Email = "admin@admin.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin"),
                    Role = "Admin"
                };

                var created = await _userRepo.Create(admin);
                if (created != null)
                {
                    Console.WriteLine($"Admin created: {created.Email} with ID: {created.Id}");
                }
                else
                {
                    Console.WriteLine("Failed to create admin");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Seed error: {ex.Message}");
                throw;
            }
        }
    }
}