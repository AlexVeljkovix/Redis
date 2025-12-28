using backend.Repos;
using backend.Models;
using backend.DTOs;
using StackExchange.Redis;
using System.Text.Json;

namespace backend.Services
{
    public class ReservationService
    {
        private readonly IReservationRepo _reservationRepo;
        private readonly IEventRepo _eventRepo;
        private readonly IUserRepo _userRepo;
        private readonly IDatabase _db;

        private const string CreateReservationLua = @"
            -- KEYS:
            -- 1 = event:{eventId}:reservations
            -- 2 = reservation:{reservationId}
            -- 3 = allReservations
            -- 4 = user:{userId}:reservations

            -- ARGV:
            -- 1 = capacity
            -- 2 = reservationId
            -- 3 = userId
            -- 4 = eventId
            -- 5 = reservationJson

            local current = redis.call('SCARD', KEYS[1])
            local capacity = tonumber(ARGV[1])

            if current >= capacity then
                return 0
            end

            redis.call('HSET', KEYS[2], 'data', ARGV[5])
            redis.call('SADD', KEYS[3], KEYS[2])
            redis.call('SADD', KEYS[4], ARGV[2])
            redis.call('SADD', KEYS[1], ARGV[2])

            return 1
        ";
        public ReservationService(IReservationRepo reservationRepo, IEventRepo eventRepo, IUserRepo userRepo, RedisContext context)
        {
            _reservationRepo = reservationRepo;
            _eventRepo = eventRepo;
            _userRepo=userRepo;
            _db = context.Db;
        }

        public async Task<IEnumerable<Reservation>> GetAll()
        {
            return await _reservationRepo.GetAll();
        }
        public async Task<Reservation?> GetById(string id)
        {
            return await _reservationRepo.GetById(id);
        }

        public async Task<IEnumerable<Reservation>> GetUserReservations(string userId)
        {
            var reservations = new List<Reservation>();
            var ids = await _reservationRepo.GetUserReservationIds(userId);
            foreach (var id in ids)
            {
                var res = await _reservationRepo.GetById(id);
                if (res != null)
                {
                    reservations.Add(res);
                } 
            }

            return reservations;
        }


        public async Task<Reservation?> GetUserReservationById(string userId, string reservationId)
        {
            var reservation = await _reservationRepo.GetById(reservationId);
            if (reservation == null) return null;

            if (reservation.UserId != userId) return null;

            return reservation;
        }

        public async Task<Reservation?> Create(ReservationDTO reservation)
        {
            var e = await _eventRepo.GetById(reservation.EventId);
            var user = await _userRepo.GetById(reservation.UserId);
            if (e == null || user == null)
            {
                return null;
            }
            var res = new Reservation
            {
                UserId = reservation.UserId,
                EventId = reservation.EventId,
                CreatedAt = reservation.CreatedAt
            };
            var reservationJson = JsonSerializer.Serialize(res);
            var reservationId=res.Id;
            var result = (int)await _db.ScriptEvaluateAsync(CreateReservationLua,
                new RedisKey[]
                {
                    $"event:{res.EventId}:reservations",
                    $"reservation:{reservationId}",
                    "allReservations",
                    $"user:{res.UserId}:reservations"
                }, new RedisValue[]
                {
                    e.Capacity,
                    reservationId,
                    res.UserId,
                    res.EventId,
                    reservationJson
                });
            if (result == 0)
            {
                return null;
            }
            return res;
        }

        public async Task<Reservation?>Delete(string id)
        {
            return await _reservationRepo.Delete(id);
        } 
    }
}
