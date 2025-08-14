import { Link, useNavigate } from "react-router-dom";
import PasswordHelp from "./PasswordHelp.jsx";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function SignUp() {
  const { verifyToken } = useAuth();
  const [emailUser, setEmailUser] = useState("");
  const [passwordUser, setPasswordUser] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [paragrafInfo, SetParagrafInfo] = useState("");
  const navigate = useNavigate();

  async function SearchUser() {
    const email = emailUser.trim();
    const password = passwordUser.trim();
    if (email == "") {
      SetParagrafInfo("Coloque um conteúdo valido no email");
      return;
    }
    if (password.length < 8 || password.length > 20) {
      SetParagrafInfo("A senha deve ter entre 8 e 20 caracteres");
      return;
    }
    if (!/\S/.test(password)) {
      SetParagrafInfo("A senha não pode conter apenas espaços");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3005/User/Login",
        { email, password },
        { withCredentials: true }
      );

      await verifyToken();

      SetParagrafInfo("Login realizado com sucesso!");
      console.log("Enviando para a pagina principal...");
      navigate("/Home");
    } catch (err) {
      if (err.response?.status === 404 || err.response?.status === 401) {
        SetParagrafInfo("Usuário não encontrado ou senha incorreta");
      } else {
        console.error(err);
        SetParagrafInfo("Erro ao realizar login. Tente novamente.");
      }
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 to-stone-900 flex items-center justify-center px-4">
      <div className="w-full rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-green-400 text-center mb-6">
          Login
        </h1>
        {/* Botões sociais e OR… (mantém seu JSX) */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-white font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full h-10 px-3 rounded-lg bg-slate-800 text-white"
              onChange={(e) => setEmailUser(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-white font-medium mb-1">
              Password
            </label>
            <div className="flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                className="focus:outline-none focus:ring-2 focus:ring-green-400 w-full h-10 px-3 rounded-l-lg bg-slate-800 text-white"
                onChange={(e) => setPasswordUser(e.target.value)}
              />
              <button
                className="bg-slate-800 px-3 rounded-r-lg "
                onClick={() => setShowPassword((s) => !s)} // Apenas aqui
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-10 h-10 px-2 rounded-r-lg cursor-pointer invert"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    fill="#000"
                    className="size-10 h-10 px-2 rounded-r-lg cursor-pointer invert"
                  >
                    <path d="M507.418,241.382C503.467,235.708,409.003,102.4,256,102.4S8.533,235.708,4.582,241.382c-6.11,8.789-6.11,20.446,0,29.235C8.533,276.292,102.997,409.6,256,409.6s247.467-133.308,251.418-138.982C513.528,261.828,513.528,250.172,507.418,241.382z M256,384C114.62,384,25.6,256,25.6,256S114.62,128,256,128s230.4,128,230.4,128S397.38,384,256,384z" />
                    <path d="M256,153.6c-56.55,0-102.4,45.841-102.4,102.4S199.441,358.4,256,358.4c56.559,0,102.4-45.841,102.4-102.4S312.55,153.6,256,153.6z M256,332.8c-42.351,0-76.8-34.449-76.8-76.8s34.449-76.8,76.8-76.8c42.351,0,76.8,34.449,76.8,76.8C332.8,298.351,298.351,332.8,256,332.8z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <button
            className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg"
            onClick={SearchUser}
          >
            Entrar
          </button>
          <div className="flex justify-between">
            <Link to="/Cadastro/Login/Help" className="text-white underline">
              Esqueci minha senha
            </Link>
            <Link to="/Cadastro/SignUp" className="text-white underline">
              Não tenho conta
            </Link>
          </div>
          <p className="text-white">{paragrafInfo}</p>
        </div>
      </div>
    </div>
  );
}
