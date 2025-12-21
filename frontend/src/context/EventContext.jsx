import { useState, useEffect, useContext, createContext } from "react";
import {
  getAllEvents,
  getEventReservationIds,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../api/eventApi";

const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const eventDate = new Date(event.date);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAllEvents();
        setEvents(
          data.map((event) => ({
            ...event,
            formatedDate: new Date(event.date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            formatedTime: new Date(event.date).toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          }))
        );
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const getEventById = (id) => {
    return events.find((event) => event.id === id);
  };

  const getReservationsForEvent = async (eventId) => {
    return await getEventReservationIds(eventId);
  };

  const addEvent = async (event) => {
    const ev = await createEvent(event);
    setEvents((prevEvents) => [...prevEvents, ev]);
  };
  const changeEvent = async (eventId, updatedEvent) => {
    await updateEvent(eventId, updatedEvent);
    setEvents((prevEvents) =>
      prevEvents.map((event) => (event.id === eventId ? updatedEvent : event))
    );
  };

  const removeEvent = async (eventId) => {
    await deleteEvent(eventId);
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event.id !== eventId)
    );
  };

  return (
    <EventContext.Provider
      value={{
        events,
        isLoading,
        error,
        getEventById,
        getReservationsForEvent,
        addEvent,
        changeEvent,
        removeEvent,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  return useContext(EventContext);
};
