import { createContext } from "react";
import { AuthContextType } from "../types/auth";

const defaultAuthContext: AuthContextType = {
  user: null,
  isLoading: false,
  error: "",
  login: async () => {
    throw new Error("login no implementado - utiliza AuthProvider");
  },
  logout: async () => {
  },
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);
export default AuthContext;
