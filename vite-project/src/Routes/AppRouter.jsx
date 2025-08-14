import App from "../pages/App.jsx";
import Dispositivos from "../pages/Dispositivos.jsx";
import Cadastro from "../pages/SignUp.jsx";
import PasswordHelp from "../pages/PasswordHelp.jsx";
import SignUp from "../pages/Login.jsx";
import PasswordChange from "../pages/PasswordChange.jsx";

import { PrivateRouteLogin, PrivateRouteHome } from "./PrivateRoutes.jsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/Home",
    element: <App />,
  },
  {
    path: "/Dispositivos",
    element: (
      <PrivateRouteLogin>
        <Dispositivos />
      </PrivateRouteLogin>
    ),
  },

  {
    path: "/Cadastro/Login",
    element: <SignUp />,
  },
  {
    path: "/Cadastro/Login/Help",
    element: <PasswordHelp />,
  },
  {
    path: "/Senha/Change",
    element: <PasswordChange />,
  },
  {
    path: "/Cadastro/SignUp",
    element: <Cadastro />,
  },
]);
export default function AppRouter() {
  return <RouterProvider router={router} />;
}
