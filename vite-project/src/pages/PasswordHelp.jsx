import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function PasswordHelp() {
  const [valueInputEmail, SetValueInputEmail] = useState("");
  const [codeValue, SetCodeValue] = useState("");
  const [newPassword, SetNewPassword] = useState("");
  const [paragraf, SetParagraf] = useState("");
  const [InputChange, SetInputChange] = useState(false);
  const [codeValidate, SetCodeValidate] = useState(false);
  const [confirmPassword, SetNewPasswordConfirm] = useState("");

  const navigate = useNavigate();

  function PasswordChange() {
    if (confirmPassword !== newPassword) {
      return SetParagraf("A confirmação de senha esta incorreta");
    }
    if (newPassword.trim() == "") {
      return SetParagraf("A senha confirmada é invalida");
    }
    if (newPassword.trim().length < 8 || newPassword.trim().length > 20) {
      return SetParagraf("A senha confirmada deve ter entre 8 a 20 caracteres");
    }
    axios
      .post("http://localhost:3005/User/Email/Help/Changepass", {
        confirmPassword,
        valueInputEmail,
      })
      .then((res) => {
        console.log(res.data.message);
        if (res.data.response) {
          alert("Senha alterada com sucesso!");
          navigate("/Cadastro/Login");
        } else {
          SetParagraf("Erro na comunicação com servidor");
        }
      })
      .catch((err) => {
        console.log("Erro na mudança de senha: ", err);
      });
  }
  function CodeTest(codePassed) {
    const code = parseInt(codePassed);
    if (!/^\d{6}$/.test(code)) {
      if (isNaN(code)) {
        return SetParagraf("O código deve conter apenas números");
      }
      return SetParagraf("O código deve ter exatamente 6 dígitos");
    }

    axios
      .post("http://localhost:3005/User/Email/Help/CodeVerify", { code })
      .then((res) => {
        if (res.data.valid) {
          SetParagraf("Código Validado com sucesso!");
          SetCodeValidate(true);
          SetParagraf("");
        } else {
          SetParagraf("Código inválido");
        }
      });
  }

  function Verification() {
    if (valueInputEmail.trim() === "") {
      return SetParagraf("Digite um email válido");
    }

    axios
      .post("http://localhost:3005/User/Cadaster/Exists", {
        email: valueInputEmail,
      })
      .then((res) => {
        if (res.data.exists) {
          SetParagraf("Validação enviada!");
          axios.post("http://localhost:3005/User/Email/Help", {
            email: valueInputEmail,
          });
          SetInputChange(true);
        } else {
          SetParagraf("O email informado ainda não está cadastrado");
          SetInputChange(false);
        }
      })
      .catch((error) => console.log("error: ", error));
  }

  function ChangePassword() {
    if (newPassword.length < 6) {
      return SetParagraf("A nova senha deve ter pelo menos 6 caracteres");
    }

    axios
      .post("http://localhost:3005/User/Reset/Password", {
        email: valueInputEmail,
        password: newPassword,
      })
      .then(() => {
        SetParagraf("Senha alterada com sucesso!");
      })
      .catch(() => SetParagraf("Erro ao alterar a senha"));
  }

  return (
    <>
      {codeValidate ? (
        <div className="min-h-screen w-full bg-gradient-to-br from-zinc-950 to-stone-900 flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-slate-900 rounded-xl shadow-lg p-6">
            <h2 className="text-green-500 text-2xl font-bold mb-4">
              Nova Senha
            </h2>
            <input
              type="password"
              placeholder="Digite sua nova senha"
              className="w-full h-10 px-3 mb-3 rounded-lg bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
              onChange={(e) => SetNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirmar senha"
              className="w-full h-10 px-3 mb-3 rounded-lg bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
              onChange={(e) => SetNewPasswordConfirm(e.target.value)}
            />
            <p className="text-red-500 mb-2">{paragraf}</p>
            <button
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition-transform hover:scale-105"
              onClick={PasswordChange}
            >
              Alterar Senha
            </button>
          </div>
        </div>
      ) : (
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 to-stone-900 flex items-center justify-center px-4">
          <div className="w-full max-w-md rounded-xl shadow-xl shadow-zinc-950 p-6">
            <h1 className="text-3xl font-bold text-green-400 text-center mb-6">
              Esqueci minha senha
            </h1>
            <p className="text-white mb-4">
              Ao clicar em enviar, te mandaremos as informações no email
              digitado
            </p>
            <h2 className="text-white font-semibold mb-2">Digite seu Email:</h2>
            <input
              className="w-full h-10 px-3 mb-3 rounded-lg bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
              type="text"
              onChange={(e) => SetValueInputEmail(e.target.value)}
            />
            <p className="text-red-500">{paragraf}</p>
            {!InputChange ? (
              <div className="flex justify-between">
                <button
                  className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-4 rounded-lg transition-transform hover:scale-105"
                  onClick={Verification}
                >
                  Enviar Email
                </button>
                <Link
                  to={"/Cadastro/Login"}
                  className="mt-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-1 px-4 rounded-lg transition-transform hover:scale-105"
                >
                  Cancelar
                </Link>
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  className="h-10 p-3 w-full rounded-lg bg-slate-800 text-white mb-3"
                  placeholder="Digite o código aqui"
                  onChange={(e) => SetCodeValue(e.target.value)}
                />
                <div className="flex justify-between">
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-4 rounded-lg transition-transform hover:scale-105"
                    onClick={() => CodeTest(codeValue)}
                  >
                    Validar Código
                  </button>
                  <Link
                    to={"/Cadastro/Login"}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-1 px-4 rounded-lg transition-transform hover:scale-105"
                  >
                    Reenviar
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default PasswordHelp;
