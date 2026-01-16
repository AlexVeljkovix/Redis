import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useEvents } from "../../context/EventContext";

const EventCardForLocation = ({ eventId }) => {
  const { getEventById, isLoading } = useEvents();
  const [e, setEvent] = useState(null);
  useEffect(() => {
    const ev = getEventById(eventId);
    setEvent(ev);
    console.log(e);
  }, [eventId, getEventById]);

  if (isLoading || !e) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-gray-500 text-lg">Loading events...</p>
      </div>
    );
  }

  const lowSeats = e.capacity - e.reservationNumber < 20;

  return (
    <div className="bg-linear-to-br from-indigo-600 to-purple-600 p-0.5 shadow-lg hover:shadow-xl transition w-full max-w-3xl mx-auto">
      <div className="bg-white p-5 h-full flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-2xl font-bold text-gray-900">{e.name}</h3>

          <span
            className={`font-semibold px-2 py-1 rounded-full ${
              new Date(e.date) < new Date()
                ? "bg-gray-200 text-gray-600"
                : lowSeats
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {new Date(e.date) < new Date()
              ? "Event finished"
              : `${e.capacity - e.reservationNumber} seats left`}
          </span>
        </div>

        <div className="text-gray-600 space-y-1 mb-4">
          <p>📅 {e.formattedDate}</p>
          <p>⏰ {e.formattedTime}</p>
        </div>

        <div className="flex justify-end mt-auto">
          <Link
            to={`/events/${eventId}`}
            className="bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCardForLocation;
