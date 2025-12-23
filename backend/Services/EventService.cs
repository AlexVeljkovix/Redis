using backend.Repos;
using backend.Models;
using backend.DTOs;
namespace backend.Services
{
    public class EventService
    {
        private readonly IEventRepo _eventRepo;

        public EventService(IEventRepo eventRepo)
        {
            _eventRepo = eventRepo;
        }

        public async Task<IEnumerable<Event>> GetAll()
        {
            return await _eventRepo.GetAll();
        }

        public async Task<Event?>GetById(string id)
        {
            return await _eventRepo.GetById(id);
        }

        public async Task<int>GetEventReservationNumber(string eventId)
        {
            return await _eventRepo.GetEventReservationNumber(eventId);
        }

        public async Task<Event?>Create(EventDTO e)
        {
            return await _eventRepo.Create(new Event
            {
                Name=e.Name,
                LocationId=e.LocationId,
                Description=e.Description,
                Date=e.Date,
                Capacity=e.Capacity,
                Tags=e.Tags,
            });
        }

        public async Task<Event?> Update(string id, EventDTO e)
        {
            return await _eventRepo.Update(new Event
            {
                Id=id,
                Name = e.Name,
                LocationId = e.LocationId,
                Description=e.Description,
                Date = e.Date,
                Capacity = e.Capacity,
                Tags = e.Tags,
            });
        }

        public async Task<Event?>Delte(string id)
        {
            return await _eventRepo.Delete(id);
        }

        public async Task<IEnumerable<string>>GetEventReservationIds(string eventId)
        {
            return await _eventRepo.GetEventReservationIds(eventId);
        }
    }
}
