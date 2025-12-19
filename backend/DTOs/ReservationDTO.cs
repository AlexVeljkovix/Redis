namespace backend.DTOs
{
    public class ReservationDTO
    {
        public string UserId { get; set; }
        public string EventId { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool Confirmed { get; set; }
    }
}
