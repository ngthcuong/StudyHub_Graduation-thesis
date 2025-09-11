// src/context/AuthContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type User = {
  _id: string;
  fullName: string;
  email: string;
  role: string;
};

type AuthData = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

type AuthContextType = {
  authData: AuthData | null;
  isLoggedIn: boolean;
  login: (data: AuthData) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [loading, setLoading] = useState(true);

  // Lấy thông tin từ AsyncStorage khi app khởi động
  useEffect(() => {
    const loadStorage = async () => {
      try {
        const storedAuth = await AsyncStorage.getItem("@auth");
        if (storedAuth) {
          setAuthData(JSON.parse(storedAuth));
        }
      } catch (e) {
        console.log("Load storage error:", e);
      } finally {
        setLoading(false);
      }
    };
    loadStorage();
  }, []);

  const login = async (data: AuthData) => {
    await AsyncStorage.setItem("@auth", JSON.stringify(data));
    setAuthData(data);
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("@auth"); // Xóa dữ liệu lưu token/user
      setAuthData(null); // Xóa state authData
    } catch (e) {
      console.log("Logout error:", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authData,
        isLoggedIn: !!authData,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
