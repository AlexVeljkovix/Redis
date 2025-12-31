import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useEvents } from "./EventContext";
import {
  getAllReservations,
  getUserReservations,
  createReservation,
  deleteReservation,
} from "../api/reservationApi";

const ReservationContext = createContext();

export const ReservationProvider = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { incrementReservationCount } = useEvents();

  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = isAdmin()
          ? await getAllReservations()
          : await getUserReservations();

        setReservations(data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated()) {
      fetchReservations();
    } else {
      setReservations([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, isAdmin]);

  // ✅ DODAVANJE
  const addReservation = async (reservation) => {
    const res = await createReservation(reservation);

    setReservations((prev) => [...prev, res]);

    // 🔥 odmah smanji available seats
    incrementReservationCount(res.eventId, 1);

    return res;
  };

  // ✅ BRISANJE
  const removeReservation = async (reservationId) => {
    const res = reservations.find((r) => r.id === reservationId);

    await deleteReservation(reservationId);

    setReservations((prev) => prev.filter((r) => r.id !== reservationId));

    if (res) {
      // 🔥 vrati seat nazad
      incrementReservationCount(res.eventId, -1);
    }
  };

  return (
    <ReservationContext.Provider
      value={{
        reservations,
        isLoading,
        error,
        addReservation,
        removeReservation,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
};

export const useReservations = () => useContext(ReservationContext);
