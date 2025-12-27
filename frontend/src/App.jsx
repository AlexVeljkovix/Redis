import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UsersPage from "./pages/UsersPage";
import EventsPage from "./pages/Event/EventsPage";
import ReservationsPage from "./pages/ReservationsPage";
import EventDetailsPage from "./pages/Event/EventDetailsPage";
import LocationsPage from "./pages/Locations/LocationsPage";
import LocationDetailsPage from "./pages/Locations/LocationDetailsPage";
import LocationEventsPage from "./pages/Locations/LocationEventsPage";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="min-h-screen flex flex-col">
        <Routes>
          <Route path="/users" element={<UsersPage />} />
          <Route path="/locations" element={<LocationsPage />} />
          <Route
            path="/locations/:locationId"
            element={<LocationDetailsPage />}
          />
          <Route
            path="/locations/:locationId/events"
            element={<LocationEventsPage />}
          />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:eventId" element={<EventDetailsPage />} />
          <Route path="/reservations" element={<ReservationsPage />} />
          <Route path="*" element={<Navigate to="/events" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
