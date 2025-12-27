import { useState, useContext, createContext, useEffect } from "react";

import {
  getAllReservations,
  createReservation,
  deleteReservation,
} from "../api/reservationApi";

const ReservationContext = createContext();

export const ReservationProvider = ({ children }) => {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await getAllReservations();
        setReservations(data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReservations();
  }, []);

  const getReservationById = (id) => {
    return reservations.find((r) => r.id === id);
  };

  const addReservation = async (reservation) => {
    const res = await createReservation(reservation);
    setReservations((prevReservations) => [...prevReservations, res]);
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
