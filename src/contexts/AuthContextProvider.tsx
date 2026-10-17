import { useState } from "react";
import type {
  AuthContextValue,
  User,
  LoginResponse,
  AuthContextProviderProps,
} from "../types/authTypes";
import { AuthContext } from "./AuthContext";


function getInitialAuth(): { user: User | null; token: string | null } {
  try {
    const storedToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      const parsedUser = JSON.parse(storedUser) as User;
      return { user: parsedUser, token: storedToken };
    }
  } catch (error) {
    console.error("User Format is Invalid: ", error);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
  }

  return { user: null, token: null };
}

function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [authState, setAuthState] = useState(getInitialAuth);

  const login = (data: LoginResponse): void => {
    setAuthState({ user: data.user, token: data.token });
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("accessToken", data.token);
  };

  const logout = () => {
    setAuthState({ user: null, token: null });
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
  };

  const value: AuthContextValue = {
    user: authState.user,
    isAuthenticated: !!authState.user && !!authState.token,
    token: authState.token,
    login,
    logout,
    isLoading: false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
