import { Get, Post, Put, Delete } from "./HttpClient";

export function getAllLocations() {
  return Get("/location");
}

export function getLocationById(id) {
  return Get(`/location/${id}`);
}

export function createLocation(location) {
  return Post("/location", location);
}

export function updateLocation(id, location) {
  return Put(`/location/${id}`, location);
}

export function deleteLocation(id) {
  return Delete(`/location/${id}`);
}
