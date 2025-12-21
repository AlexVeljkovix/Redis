namespace backend.Models
{
    public class Reservation
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string UserId {  get; set; }
        public string EventId { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
