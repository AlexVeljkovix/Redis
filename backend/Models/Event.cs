namespace backend.Models
{
    public class Event
    {
        public string Id { get; set; }=Guid.NewGuid().ToString();
        public string Name { get; set; }
        public string LocationId { get; set; }
        public string Description { get; set;  }
        public DateTime Date { get; set; }
        public int Capacity { get; set; }
        public List<string>? Tags { get; set; } 
    }
}
