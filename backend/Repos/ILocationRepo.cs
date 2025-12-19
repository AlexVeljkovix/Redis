using backend.Models;

namespace backend.Repos
{
    public interface ILocationRepo
    {
        public Task<IEnumerable<Location>> GetAll();
        public Task<Location?> GetById(string id);
        public Task<Location?> Create(Location location);
        public Task<Location?> Update(Location location);
        public Task<Location?> Delete(string id);
        public Task<IEnumerable<string>> GetLocationEventIds(string locationId);
    }
}
