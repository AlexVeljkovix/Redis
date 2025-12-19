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
        public async Task<User?> Create(User user)
        {
            var key = $"user:{user.Id}";
            var json = JsonSerializer.Serialize(user);
            await _db.HashSetAsync(key, new HashEntry[] {new HashEntry("data", json)});
            await _db.SetAddAsync("allUsers", key);

            return user;
        }
        public async Task<User?> Update(User user)
        {
            var key = $"user:{user.Id}";
            if (!await _db.KeyExistsAsync(key))
            {
                return null;
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
            }
            return user;
        }

        public async Task<IEnumerable<string>> GetUserReservationIds(string userId)
        {
            var key = $"user:{userId}:reservations";
            var ids = await _db.SetMembersAsync(key);

            return ids.Select(x=>x.ToString());
        }
    }
}
