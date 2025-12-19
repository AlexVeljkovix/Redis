using StackExchange.Redis;
using backend.Models;
using System.Text.Json;

namespace backend.Repos
{
    public class LocationRepo:ILocationRepo
    {
        private readonly IDatabase _db;

        public LocationRepo(RedisContext context)
        {
            _db=context.Db;
        }

        public async Task<IEnumerable<Location>> GetAll()
        {
            var keys = await _db.SetMembersAsync("allLocations");
            var locations = new List<Location>();
            foreach(var key in keys)
            {
                var json = await _db.HashGetAsync(key.ToString(), "data");
                var jsonString = (string)json;
                if (!string.IsNullOrEmpty(jsonString))
                {
                    locations.Add(JsonSerializer.Deserialize<Location>(jsonString)!);
                }
            }
            return locations;
        }

        public async Task<Location?>GetById(string id)
        {
            var key = $"location:{id}";
            var json= await _db.HashGetAsync(key, "data");
            var jsonString = (string)json;
            if (!string.IsNullOrEmpty(jsonString))
            {
                return JsonSerializer.Deserialize<Location>(jsonString);
            }
            return null;
        }

        public async Task<Location?>Create(Location location)
        {
            var key = $"location:{location.Id}";
            var json = JsonSerializer.Serialize(location);
            await _db.HashSetAsync(key, new HashEntry[] { new HashEntry("data", json) });
            await _db.SetAddAsync("allLocations", key);
            return location;
        }
        public async Task<Location?>Update(Location location)
        {
            var key = $"location:{location.Id}";
            if(!await _db.KeyExistsAsync(key))
            {
                return null;
            }
            var json=JsonSerializer.Serialize(location);
            await _db.HashSetAsync(key, new HashEntry[] { new HashEntry("data", json) });
            return location;
        }

        public async Task<Location?> Delete(string id)
        {
            var key = $"location:{id}";
            var location = await GetById(id);
            if (location != null)
            {
                await _db.KeyDeleteAsync(key);
                await _db.SetRemoveAsync("allLocations", key);
            }
            return location;
        }
        public async Task<IEnumerable<string>>GetLocationEventIds(string locationId)
        {
            var key = $"location:{locationId}:events";
            var ids = await _db.SetMembersAsync(key);

            return ids.Select(x => x.ToString());
        }
    }
}
