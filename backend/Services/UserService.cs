using backend.Models;
using backend.Repos;
using backend.DTOs;
using System.Runtime.InteropServices;

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
            });
        }
        public async Task<User?> Update(string id, UserDTO user)
        {
            return await _userRepo.Update(new User
            {
                Id= id,
                Name = user.Name,
                Email = user.Email,
            });
        }
        public async Task<User?>Delete(string id)
        {
            return await _userRepo.Delete(id);
        }
        public async Task<IEnumerable<string>>GetUserReservationIds(string userId)
        {
            return await _userRepo.GetUserReservationIds(userId);
        }

    }

}
