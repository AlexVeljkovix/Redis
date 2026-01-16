import { Link } from "react-router-dom";
import { useEvents } from "../../context/EventContext";
import { useAuth } from "../../context/AuthContext";

const EventCard = ({ event }) => {
  const { removeEvent } = useEvents();
  const { isAdmin } = useAuth();

  const availableSeats = event.capacity - event.reservationNumber;
  const lowSeats = availableSeats < 20;
  const isPastEvent = new Date(event.date) < new Date();

  return (
    <div className="bg-linear-to-br from-indigo-600 to-purple-600 p-0.5 shadow-lg w-full max-w-3xl mx-auto">
      <div className="bg-white p-5 h-full flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-2xl font-bold text-gray-900">{event.name}</h3>

          <span
            className={`font-semibold px-2 py-1 rounded-full ${
              isPastEvent
                ? "bg-gray-200 text-gray-600"
                : lowSeats
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {isPastEvent ? "Event finished" : `${availableSeats} seats left`}
          </span>
        </div>

        <div className="text-gray-600 mb-4">
          <p>📍 {event.location.name}</p>
          <p>📅 {event.formattedDate}</p>
          <p>⏰ {event.formattedTime}</p>
        </div>

        <div className="flex justify-end gap-3 mt-auto">
          {isAdmin() && (
            <button
              onClick={() => removeEvent(event.id)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Delete
            </button>
          )}
          <Link
            to={`/events/${event.id}`}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
