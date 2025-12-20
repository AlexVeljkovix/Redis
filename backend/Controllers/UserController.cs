using backend.DTOs;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

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
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetAll()
        {
            var users = await _userService.GetAll();
            return Ok(users);
        }
        [HttpGet("{id}/reservations")]
        public async Task<ActionResult<IEnumerable<string>>> GetUserReservationIds(string id)
        {
            var reservations = await _userService.GetUserReservationIds(id);
            return Ok(reservations);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>>GetById(string id)
        {
            var user=await _userService.GetById(id);
            if(user==null) return NotFound();
            return Ok(user);
        }

        [HttpPost]
        public async Task<ActionResult<User>>Create(UserDTO user)
        {
            var u=await _userService.Create(user);
            if (u == null) return BadRequest();
            return Ok(u);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<User>>Update(string id, UserDTO user)
        {
            var u = await _userService.Update(id, user);
            if (u==null) return NotFound();
            return Ok(u);
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult<User>>Delete(string id)
        {
            var u=await _userService.Delete(id);
            if(u==null) return NotFound();  
            return Ok(u);
        }

    }
}
