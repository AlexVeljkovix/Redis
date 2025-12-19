using StackExchange.Redis;

namespace backend
{
    public class RedisContext
    {
        public readonly IDatabase Db;
        public RedisContext(IConnectionMultiplexer redis)
        {
            Db = redis.GetDatabase();
        }
    }
}
