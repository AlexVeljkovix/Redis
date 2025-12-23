import { Get, Post, Put, Delete } from "./HttpClient";

export function getAllEvents() {
  return Get("/event");
}

export function getEventReservationIds(id) {
  return Get(`/event/${id}/reservations`);
}

export function getEventReservationNumber(id) {
  return Get(`/event/${id}/reservationnumber`);
}

export function getEventById(id) {
  return Get(`/event/${id}`);
}

export function createEvent(event) {
  return Post("/event", event);
}

export function updateEvent(id, event) {
  return Put(`/event/${id}`, event);
}

export function deleteEvent(id) {
  return Delete(`/event/${id}`);
}
