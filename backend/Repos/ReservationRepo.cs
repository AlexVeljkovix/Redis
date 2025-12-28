using backend.Models;
using StackExchange.Redis;
using System.Diagnostics;
using System.Text.Json;

namespace backend.Repos
{
    public class ReservationRepo:IReservationRepo
    {
        private readonly IDatabase _db;
        public ReservationRepo(RedisContext context)
        {
            _db = context.Db;
        }
        public async Task<IEnumerable<Reservation>> GetAll()
        {
            var keys = await _db.SetMembersAsync("allReservations");
            var reservations= new List<Reservation>();
            foreach (var key in keys)
            {
                var json = await _db.HashGetAsync(key.ToString(), "data");
                var jsonString=(string)json;
                if (!string.IsNullOrEmpty(jsonString))
                {
                    reservations.Add(JsonSerializer.Deserialize<Reservation>(jsonString)!);
                }
            }
            return reservations;
        }
        public async Task<Reservation?> GetById(string id)
        {
            var key = $"reservation:{id}";
            var json= await _db.HashGetAsync(key, "data");
            var jsonString = (string)json;
            if (!string.IsNullOrEmpty(jsonString))
            {
                return JsonSerializer.Deserialize<Reservation>(jsonString);
            }
            return null;
        }

        public async Task<IEnumerable<string>> GetUserReservationIds(string userId)
        {
            var key = $"user:{userId}:reservations";
            var ids = await _db.SetMembersAsync(key);

            return ids.Select(x => x.ToString());
        }

        public async Task<Reservation?> Create(Reservation reservation)
        {
            var key = $"reservation:{reservation.Id}";
            var json = JsonSerializer.Serialize(reservation);
            await _db.HashSetAsync(key, new HashEntry[] { new HashEntry("data", json) });
            await _db.SetAddAsync("allReservations", key);
            await _db.SetAddAsync($"user:{reservation.UserId}:reservations", reservation.Id);
            await _db.SetAddAsync($"event:{reservation.EventId}:reservations", reservation.Id);
            return reservation;
        }
        public async Task<Reservation?> Delete(string id)
        {
            var key = $"reservation:{id}";
            var res=await GetById(id);
            if (res != null)
            {
                await _db.KeyDeleteAsync(key);
                await _db.SetRemoveAsync("allReservations", key);
                await _db.SetRemoveAsync($"user:{res.UserId}:reservations", res.Id);
                await _db.SetRemoveAsync($"event:{res.EventId}:reservations", res.Id);
            }
            return res;
        }
    }
}
