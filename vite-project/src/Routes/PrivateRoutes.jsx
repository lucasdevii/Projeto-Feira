import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function PrivateRouteLogin({ children }) {
  const { user } = useAuth();

  if (user.exists === null) return <p>Verificando login...</p>;

  return user.exists ? children : <Navigate to="/Cadastro/SignUp" />;
}
export function PrivateRouteHome({ children }) {
  const { user } = useAuth();
  return user.exists ? children : <Navigate to="/Home" />;
}
