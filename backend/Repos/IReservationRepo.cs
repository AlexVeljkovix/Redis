using backend.Models;

namespace backend.Repos
{
    public interface IReservationRepo
    {
        public Task<IEnumerable<Reservation>> GetAll();
        public Task<Reservation?> GetById(string id);
        public Task<Reservation?> Create(Reservation reservation);
        public Task<Reservation?> Delete(string reservationId);

    }
}
