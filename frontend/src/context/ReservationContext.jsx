import { useState, useContext, createContext, useEffect } from "react";
import { useAuth } from "./AuthContext"; // DODAJ OVO
import {
  getAllReservations,
  createReservation,
  deleteReservation,
} from "../api/reservationApi";

const ReservationContext = createContext();

export const ReservationProvider = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth(); // DODAJ OVO
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      // SAMO ako je admin pokušaj da učita sve rezervacije
      if (!isAdmin()) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await getAllReservations();
        setReservations(data);
      } catch (err) {
        console.error("Failed to fetch reservations:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    // ČEKAJ da se auth učita
    if (isAuthenticated()) {
      fetchReservations();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, isAdmin]);

  const getReservationById = (id) => {
    return reservations.find((r) => r.id === id);
  };

  const addReservation = async (reservation) => {
    const res = await createReservation(reservation);
    setReservations((prevReservations) => [...prevReservations, res]);
    return res;
  };

  const removeReservation = async (reservationId) => {
    await deleteReservation(reservationId);
    setReservations((prevReservations) =>
      prevReservations.filter((r) => r.id !== reservationId)
    );
  };

  return (
    <ReservationContext.Provider
      value={{
        reservations,
        isLoading,
        error,
        getReservationById,
        addReservation,
        removeReservation,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
};

export const useReservations = () => useContext(ReservationContext);
