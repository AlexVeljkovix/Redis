import { createContext, useState, useEffect, useContext } from "react";
import { login, register, getMyProfile } from "../api/authApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        try {
          const userData = await getMyProfile();
          setUser(userData);
          setToken(savedToken);
        } catch (error) {
          console.error("Token invalid:", error);
          localStorage.removeItem("token");
          setToken(null);
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, token, setToken, isLoading, setIsLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
