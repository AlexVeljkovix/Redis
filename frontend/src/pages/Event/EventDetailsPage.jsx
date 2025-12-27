import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useEvents } from "../../context/EventContext";
import { useReservations } from "../../context/ReservationContext";

const EventDetailsPage = () => {
  const { eventId } = useParams();
  const { getEventById, isLoading: eventsLoading } = useEvents();
  const { addReservation } = useReservations();

  const [reservationLoading, setReservationLoading] = useState(false);

  const event = getEventById(eventId);

  if (eventsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-gray-500 text-lg">Loading event...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-red-500 text-lg">Event not found</p>
      </div>
    );
  }

  const availableSeats = event.capacity - event.reservationNumber;
  const lowAvailability = availableSeats < 20;

  const handleReservation = async () => {
    setReservationLoading(true);
    try {
      await addReservation("user-id-placeholder", event.id, Date.now());
    } catch (err) {
      console.error(err);
    } finally {
      setReservationLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-5xl mx-auto bg-linear-to-br from-indigo-600 to-purple-600 p-0.5 shadow-xl">
        <div className="bg-white p-8">
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
              📍 {event.location.name} · 📅 {event.formattedDate} · ⏰{" "}
              {event.formattedTime}
            </p>
            <p className="text-gray-500">
              {event.tags.map((tag) => `#${tag} `)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold mb-3">About the event</h2>
              <p className="text-gray-700 leading-relaxed">
                {event.description}
              </p>
            </div>

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

              <button
                onClick={handleReservation}
                disabled={reservationLoading || availableSeats === 0}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition hover:cursor-pointer disabled:opacity-50"
              >
                {reservationLoading ? "Reserving..." : "Reserve seat"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
