import { Post, Get } from "./HttpClient";

export function login(credentials) {
  return Post("/auth/login", credentials);
}

export function register(userData) {
  return Post("/auth/register", userData);
}

export function getMyProfile() {
  return Get("/user/me");
}
