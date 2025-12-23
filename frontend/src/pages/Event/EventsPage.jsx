import React from "react";
import { useState } from "react";
import { useEvents } from "../../context/EventContext";
import EventCard from "../../components/Event/EventCard";
import CreateEventForm from "../../components/Event/CreateEventForm";
const EventsPage = () => {
  const { events, isLoading, error } = useEvents();
  const [showForm, setShowForm] = useState(false);
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-gray-500 text-lg">Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-red-500 text-lg">Error loading events.</p>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-gray-500 text-lg">No events found.</p>
      </div>
    );
  }
  if (showForm) {
    return (
      <div className="min-h-screen bg-slate-100 p-8">
        <div className="flex justify-between mb-5">
          <CreateEventForm setShowForm={setShowForm} />
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="flex justify-between mb-5">
        <h1 className="text-4xl font-bold mb-6 text-gray-900 t">
          Upcoming Events
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white py-2 px-4 h-10 justify-center rounded-lg font-semibold hover:bg-indigo-700 transition pointer-events-auto cursor-pointer"
        >
          Add New Event
        </button>
      </div>

      <div className="flex flex-col items-center gap-6 w-4/5 mx-auto">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
