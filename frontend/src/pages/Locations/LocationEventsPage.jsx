import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getLocationEvents,
  getLocationById as getLocationByIdAPI,
} from "../../api/locationApi";
import EventCardForLocation from "../../components/Event/EventCardForLocation";
import { useLocations } from "../../context/LocationContext";

const LocationEventsPage = () => {
  const { locationId } = useParams();
  const { getLocationById, isLoading: locationsLoading } = useLocations();

  const [location, setLocation] = useState(null);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);

        // čekaj dok lokacije nisu učitane iz Context-a
        let loc = getLocationById(locationId);
        if (!loc) {
          // fallback: pozovi API direktno ako lokacija nije u Context-u
          loc = await getLocationByIdAPI(locationId);
        }

        const ev = await getLocationEvents(locationId);

        setLocation(loc);
        setEvents(ev);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    // samo pokreni fetch ako lokacije iz Context-a nisu još uvek loading
    if (!locationsLoading) {
      fetchEvents();
    }
  }, [locationId, locationsLoading, getLocationById]);

  if (isLoading || !location) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-gray-500 text-lg">Loading events...</p>
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

  if (!events || events.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-gray-500 text-lg">No events found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="flex justify-between mb-5">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">
          Upcoming Events at {location?.name}
        </h1>
      </div>

      <div className="flex flex-col items-center gap-6 w-4/5 mx-auto">
        {events.map((event) => (
          <EventCardForLocation key={event.id} eventId={event.id} />
        ))}
      </div>
    </div>
  );
};

export default LocationEventsPage;
