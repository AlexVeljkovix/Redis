using backend.Models;
using StackExchange.Redis;
using System.Text.Json;

namespace backend.Repos
{
    public class UserRepo:IUserRepo
    {
        private readonly IDatabase _db;

        public UserRepo(RedisContext contex)
        {
            _db = contex.Db;
        }

        public async Task<IEnumerable<User>> GetAll()
        {
            var keys = await _db.SetMembersAsync("allUsers");
            var users=new List<User>();
            foreach(var key in keys)
            {
                var json = await _db.HashGetAsync(key.ToString(), "data");
                var jsonString = (string)json;

                if (!string.IsNullOrEmpty(jsonString))
                {
                    users.Add(JsonSerializer.Deserialize<User>(jsonString)!);
                }

            }
            return users;
        }

        public async Task<User?> GetById(string id)
        {
            var key = $"user:{id}";
            var json = await _db.HashGetAsync(key, "data");
            var jsonString= (string)json;
            if (!string.IsNullOrEmpty(jsonString))
            {
                return JsonSerializer.Deserialize<User>(jsonString);
            }
            return null;
        }

        public async Task<User?> GetByEmail(string email)
        {
            try
            {
               
                var userId = await _db.StringGetAsync($"email:{email}");

                
                if (userId.IsNullOrEmpty)
                {
                    return null;
                }
                var userKey = $"user:{userId}";
                var user = await GetById(userId.ToString());

                if (user == null)
                {
                    return null;
                }
            
                return user;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public async Task<User?> Create(User user)
        {
            var key = $"user:{user.Id}";
            var json = JsonSerializer.Serialize(user);
            var existingId = await _db.StringGetAsync($"email:{user.Email}");
            if (!existingId.IsNullOrEmpty)
            {
                return null;
            }
            await _db.HashSetAsync(key, new HashEntry[] {new HashEntry("data", json)});
            await _db.SetAddAsync("allUsers", key);
            await _db.StringSetAsync($"email:{user.Email}", user.Id);

            return user;
        }
        public async Task<User?> Update(User user)
        {
            var key = $"user:{user.Id}";
            var old= await GetById(user.Id);
            if (old == null)
            {
                return null;
            }
            if (old.Email != user.Email)
            {
                await _db.KeyDeleteAsync($"email:{old.Email}");
                var existingId = await _db.StringGetAsync($"email:{user.Email}");
                if(!existingId.IsNullOrEmpty && existingId.ToString() != user.Id)
                {
                    await _db.StringSetAsync($"email:{user.Email}", user.Id);
                }
            }
            var json = JsonSerializer.Serialize(user);
            await _db.HashSetAsync(key, new HashEntry[] { new HashEntry("data", json) });
            return user;
        }
        public async Task<User?> Delete(string id)
        {
            var key = $"user:{id}";
            var user = await GetById(id);

            if (user != null)
            {
                await _db.KeyDeleteAsync(key);
                await _db.SetRemoveAsync("allUsers", key);
                await _db.KeyDeleteAsync($"email:{user.Email}");
            }
            return user;
        }
    }
}
