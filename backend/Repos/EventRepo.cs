using backend.Models;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using StackExchange.Redis;
using System.Text.Json;


namespace backend.Repos
{
    public class EventRepo:IEventRepo
    {
        private readonly IDatabase _db;

        public EventRepo(RedisContext context)
        {
            _db = context.Db;
        }

        public async Task<IEnumerable<Event>> GetAll()
        {
            var keys = await _db.SetMembersAsync("allEvents");
            var events = new List<Event>();
            foreach (var key in keys)
            {
                var json = await _db.HashGetAsync(key.ToString(), "data");
                var jsonString = (string)json;
                if (!string.IsNullOrEmpty(jsonString))
                {
                    events.Add(JsonSerializer.Deserialize<Event>(jsonString)!);
                }
            }
            return events;
        }

        public async Task<Event?> GetById(string id)
        {
            var key = $"event:{id}";
            var json = await _db.HashGetAsync(key, "data");
            var jsonString = (string)json;
            if (!string.IsNullOrEmpty(jsonString))
            {
                return JsonSerializer.Deserialize<Event>(jsonString)!;
            }
            return null;
        }
        public async Task<Event?>Create(Event e)
        {
            var key = $"event:{e.Id}";
            var json = JsonSerializer.Serialize(e);
            await _db.HashSetAsync(key, new HashEntry[]{ new HashEntry("data", json)});
            await _db.SetAddAsync("allEvents", key);
            await _db.SetAddAsync($"location:{e.LocationId}:events", e.Id);
            if (e.Tags != null)
            {
                foreach (var tag in e.Tags)
                {
                    await _db.SetAddAsync($"tag:{tag}:events", e.Id);
                }
            }
            return e;
        }

        public async Task<Event?>Update(Event e)
        {
            var key = $"event:{e.Id}";
            var oldEvent = await GetById(e.Id);
            if (oldEvent == null)
                return null;

            if (oldEvent.LocationId != e.LocationId)
            {
                await _db.SetRemoveAsync(
                    $"location:{oldEvent.LocationId}:events", oldEvent.Id);

                await _db.SetAddAsync(
                    $"location:{e.LocationId}:events", e.Id);
            }

            var oldTags = oldEvent.Tags ?? new List<string>();
            var newTags = e.Tags ?? new List<string>();

            foreach (var tag in oldTags.Except(newTags))
            {
                await _db.SetRemoveAsync($"tag:{tag}:events", oldEvent.Id);
            }

            foreach (var tag in newTags.Except(oldTags))
            {
                await _db.SetAddAsync($"tag:{tag}:events", e.Id);
            }
            var json = JsonSerializer.Serialize(e);
            await _db.HashSetAsync(key, "data", json);

            return e;
        }
        public async Task<Event?>Delete(string id)
        {
            var key = $"event:{id}";
            var e =await GetById(id);
            if(e != null)
            {
                await _db.KeyDeleteAsync(key);
                await _db.SetRemoveAsync("allEvents", key);
                await _db.SetRemoveAsync($"location:{e.LocationId}:events", e.Id);
                if(e.Tags!= null)
                {
                    foreach (var tag in e.Tags)
                    {
                        await _db.SetRemoveAsync($"tag:{tag}:events", e.Id);
                    }
                }
            }
            return e;
        }

        public async Task<IEnumerable<string>> GetEventReservationIds(string eventId)
        {
            var ids=await _db.SetMembersAsync($"event:{eventId}:reservations");
            return ids.Select(x => x.ToString());
        }

        public async Task<IEnumerable<string>>GetEventsByTag(string tag)
        {
            var ids = await _db.SetMembersAsync($"tag:{tag}:events");
            return ids.Select(x=>x.ToString());
        }
    }
}
