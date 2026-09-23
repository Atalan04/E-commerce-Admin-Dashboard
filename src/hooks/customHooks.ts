import { useContext } from "react";
import type { AuthContextValue } from "../types/authTypes";
import { AuthContext } from "../contexts/AuthContextProvider";

const useAuth = ():AuthContextValue => {
    const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth باید داخل AuthContextProvider استفاده شود");
  }
  return context;
}

export {useAuth}