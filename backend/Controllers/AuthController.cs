using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly JWTService _jwtService;

        public AuthController(UserService userService, JWTService jwtService)
        {
            _userService = userService;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDTO dto)
        {
            var user = await _userService.Register(dto);
            if (user == null)
            {
                return BadRequest("User with this email already exists");
            }
            return Ok(new
            {
                user.Id,
                user.Name,
                user.Email,
                user.Role
            });
        }


        [HttpPost("login")]

        public async Task<ActionResult> Login(LoginDTO dto)
        {
            var user = await _userService.Login(dto);
            if (user == null)
            {
                return BadRequest("Invalid credentials");
            }

            var token = _jwtService.GenerateToken(user);

            return Ok(new
            {
                token,
                user = new
                {
                    user.Id,
                    user.Name,
                    user.Email,
                    user.Role
                }
            });
        }
    }
}
