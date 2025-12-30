using backend.Models;
using backend.Repos;
using backend.DTOs;
using System.Runtime.InteropServices;
using BCrypt.Net;

namespace backend.Services
{
    public class UserService
    {
        private readonly IUserRepo _userRepo;

        public UserService(IUserRepo userRepo) 
        {
            _userRepo = userRepo; 
        }
        public async Task<IEnumerable<UserResponseDTO>> GetAll()
        {
            var users= await _userRepo.GetAll();
            return users.Select(u => new UserResponseDTO
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                Role = u.Role
            });
        }

        public async Task<UserResponseDTO?> GetById(string id)
        {
            var user= await _userRepo.GetById(id);
            if(user==null)
            {
                return null;
            }
            return new UserResponseDTO
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role
            };
        }

        public async Task<UserResponseDTO?>Create(UserCreateDTO user)
        {
            var existing = await _userRepo.GetByEmail(user.Email);

            if (existing != null)
            {
                return null;
            }

            var u = new User
            {
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.Password)
            };

            var created= await _userRepo.Create(u);
            if (created == null) 
            { 
                return null; 
            }

            return new UserResponseDTO
            {
                Id=created.Id,
                Name = created.Name,
                Email = created.Email,
                Role = created.Role,
            };
        }
        public async Task<UserResponseDTO?> Update(string id, UserUpdateDTO user)
        {
            var u = await _userRepo.GetById(id);
            if(u == null) 
            { 
                return null; 
            }
            if (!string.IsNullOrEmpty(user.Name))
            {
                u.Name = user.Name;
            }

            if (!string.IsNullOrEmpty(user.Email))
            {
                u.Email = user.Email;
            }

            if (!string.IsNullOrEmpty(user.Role))
            {
                u.Role = user.Role;
            }

            if (!string.IsNullOrEmpty(user.Password))
            {
                u.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.Password);
            }
            var updated= await _userRepo.Update(u);
            if (updated == null) { return null; }

            return new UserResponseDTO
            {
                Id=updated.Id,
                Name = updated.Name,
                Email = updated.Email,
                Role = updated.Role,
            };

        }
        public async Task<UserResponseDTO?>Delete(string id)
        {
            var u= await _userRepo.Delete(id);
            return new UserResponseDTO
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                Role = u.Role
            };
        }
        

        public async Task<User?> Register(RegisterDTO dto)
        {
            var existing = await _userRepo.GetByEmail(dto.Email);
            if (existing != null)
            {
                return null;
            }
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                PasswordHash = passwordHash,
                Role = "User"
            };

            return await _userRepo.Create(user);
        }

        public async Task<User?> Login(LoginDTO dto)
        {
            try
            {
                var user = await _userRepo.GetByEmail(dto.Email);

                if (user == null)
                {
                    
                    return null;
                }        

                if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                {
                    return null;
                }
                return user;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Login exception: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                throw;
            }
        }

    }


}
