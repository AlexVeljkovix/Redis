using backend.DTOs;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LocationController : ControllerBase
    {
        private readonly LocationService _locationService;
        public LocationController(LocationService locationService)
        {
            _locationService = locationService;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Location>>> GetAll()
        {
            var locations=await _locationService.GetAll();
            return Ok(locations);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<Location>>>GetById(string id)
        {
            var location= await _locationService.GetById(id);
            if (location == null) return NotFound();
            return Ok(location);
        }

        [HttpGet("{id}/events")]
        public async Task<ActionResult<IEnumerable<string>>>GetLocationEvents(string id)
        {
            var events = await _locationService.GetLocationEvents(id);
            return Ok(events);
        }

        [HttpPost]
        public async Task<ActionResult<Location>>Create(LocationDTO location)
        {
            var l=await _locationService.Create(location);
            if (l == null) return BadRequest();
            return Ok(l);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Location>>Update(string id, LocationDTO location)
        {
            var l = await _locationService.Update(id, location);
            if (l == null) return NotFound();
            return Ok(l);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Location>>Delete(string id)
        {
            var l = await _locationService.Delete(id);
            if (l == null) return NotFound();
            return Ok(l);
        }
    }
}
