// src/context/AuthContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthContextType = {
  isLoggedIn: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Kiểm tra trạng thái đăng nhập khi app khởi động
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const value = await AsyncStorage.getItem("@isLoggedIn");
        if (value === "true") setIsLoggedIn(true);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  const login = async () => {
    try {
      await AsyncStorage.setItem("@isLoggedIn", "true");
      setIsLoggedIn(true);
    } catch (e) {
      console.log(e);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("@isLoggedIn");
      setIsLoggedIn(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
