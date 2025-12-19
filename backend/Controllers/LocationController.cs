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
        public async Task<IActionResult> GetAll()
        {
            var locations=await _locationService.GetAll();
            return Ok(locations);
        }
    }
}
