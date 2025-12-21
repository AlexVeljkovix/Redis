import { Get, Post, Put, Delete } from "./HttpClient";

export function getAllUsers() {
  return Get("/user");
}

export function getUserReservationIds(id) {
  return Get(`/user/${id}/reservations`);
}

export function getUserById(id) {
  return Get(`/user/${id}`);
}

export function createUser(user) {
  return Post("/user", user);
}

export function updateUser(id, user) {
  return Put(`/user/${id}`, user);
}

export function deleteUser(id) {
  return Delete(`/user/${id}`);
}
