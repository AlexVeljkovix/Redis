using backend;
using backend.Repos;
using backend.Services;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

// =====================
// Redis
// =====================
builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
{
    var configuration = ConfigurationOptions.Parse("localhost:6379");
    return ConnectionMultiplexer.Connect(configuration);
});

builder.Services.AddSingleton<RedisContext>();

// =====================
// Repos & Services
// =====================
builder.Services.AddScoped<IUserRepo, UserRepo>();
builder.Services.AddScoped<IEventRepo, EventRepo>();
builder.Services.AddScoped<IReservationRepo, ReservationRepo>();
builder.Services.AddScoped<ILocationRepo, LocationRepo>();

builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<EventService>();
builder.Services.AddScoped<ReservationService>();
builder.Services.AddScoped<LocationService>();

// =====================
// Controllers & Swagger
// =====================
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// =====================
// CORS - razvoj
// =====================
builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCorsPolicy", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173") // promeni port po potrebi
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// =====================
// Middleware
// =====================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// CORS mora pre Authorization i MapControllers
app.UseCors("DevCorsPolicy");

app.UseAuthorization();

app.MapControllers();

app.Run();
