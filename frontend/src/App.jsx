import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { EventProvider } from "./context/EventContext";
import { LocationProvider } from "./context/LocationContext";
import { ReservationProvider } from "./context/ReservationContext";
import { SearchProvider } from "./context/SearchContext";

import ProtectedRoute from "./components/Auth/ProtectedRoute";
import LoginForm from "./components/Auth/LoginForm";
import RegisterForm from "./components/Auth/RegisterForm";
import Navbar from "./components/Navbar";

import UsersPage from "./pages/UsersPage";
import EventsPage from "./pages/Event/EventsPage";
import EventDetailsPage from "./pages/Event/EventDetailsPage";
import LocationsPage from "./pages/Locations/LocationsPage";
import LocationDetailsPage from "./pages/Locations/LocationDetailsPage";
import LocationEventsPage from "./pages/Locations/LocationEventsPage";
import ReservationsPage from "./pages/ReservationsPage";
import ProfilePage from "./pages/ProfilePage";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SearchProvider>
          <EventProvider>
            <LocationProvider>
              <ReservationProvider>
                <Navbar />
                <div className="min-h-screen flex flex-col">
                  <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterForm />} />

                    {/* Protected routes - Sve autentifikovane */}
                    <Route
                      path="/events"
                      element={
                        <ProtectedRoute>
                          <EventsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/events/:eventId"
                      element={
                        <ProtectedRoute>
                          <EventDetailsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/locations"
                      element={
                        <ProtectedRoute>
                          <LocationsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/locations/:locationId"
                      element={
                        <ProtectedRoute>
                          <LocationDetailsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/locations/:locationId/events"
                      element={
                        <ProtectedRoute>
                          <LocationEventsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/reservations"
                      element={
                        <ProtectedRoute>
                          <ReservationsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <ProfilePage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Admin only routes */}
                    <Route
                      path="/users"
                      element={
                        <ProtectedRoute adminOnly>
                          <UsersPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Redirect */}
                    <Route
                      path="/"
                      element={<Navigate to="/events" replace />}
                    />
                    <Route
                      path="*"
                      element={<Navigate to="/events" replace />}
                    />
                  </Routes>
                </div>
              </ReservationProvider>
            </LocationProvider>
          </EventProvider>
        </SearchProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
