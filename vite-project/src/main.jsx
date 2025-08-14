import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppRouter from "./Routes/AppRouter"; // novo componente de rotas
import { AuthProvider } from "./contexts/AuthContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </StrictMode>
);
