import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function HeaderPageFunction() {
  // 1) Puxa o contexto
  const { user, logout } = useAuth();
  // 2) Desestrutura o estado de autenticação
  const { exists, name } = user;

  return (
    <>
      <div className="h-12 px-6 bg-zinc-900 flex  justify-between top-0 left-0 right-0 fixed border-b border-gray-600 shadow-sm ">
        <Link to="/Home" className="h-12 flex items-center">
          <img className="w-9" src="../../public/LogoImage.png" alt="" />
        </Link>
        <div className="flex justify-between h-12 items-center">
          <Link to="/Home" className="p-1 mx-1">
            Home
          </Link>
          {exists ? (
            <Link to="/Dispositivos" className="p-1 mx-1">
              Devices
            </Link>
          ) : (
            <span
              className="p-1 mx-1 cursor-pointer text-slate-600"
              onClick={() => {
                alert("Você precisa estar logado para ver seus dispositivos");
              }}
            >
              Devices
            </span>
          )}

          {exists ? (
            <div className="flex items-center pl-1 border-l border-l-zinc-400 ">
              <h2 className="mx-1">{`${name}`}</h2>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-7 cursor-pointer"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
              <button
                onClick={() => {
                  logout();
                  Navigate("/Cadastro/Login");
                }}
                className="p-1 mx-1 text-sm text-red-500 hover:underline"
              >
                Sair
              </button>
            </div>
          ) : (
            <div>
              <Link to="/Cadastro/Login" className="p-1 mx-1">
                Login
              </Link>
              <Link to="/Cadastro/SignUp" className="p-1 mx-1">
                Sign-up
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
