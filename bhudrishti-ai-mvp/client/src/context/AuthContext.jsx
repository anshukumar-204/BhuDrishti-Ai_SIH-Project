import { createContext, useContext, useEffect, useState } from "react";
import {
  login as loginRequest,
  register as registerRequest,
  getCurrentUser,
} from "../api/authApi";

const AuthContext = createContext(null);

function readUser() {
  try {
    return JSON.parse(localStorage.getItem("bhudrishti_user") || "null");
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser);
  const [isLoading, setIsLoading] = useState(() =>
    Boolean(localStorage.getItem("bhudrishti_token")),
  );

  const saveSession = ({ token, user: nextUser }) => {
    localStorage.setItem("bhudrishti_token", token);
    localStorage.setItem("bhudrishti_user", JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const login = async (credentials) => {
    const { data } = await loginRequest(credentials);
    saveSession(data.data);
  };

  const register = async (credentials) => {
    const { data } = await registerRequest(credentials);
    saveSession(data.data);
  };

  const logout = () => {
    localStorage.removeItem("bhudrishti_token");
    localStorage.removeItem("bhudrishti_user");
    setUser(null);
  };

  useEffect(() => {
    if (!localStorage.getItem("bhudrishti_token")) {
      setIsLoading(false);
      return;
    }
    getCurrentUser()
      .then(({ data }) => {
        const nextUser = data.data?.user;
        if (nextUser) {
          localStorage.setItem("bhudrishti_user", JSON.stringify(nextUser));
          setUser(nextUser);
        }
      })
      .catch(logout)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
