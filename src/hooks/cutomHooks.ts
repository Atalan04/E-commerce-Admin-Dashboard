import { useContext,useState,useEffect } from "react";
import { AuthContext } from "../contexts/AuthContextProvider";

const useAuth = ()=> {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

const useDebounce= <T>(value:T,delay:number=500): T => {
  const [debounceValue,setDebounceValue] =useState<T>(value)


useEffect(()=> {
  const timer=setTimeout(()=> {
    setDebounceValue(value)
  },delay)
  return ()=> {
    clearTimeout(timer)
  }
},[value,delay])
return debounceValue
}
export {useAuth,useDebounce} 