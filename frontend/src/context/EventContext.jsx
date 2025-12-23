import { useState, useEffect, useContext, createContext } from "react";
import {
  getAllEvents,
  getEventReservationIds,
  getEventReservationNumber,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../api/eventApi";
import { getLocationById } from "../api/locationApi";

const EventContext = createContext();

const enrichEvent = async (event) => {
  const [location, reservationNumber] = await Promise.all([
    getLocationById(event.locationId),
    getEventReservationNumber(event.id),
  ]);

  const date = new Date(event.date);

  return {
    ...event,
    formattedDate: date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    formattedTime: date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    location,
    reservationNumber,
  };
};

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAllEvents();

        const enrichedEvents = await Promise.all(
          data.map((event) => enrichEvent(event))
        );

        setEvents(enrichedEvents);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const getEventById = (id) => {
    return events.find((e) => e.id === id) ?? null;
  };

  const getReservationsForEvent = async (eventId) => {
    return await getEventReservationIds(eventId);
  };

  const getEventReservationInfo = async (eventId) => {
    return await getEventReservationNumber(eventId);
  };
  const addEvent = async (eventData) => {
    const created = await createEvent(eventData);
    const enriched = await enrichEvent(created);

    setEvents((prev) => [...prev, enriched]);
  };

  const changeEvent = async (eventId, updatedData) => {
    const updated = await updateEvent(eventId, updatedData);
    const enriched = await enrichEvent(updated);

    setEvents((prev) => prev.map((e) => (e.id === eventId ? enriched : e)));
  };

  const removeEvent = async (eventId) => {
    await deleteEvent(eventId);
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
  };

  return (
    <EventContext.Provider
      value={{
        events,
        isLoading,
        error,
        getEventById,
        getReservationsForEvent,
        getEventReservationNumber,
        addEvent,
        changeEvent,
        removeEvent,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => useContext(EventContext);
