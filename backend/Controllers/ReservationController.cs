using backend.DTOs;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

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


        [Authorize(Roles ="Admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Reservation>>> GetAll()
        {
            var reservations = await _reservationService.GetAll();  
            return Ok(reservations);
        }


        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<Reservation>> GetById(string id)
        {
            var reservation = await _reservationService.GetById(id);
            if(reservation == null) return NotFound();

            if (User.IsInRole("User"))
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (reservation.UserId != userId)
                    return Forbid();
            }

            return Ok(reservation);
        }


        [Authorize(Roles = "User")]
        [HttpGet("me")]
        public async Task<ActionResult<IEnumerable<Reservation>>> GetMyReservations()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var reservations = await _reservationService.GetUserReservations(userId);
            return Ok(reservations);
        }

        [Authorize(Roles = "User")]
        [HttpGet("me/{id}")]
        public async Task<ActionResult<Reservation>> GetMyReservationById(string id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var reservation = await _reservationService.GetUserReservationById(userId, id);

            if (reservation == null) return NotFound();

            return Ok(reservation);
        }

        [Authorize(Roles ="User")]
        [HttpPost]
        public async Task<ActionResult<Reservation>>Create(ReservationDTO reservation)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            reservation.UserId = userId;

            var res = await _reservationService.Create(reservation);
            if(res== null) return BadRequest();
            return Ok(res);
        }


        [Authorize(Roles ="User, Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult<Reservation>> Delete(string id)
        {
            var res=await _reservationService.Delete(id);
            if(res==null) return NotFound();
            return Ok(res);
        }
    }
}
