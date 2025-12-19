using backend.Models;

namespace backend.Repos
{
    public interface IEventRepo
    {
        public Task<IEnumerable<Event>> GetAll();
        public Task<Event?> GetById(string id);
        public Task<Event?> Create(Event e);
        public Task<Event?> Update(Event e);
        public Task<Event?> Delete(string id);

        Task<IEnumerable<string>> GetEventReservationIds(string eventId);
        Task<IEnumerable<string>> GetEventsByTag(string tag);
    }
}
