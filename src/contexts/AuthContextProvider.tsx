import { createContext, useState ,useEffect} from "react";
import type { AuthContextValue, User,LoginResponse,AuthContextProviderProps  } from "../types/authTypes";


 export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function AuthContextProvider({children}:AuthContextProviderProps) {
  const [user,setUser]=useState<User | null>(null)
  const [token,setToken]=useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const storedToken = localStorage.getItem("accessToken");
  if (storedToken) {
    setToken(storedToken);
  }

  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser) as User;
      setUser(parsedUser);
    } catch (error) {
      console.error("فرمت user توی localStorage خرابه:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      setUser(null);
      setToken(null);
    }
  }

  setIsLoading(false);
}, []);



  const login=(data:LoginResponse):void=>{
    setUser(data.user)
    setToken(data.token)
    localStorage.setItem("user",JSON.stringify(data.user))
    localStorage.setItem("accessToken",data.token)
  }

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
  };

  const value: AuthContextValue = {
  user,
  isAuthenticated: !!user && !!token,
  token,
  login,
  logout,
  isLoading,
};

  return  <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

}

export default AuthContextProvider;
