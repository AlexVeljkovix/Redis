namespace backend.Models
{
    public class User
    {
        public string Id { get;set;  }=Guid.NewGuid().ToString();
        public string Name { get; set; }
        public string Email { get;set;  }
        public string Role { get; set; }
        public string PasswordHash { get; set; }

    }
}
