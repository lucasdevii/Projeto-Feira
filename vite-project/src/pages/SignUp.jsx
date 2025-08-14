import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function Cadastro() {
  const navigate = useNavigate("");
  const [paragrafInfo, SetParagrafInfo] = useState("");
  const [nameUser, SetNameUser] = useState("");
  const [emailUser, SetEmailUser] = useState("");
  const [passwordUser, SetPasswordUser] = useState("");
  const [passwordState, SetPasswordState] = useState(true);
  const [nameParagraf, SetNameParagraf] = useState("");
  const [emailParagraf, SetEmailParagraf] = useState("");
  const [passwordParagraf, SetPasswordparagraf] = useState();
  const [openCode, SetOpenCode] = useState(false);
  const [objInfos, SetObjInfos] = useState({});
  const [codeVerify, SetCodeVerify] = useState();
  const [ChangeButton, SetChangeButton] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      SetChangeButton(true); // libera o botão após 1 minuto
    }, 60000); // 60000ms = 1 minuto

    return () => clearTimeout(timer);
  }, []);

  async function CodeTest(code) {
    const codeNumber = parseInt(code);
    SetParagrafInfo("");
    try {
      const res = await axios.post(
        "http://localhost:3005/User/Cadaster",
        { codeNumber },
        { withCredentials: true }
      );

      if (res.data.response === true) {
        alert("Email cadastrado com sucesso!");
        navigate("/Home", { replace: true });
      } else {
        console.log("Erro na resposta de cadastro");
      }
    } catch (error) {
      console.error("Erro no cadastro:", error);
    }
  }
  async function PushInfos(name, email, password) {
    const nameTrimmed = name.trim();
    const nameConfirmation = nameTrimmed.length > 0;
    const passwordMin = 6;
    const passwordMax = 20;
    const passwordConfirmation =
      password.length >= passwordMin && password.length <= passwordMax;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailConfirmation = emailRegex.test(email);

    // Limpa erros antigos
    SetNameParagraf("");
    SetEmailParagraf("");
    SetPasswordparagraf("");
    SetParagrafInfo("");

    // Validação local
    if (!nameConfirmation) {
      SetNameParagraf(
        "Nome inválido: não pode estar vazio ou conter apenas espaços."
      );
    }
    if (!emailConfirmation) {
      SetEmailParagraf("Email inválido.");
    }
    if (!passwordConfirmation) {
      SetPasswordparagraf(
        `Senha inválida: precisa ter entre ${passwordMin} e ${passwordMax} caracteres.`
      );
    }

    // Se alguma das validações falhar, interrompe
    if (!nameConfirmation || !passwordConfirmation || !emailConfirmation)
      return;

    const objUserInfo = { name: nameTrimmed, email, password };
    console.log(objUserInfo);
    try {
      // Verifica se o email já está cadastrado
      const resExist = await axios.post(
        "http://localhost:3005/User/Cadaster/Exists",
        { email }
      );

      if (resExist.data.exists) {
        SetEmailParagraf("Esse email já está cadastrado.");
        return;
      }
      // Envia o e-mail de confirmação
      SetParagrafInfo("Enviando email de confirmação...");

      const resEmail = await axios.post(
        "http://localhost:3005/User/Cadaster/Email",
        objUserInfo,
        { withCredentials: true }
      );

      if (resEmail.data.response === true) {
        // Só cadastra após o usuário confirmar via link
        SetParagrafInfo(
          "E-mail de confirmação enviado! Verifique sua caixa de entrada."
        );
        SetOpenCode(true);
      } else {
        alert("Erro ao enviar e-mail de confirmação.");
      }
    } catch (error) {
      SetParagrafInfo("Erro ao cadastrar");
      console.error("Erro ao se comunicar com o servidor:", error);
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 to-stone-900 flex items-center justify-center px-4">
      <div className="w-full rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-green-400 text-center mb-6">
          Create Account
        </h1>

        {/* Botões sociais */}
        <div className="flex justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="50"
            height="50"
            viewBox="0 0 48 48"
            className="mx-6"
          >
            <path
              fill="#fbc02d"
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            ></path>
            <path
              fill="#e53935"
              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
            ></path>
            <path
              fill="#4caf50"
              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
            ></path>
            <path
              fill="#1565c0"
              d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
            ></path>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="50"
            height="50"
            viewBox="0 0 48 48"
            className="mx-6"
          >
            <path
              fill="#3F51B5"
              d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z"
            ></path>
            <path
              fill="#FFF"
              d="M34.368,25H31v13h-5V25h-3v-4h3v-2.41c0.002-3.508,1.459-5.59,5.592-5.59H35v4h-2.287C31.104,17,31,17.6,31,18.723V21h4L34.368,25z"
            ></path>
          </svg>
        </div>

        <div className="flex items-center mb-6">
          <hr className="flex-grow border-slate-700" />
          <span className="mx-3 text-white text-sm">OR</span>
          <hr className="flex-grow border-slate-700" />
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-white font-medium mb-1">Nome</label>
            <input
              type="text"
              className="w-full h-10 px-3 rounded-lg bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
              onChange={(e) => SetNameUser(e.target.value)}
            />
            <p className="text-red-500">{nameParagraf}</p>
          </div>

          <div>
            <label className="block text-white font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full h-10 px-3 rounded-lg bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
              onChange={(e) => SetEmailUser(e.target.value)}
            />
            <p className="text-red-500">{emailParagraf}</p>
          </div>

          <div>
            <div>
              <label className="block text-white font-medium mb-1">
                Password
              </label>
            </div>
            <div className="flex items-center">
              <input
                type={passwordState ? "password" : "text"}
                className="focus:outline-none focus:ring-2 focus:ring-green-400 w-full h-10 px-3 rounded-l-lg bg-slate-800 text-white"
                onChange={(e) => SetPasswordUser(e.target.value)}
              />
              <button
                className="bg-slate-800 px-3 rounded-r-lg "
                onClick={() => SetPasswordState((s) => !s)} // Apenas aqui
              >
                {passwordState ? (
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
            <p className="text-red-500">{passwordParagraf}</p>
          </div>
          {!openCode ? (
            <>
              <button
                type="submit"
                className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition-transform hover:scale-105"
                onClick={() => {
                  PushInfos(nameUser, emailUser, passwordUser);
                  SetObjInfos({
                    name: nameUser,
                    email: emailUser,
                    password: passwordUser,
                  });
                }}
              >
                Cadastrar
              </button>
              <div className="flex justify-between">
                <Link
                  to={"/Cadastro/Login"}
                  className="text-white  font underline cursor-pointer"
                >
                  Já tenho uma conta
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="h-full flex">
                <input
                  type="number"
                  className="h-10 p-3 w-96 rounded-sm text-black"
                  placeholder="Digite o codigo aqui"
                  onChange={(e) => {
                    SetCodeVerify(e.target.value);
                  }}
                />
              </div>
              <div className="h-full flex justify-between">
                <button
                  type="submit"
                  className="mt-4 p-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition-transform hover:scale-105"
                  onClick={() => {
                    CodeTest(codeVerify);
                  }}
                >
                  Validar Codigo
                </button>
                <button
                  type="submit"
                  className="mt-4 p-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition-transform hover:scale-105"
                  onClick={() => {
                    if (ChangeButton) {
                      PushInfos(objInfos);
                      SetChangeButton(false);
                    } else {
                      SetParagrafInfo(
                        "Espere 1 minuto para poder reenviar seu codigo"
                      );
                    }
                  }}
                >
                  Reenviar código
                </button>
              </div>
              <div className="flex justify-between">
                <Link
                  to={"/Cadastro/Login"}
                  className="text-white underline cursor-pointer"
                >
                  Já tenho uma conta
                </Link>
              </div>
            </>
          )}
          <p className="text-white ">{paragrafInfo}</p>
        </div>
      </div>
    </div>
  );
}
export default Cadastro;
