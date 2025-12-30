import { Link } from "react-router-dom";
import { useEvents } from "../../context/EventContext";
import { useAuth } from "../../context/AuthContext";

const EventCard = ({ event }) => {
  const { removeEvent } = useEvents();
  const { isAdmin } = useAuth();

  const availableSeats = event.capacity - event.reservationNumber;
  const lowSeats = availableSeats < 20;

  return (
    <div className="bg-linear-to-br from-indigo-600 to-purple-600 p-0.5 shadow-lg hover:shadow-xl transition w-full max-w-3xl mx-auto">
      <div className="bg-white p-5 h-full flex flex-col">
        {/* HEADER */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-2xl font-bold text-gray-900">{event.name}</h3>

          <span
            className={`font-semibold px-2 py-1 rounded-full ${
              lowSeats
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {availableSeats} seats left
          </span>
        </div>

        {/* INFO */}
        <div className="text-gray-600 space-y-1 mb-4">
          <p>📍 {event.location.name}</p>
          <p>📅 {event.formattedDate}</p>
          <p>⏰ {event.formattedTime}</p>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end mt-auto">
          <div className="flex gap-3 justify-end w-full">
            {/* Samo admin vidi Delete dugme */}
            {isAdmin() && (
              <button
                onClick={() => removeEvent(event.id)}
                className="text-center bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition hover:cursor-pointer"
              >
                Delete
              </button>
            )}
            <Link
              to={`/events/${event.id}`}
              className="text-center bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
