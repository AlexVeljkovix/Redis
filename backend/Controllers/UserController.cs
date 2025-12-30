using backend.DTOs;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;
        public UserController(UserService userService)
        {
            _userService = userService;
        }

        [Authorize(Roles ="Admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserResponseDTO>>> GetAll()
        {
            var users = await _userService.GetAll();
            return Ok(users);
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<UserResponseDTO>>GetById(string id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = User.IsInRole("Admin");

            if (!isAdmin && userId != id)
            {
                return Forbid();
            }

            var user = await _userService.GetById(id);
            if (user == null) return NotFound();

            return Ok(user);
        }


        [Authorize]
        [HttpGet("me")]
        public async Task<ActionResult<UserResponseDTO>> GetMyProfile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userService.GetById(userId);
            if (user == null) return NotFound();
            return Ok(user);
        }

        [Authorize(Roles ="Admin")]
        [HttpPost]
        public async Task<ActionResult<UserResponseDTO>>Create(UserCreateDTO user)
        {
            var u=await _userService.Create(user);
            if (u == null) return BadRequest("User with this email already exists");
            return Ok(u);
        }


        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<UserResponseDTO>>Update(string id, UserUpdateDTO user)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = User.IsInRole("Admin");

            if (!isAdmin && userId != id)
            {
                return Forbid();
            }
            if (!isAdmin && user.Role != null)
            {
                return Forbid();
            }

            var u = await _userService.Update(id, user);
            if (u == null)
                return NotFound();

            return Ok(u);
        }

        [Authorize(Roles ="Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult<UserResponseDTO>>Delete(string id)
        {
            var u=await _userService.Delete(id);
            if(u==null) return NotFound();  
            return Ok(u);
        }

    }
}
