using backend.Models;

namespace backend.Repos
{
    public interface IUserRepo
    {
        public Task<IEnumerable<User>> GetAll();
        public Task<User?> GetById(string id);
        public Task<User?> GetByEmail(string email);
        public Task<User?> Create(User user);
        public Task<User?> Update(User user);
        public Task<User?> Delete(string id);
    }
}
