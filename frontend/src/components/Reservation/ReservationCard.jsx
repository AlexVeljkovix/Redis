import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ReservationCard = ({ reservation, event, onCancel }) => {
  const { isAdmin } = useAuth();

  if (!event) return null;

  const isPastEvent = new Date(event.date) < new Date();

  return (
    <div className="bg-linear-to-br from-indigo-600 to-purple-600 p-0.5 shadow-lg">
      <div className="bg-white p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {event.name}
            </h3>

            <div className="text-gray-600 space-y-1">
              <p>📍 {event.location?.name}</p>
              <p>📅 {event.formattedDate}</p>
              <p>⏰ {event.formattedTime}</p>
              {isAdmin() && (
                <p className="text-sm text-gray-500 mt-2 font-mono">
                  User ID:{" "}
                  <span className="font-mono text-gray-700">
                    {reservation.userId}
                  </span>
                </p>
              )}
              <p className="text-sm text-gray-500 mt-2 font-mono">
                Reservation ID:{" "}
                <span className="font-mono text-gray-700">
                  {reservation.id}
                </span>
              </p>
            </div>
          </div>

          {isPastEvent && (
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-semibold">
              Past Event
            </span>
          )}
        </div>

        <div className="flex gap-3 justify-end mt-4">
          <button
            onClick={() => onCancel(reservation.id)}
            className="bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Cancel Reservation
          </button>

          <Link
            to={`/events/${event.id}`}
            className="bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            View Event
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReservationCard;
