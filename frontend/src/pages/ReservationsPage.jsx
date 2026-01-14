import { useAuth } from "../context/AuthContext";
import { useReservations } from "../context/ReservationContext";
import { useEvents } from "../context/EventContext";
import { Link } from "react-router-dom";
import ReservationCard from "../components/Reservation/ReservationCard";

const ReservationsPage = () => {
  const { isAdmin } = useAuth();
  const {
    reservations,
    removeReservation,
    isLoading: reservationsLoading,
  } = useReservations();
  const { getEventById, isLoading: eventsLoading } = useEvents();

  const handleCancelReservation = async (reservationId) => {
    if (window.confirm("Are you sure you want to cancel this reservation?")) {
      try {
        await removeReservation(reservationId);
      } catch (error) {
        console.error("Failed to cancel reservation:", error);
        alert("Failed to cancel reservation. Please try again.");
      }
    }
  };

  if (reservationsLoading || eventsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-gray-500 text-lg">Loading reservations...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          {isAdmin() ? "All Reservations" : "My Reservations"}
        </h1>

        {reservations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-500 text-lg mb-6">No reservations found.</p>
            <Link
              to="/events"
              className="inline-block bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map((reservation) => {
              const event = getEventById(reservation.eventId);
              return (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  event={event}
                  onCancel={handleCancelReservation}
                />
              );
            })}
          </div>
        )}

        {isAdmin() && reservations.length > 0 && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              Admin view: Total reservations: {reservations.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationsPage;
