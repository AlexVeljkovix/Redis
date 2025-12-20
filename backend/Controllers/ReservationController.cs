using backend.DTOs;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReservationController : ControllerBase
    {
        private readonly ReservationService _reservationService;

        public ReservationController(ReservationService reservationService)
        {
            _reservationService = reservationService;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Reservation>>> GetAll()
        {
            var reservations = await _reservationService.GetAll();  
            return Ok(reservations);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Reservation>> GetById(string id)
        {
            var reservation = await _reservationService.GetById(id);
            if(reservation == null) return NotFound();
            return Ok(reservation);
        }
        [HttpPost]
        public async Task<ActionResult<Reservation>>Create(ReservationDTO reservation)
        {
            var res = await _reservationService.Create(reservation);
            if(res== null) return BadRequest();
            return Ok(res);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Reservation>> Delete(string id)
        {
            var res=await _reservationService.Delete(id);
            if(res==null) return NotFound();
            return Ok(res);
        }
    }
}
