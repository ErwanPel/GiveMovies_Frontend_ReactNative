import { ReactNode, useContext, createContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { promise } from "zod";

type AuthContextProps = {
  children: React.ReactNode;
};

type AuthContext = {
  userToken: null | string;
  setUserToken: (token: string | null) => void;
  userID: null | string;
  setUserID: (token: string | null) => void;
  setToken: (token: null | string, id: null | string) => Promise<void>;
};

export const AuthContext = createContext<AuthContext | null>(null);

export default function AuthProvider({ children }: AuthContextProps) {
  const [userToken, setUserToken] = useState<null | string>(null);
  const [userID, setUserID] = useState<null | string>(null);

  // Create function sentToken
  const setToken = async (token: null | string, id: null | string) => {
    if (token && id) {
      console.log(token, id);
      await AsyncStorage.setItem("userToken", token);
      await AsyncStorage.setItem("userID", id);
    } else {
      AsyncStorage.removeItem("userToken");
      AsyncStorage.removeItem("userID");
    }
    setUserToken(token);
    setUserID(id);
  };

  const valueAuth = {
    userToken,
    setUserToken,
    userID,
    setUserID,
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
