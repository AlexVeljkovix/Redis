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
        public Task<IEnumerable<User>> GetAll()
        {
            return _userRepo.GetAll();
        }

        public Task<User?> GetById(string id)
        {
            return _userRepo.GetById(id);
        }

        public async Task<User?>Create(UserDTO user)
        {
            return await _userRepo.Create(new User
            {
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                PasswordHash = user.PasswordHash,
            });
        }
        public async Task<User?> Update(string id, UserDTO user)
        {
            return await _userRepo.Update(new User
            {
                Id= id,
                Name = user.Name,
                Email = user.Email,
                Role= user.Role,
                PasswordHash= user.PasswordHash,
            });
        }
        public async Task<User?>Delete(string id)
        {
            return await _userRepo.Delete(id);
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

        public async Task<User?>Login(LoginDTO dto)
        {
            var user = await _userRepo.GetByEmail(dto.Email);
            if (user == null)
            {
                return null;
            }
            var valid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);
            if (!valid)
            {
                return null;
            }
            return user;

        }

    }


}
