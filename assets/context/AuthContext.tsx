import { ReactNode, useContext, createContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { promise } from "zod";

type AuthContextProps = {
  children: React.ReactNode;
};

type AuthContext = {
  userToken: null | string;
  setUserToken: (token: string | null) => void;
  setToken: (token: null | string) => Promise<void>;
};

export const AuthContext = createContext<AuthContext | null>(null);

export default function AuthProvider({ children }: AuthContextProps) {
  const [userToken, setUserToken] = useState<null | string>(null);

  // Create function sentToken
  const setToken = async (token: null | string) => {
    if (token) {
      await AsyncStorage.setItem("userToken", token);
    } else {
      AsyncStorage.removeItem("userToken");
    }
    setUserToken(token);
  };

  const valueAuth = {
    userToken,
    setUserToken,
    setToken,
  };
  return (
    <AuthContext.Provider value={valueAuth}>{children}</AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("Context Error ");
  }

  return context;
};
