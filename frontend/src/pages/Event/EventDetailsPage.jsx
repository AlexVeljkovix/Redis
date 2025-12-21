import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useEvents } from "../../context/EventContext";

const EventDetailsPage = () => {
  const { eventId } = useParams();
  const { getEventById, getReservationsForEvent } = useEvents();

  const [event, setEvent] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const ev = getEventById(eventId);
        if (!ev) throw new Error("Event not found");
        setEvent(ev);

        const res = await getReservationsForEvent(eventId);
        setReservations(res);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [eventId, getEventById, getReservationsForEvent]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-gray-500 text-lg">Loading event...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  const availableSeats = event.capacity - reservations.length;
  const lowAvailability = availableSeats < 20;

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      {/* GRADIENT WRAPPER */}
      <div className="max-w-5xl mx-auto bg-linear-to-br from-indigo-600 to-purple-600  p-0.5 shadow-xl">
        <div className="bg-white p-8">
          {/* HEADER */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{event.name}</h1>

              <span
                className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  lowAvailability
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {availableSeats} seats left
              </span>
            </div>

            <p className="text-gray-500">
              📍 {event.location} · 📅 {event.formatedDate} · ⏰{" "}
              {event.formatedTime}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* INFO */}
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold mb-3">About the event</h2>
              <p className="text-gray-700 leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* RESERVATION CARD */}
            <div className="bg-gray-50 rounded-xl p-6 border">
              <h3 className="text-lg font-semibold mb-4">Reservation</h3>

              <div className="mb-5">
                <p className="text-sm text-gray-500">Available seats</p>
                <p
                  className={`text-2xl font-bold ${
                    lowAvailability ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {availableSeats} / {event.capacity}
                </p>

                {lowAvailability && (
                  <p className="text-sm text-red-500 mt-1">
                    Hurry up! Few seats left.
                  </p>
                )}
              </div>

              <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
                Reserve seat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
