import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UsersPage from "./pages/UsersPage";
import LocationsPage from "./pages/LocationsPage";
import EventsPage from "./pages/Event/EventsPage";
import ReservationsPage from "./pages/ReservationsPage";
import EventDetailsPage from "./pages/Event/EventDetailsPage";

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Routes>
          <Route path="/users" element={<UsersPage />} />
          <Route path="/locations" element={<LocationsPage />} />
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
