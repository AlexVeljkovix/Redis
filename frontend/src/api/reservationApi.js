import { Get, Post, Delete } from "./HttpClient";

export function getAllReservations() {
  return Get("/reservation");
}

export function getReservationById(id) {
  return Get(`/reservation/${id}`);
}

export function createReservation(reservation) {
  return Post("/reservation", reservation);
}

export function deleteReservation(id) {
  return Delete(`/reservation/${id}`);
}
