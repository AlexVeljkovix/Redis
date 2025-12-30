import React, { useState } from "react";
import { useEvents } from "../../context/EventContext";
import { useAuth } from "../../context/AuthContext";
import EventCard from "../../components/Event/EventCard";
import CreateEventForm from "../../components/Event/CreateEventForm";
import { useSearch } from "../../context/SearchContext";

const EventsPage = () => {
  const { events, isLoading, error } = useEvents();
  const { isAdmin } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const { searchTerm } = useSearch();

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  if (showForm) {
    return (
      <div className="min-h-screen bg-slate-100 p-8">
        <CreateEventForm setShowForm={setShowForm} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-4xl font-bold text-gray-900">Upcoming Events</h1>

        {/* Samo admin vidi dugme za kreiranje */}
        {isAdmin() && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 text-white py-2 px-4 h-10 rounded-lg font-semibold hover:bg-indigo-700 transition cursor-pointer"
          >
            Add New Event
          </button>
        )}
      </div>

      {!filteredEvents || filteredEvents.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-500 text-lg">No events found.</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 w-4/5 mx-auto">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsPage;
