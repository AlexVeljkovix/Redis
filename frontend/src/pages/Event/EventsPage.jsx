import React from "react";
import { useEvents } from "../../context/EventContext";
import EventCard from "../../components/Event/EventCard";

const EventsPage = () => {
  const { events, isLoading, error } = useEvents();

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

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 text-center">
        Upcoming Events
      </h1>

      <div className="flex flex-col items-center gap-6 w-4/5 mx-auto">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
