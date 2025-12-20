using backend.Models;
using backend.Services;
using backend.DTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventController : ControllerBase
    {
        private readonly EventService _eventService;
        public EventController(EventService eventService)
        {
            _eventService = eventService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Event>>> GetAll()
        {
            var events=await _eventService.GetAll();
            return Ok(events);
        }
        [HttpGet("{id}/reservations")]
        public async Task<ActionResult<IEnumerator<string>>> GetEventReservationIds(string id)
        {
            var reservations = await _eventService.GetEventReservationIds(id);
            return Ok(reservations);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Event>>GetById(string id)
        {
            var e=await _eventService.GetById(id);
            if (e == null) return BadRequest();
            return Ok(e);
        }

        [HttpPost]
        public async Task<ActionResult<Event>> Create(EventDTO ev)
        {
            var e = await _eventService.Create(ev);
            if (e == null) return BadRequest();
            return Ok(e);
        }

        [HttpPost("{id}")]
        public async Task<ActionResult<Event>> Update(string id, EventDTO ev)
        {
            var e = await _eventService.Update(id, ev);
            if (e == null) return NotFound();
            return Ok(e);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Event>>Delete(string id)
        {
            var e = await _eventService.Delte(id);
            if(e == null) return NotFound();
            return Ok(e);
        }
    }
}
