import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "../api/api";
import type { AuthContextDataType } from "../types";

export const AuthContext = createContext<AuthContextDataType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthProvider must be used within provider");
  }
  return context;
};

function CheckIsLoginProvider({ children }: { children: ReactNode }) {
  const savedUser = localStorage.getItem("user");

  const initialUser = savedUser ? JSON.parse(savedUser) : null;

  const [user, setUser] = useState<any | null>(initialUser);
  const [isLogined, setIsLogined] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    api("me")
      .then(res => {
        if (!res.ok) throw new Error("Not authorized");
        return res.json();
      })
      .then(data => {
        setUser(data.result.user);
        setIsLogined(true);
      })
      .catch(() => {
        setUser(null);
        setIsLogined(false);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isLogined, setIsLogined, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export default CheckIsLoginProvider;