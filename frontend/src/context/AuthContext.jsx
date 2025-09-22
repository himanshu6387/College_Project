
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const retriveToken = localStorage.getItem("userToken");
    const retriveUser = localStorage.getItem("user");
    if (retriveToken) setToken(retriveToken);
    if (retriveUser) setUser(JSON.parse(retriveUser));
  }, []);

  const login = (newToken, userData) => {
    localStorage.setItem("userToken", newToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};




// Previous

// import { createContext, useEffect, useState } from "react";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(null);

//   useEffect(() => {
//     const retriveToken = localStorage.getItem("userToken");
//     if (retriveToken) {
//       setToken(retriveToken);
//     }
//   }, []);

//   const login = (newToken) => {
//     localStorage.setItem("userToken", newToken);
//     setToken(newToken);
//   };

//   const logout = () => {
//     localStorage.removeItem("userToken");
//     setToken(null);
//   };

//   return (
//     <AuthContext.Provider value={{ token, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
