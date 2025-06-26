import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext()

export const AuthProvider=({children})=>{

    const [token,setToken] = useState()

    useEffect(()=>{
      const retriveToken = localStorage.getItem('adminToken')
      if(retriveToken){
        setToken(retriveToken)
      }
    },[token])

    const logout=()=>{
        localStorage.removeItem('adminToken')
        setToken(null)
    }

    return(
        <AuthContext.Provider value={{token,logout}}>
            {children}
        </AuthContext.Provider>
    )
}