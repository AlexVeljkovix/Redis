using backend;
using backend.Repos;
using backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using StackExchange.Redis;
using System.Text;

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
// Repos
// =====================
builder.Services.AddScoped<IUserRepo, UserRepo>();
builder.Services.AddScoped<IEventRepo, EventRepo>();
builder.Services.AddScoped<IReservationRepo, ReservationRepo>();
builder.Services.AddScoped<ILocationRepo, LocationRepo>();

// =====================
// Services
// =====================
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<EventService>();
builder.Services.AddScoped<ReservationService>();
builder.Services.AddScoped<LocationService>();
builder.Services.AddScoped<JWTService>();
builder.Services.AddScoped<AdminSeedService>();

// =====================
// Controllers & Swagger
// =====================
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// =====================
// CORS - VAŽNO!
// =====================
builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCorsPolicy", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173", "https://localhost:5173") // Dodaj HTTPS
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials(); // DODAJ OVO!
    });
});

// =====================
// JWT Authentication
// =====================
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ClockSkew = TimeSpan.Zero, // DODAJ OVO

            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])
            )
        };

        // DODAJ EVENT HANDLERS ZA DEBUGGING
        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine($"Authentication failed: {context.Exception.Message}");
                return Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                Console.WriteLine("Token validated successfully");
                return Task.CompletedTask;
            }
        };
    });

var app = builder.Build();

// =====================
// Middleware - REDOSLED JE VAŽAN!
// =====================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// CORS MORA BITI PRE Authentication/Authorization!
app.UseCors("DevCorsPolicy");

app.UseAuthentication(); // Prvo Authentication
app.UseAuthorization();  // Zatim Authorization

app.MapControllers();

// =====================
// Admin seed
// =====================
using (var scope = app.Services.CreateScope())
{
    try
    {
        var seedService = scope.ServiceProvider.GetRequiredService<AdminSeedService>();
        await seedService.SeedAdminAsync();
        Console.WriteLine("Admin user seeded successfully");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Admin seed failed: {ex.Message}");
    }
}

app.Run();