import type { ReactNode } from "react";


//LoginTypes
interface LoginTypes {
  email: string;
  password: string;
}

//Authresponse
interface Authresponse {
  token: string;
  user: User;
}

//Type of User
interface User {
  id: string;
  name?: string;
  email: string;
  role: string;
}
//context provides for others
 interface AuthContextProviderProps {
  children: ReactNode; 
}
interface LoginResponse {
  token: string;
  user: User;
}
interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (data: LoginResponse) => void;
  logout: () => void;
  isLoading: boolean,
}

export type { LoginTypes, Authresponse, User, AuthContextValue ,LoginResponse ,AuthContextProviderProps};
