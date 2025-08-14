import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState({ exists: null, name: null });

  useEffect(() => {
    verifyToken(); // Verifica o token ao carregar a aplicação
  }, []);

  async function verifyToken() {
    try {
      const res = await axios.post(
        "http://localhost:3005/User/Verification",
        null,
        { withCredentials: true }
      );
      console.log(res);
      setUser({
        exists: res.data.exists,
        name: res.data.name || null,
      });
    } catch (err) {
      setUser({ exists: false, name: null });

      console.log("Token inválido ou expirado", err);
      Cookies.remove("token");
    }
  }

  async function logout() {
    try {
      await axios.post("http://localhost:3005/User/Logout", null, {
        withCredentials: true,
      });
    } catch (err) {
      console.log("Erro ao deslogar:", err);
    }
    Cookies.remove("token");
    setUser({ exists: false, name: null });
  }

  return (
    <AuthContext.Provider value={{ user, logout, verifyToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
