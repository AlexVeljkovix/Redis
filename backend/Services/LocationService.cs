using backend.Models;
using backend.Repos;
using backend.DTOs;

namespace backend.Services
{
    public class LocationService
    {
        private readonly ILocationRepo _locationRepo;
        private readonly IEventRepo _eventRepo;
        public LocationService(ILocationRepo locationRepo, IEventRepo eventRepo)
        {
            _locationRepo = locationRepo;
            _eventRepo = eventRepo;
        }

        public async Task<IEnumerable<Location>> GetAll()
        {
            return await _locationRepo.GetAll();
        }
        public async Task<Location?>GetById(string id)
        {
            return await _locationRepo.GetById(id);
        }

        public async Task<IEnumerable<Event>>GetLocationEvents(string locationId)
        {
            var events =new List<Event>();
            var ids=await _locationRepo.GetLocationEventIds(locationId);
            foreach(var id in ids)
            {
                var e = await _eventRepo.GetById(id);
                if(e != null)
                {
                    events.Add(e);
                }
            }
            return events;
        }
        public async Task<Location?>Create(LocationDTO location)
        {
            return await _locationRepo.Create(new Location
            {
                Name = location.Name,
                Address = location.Address,
                Description = location.Description,
            });
        }
        public async Task<Location?> Update(string id, LocationDTO location)
        {
            return await _locationRepo.Update(new Location
            {
                Id = id,
                Name = location.Name,
                Address = location.Address,
                Description = location.Description,
            });
        }

        public async Task<Location?>Delete(string id)
        {
            return await _locationRepo.Delete(id);
        }

    }

}
