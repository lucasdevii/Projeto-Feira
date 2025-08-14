import axios from "axios";
import { useState } from "react";

const Server = axios;

export default function Modal(props) {
  const [nameDevice, SetNameDevice] = useState("");
  const [idDevice, SetIdDevice] = useState("");
  const [locationDevice, SetLocalDevice] = useState("");

  const [nameP, SetNameP] = useState("");
  const [idP, SetIdP] = useState("");
  const [localP, SetLocalP] = useState("");

  function Exit() {
    props.SetModal(false);
  }

  async function SaveInformationDevice(name, id, local) {
    const idLimpo = id.replace(/\s+/g, "");
    const regexId = /^\d{6}$/; // Exatamente 6 números

    let nomeValido = true;
    let idValido = true;
    let localValido = true;

    SetNameP("");
    SetIdP("");
    SetLocalP("");

    // Validação do nome
    if (name.trim() === "" || name.trim().length > 10) {
      nomeValido = false;
      SetNameP(
        name.trim() === ""
          ? "Por favor, digite um nome válido."
          : "O nome deve ter no máximo 10 caracteres."
      );
    }

    // Validação do ID (sintaxe)
    if (!regexId.test(idLimpo)) {
      idValido = false;
      SetIdP("O ID deve conter exatamente 6 números");
    }

    // Verificação assíncrona do dispositivo
    if (idValido) {
      try {
        const res = await axios.get(
          `http://localhost:3005/Device/Exist/${idLimpo}`,
          {
            withCredentials: true,
          }
        );

        const { ExistsAll, ExistsInUser } = res.data;

        if (!ExistsAll) {
          idValido = false;
          SetIdP("Esse dispositivo não existe atualmente");
        } else if (ExistsInUser) {
          idValido = false;
          SetIdP("Esse dispositivo já está cadastrado");
        }
      } catch (err) {
        idValido = false;
        SetIdP("Erro ao verificar dispositivo");
        console.error("Erro na verificação de existência:", err);
      }
    }

    // Validação do local
    if (local.trim() === "" || local.trim().length > 10) {
      localValido = false;
      SetLocalP(
        local.trim() === ""
          ? "Por favor, informe o local do dispositivo."
          : "O local deve ter no máximo 10 caracteres."
      );
    }

    // Se tudo for válido, registrar
    if (nomeValido && idValido && localValido) {
      try {
        const deviceInfo = {
          name: name.trim(),
          code: parseInt(idLimpo),
          local: local.trim(),
        };

        const response = await axios.post(
          "http://localhost:3005/Device/Register",
          deviceInfo,
          { withCredentials: true }
        );

        console.log("Dispositivo registrado:", response.data);
        props.SetArrayDevice(response.data);
        props.SetModal(false);
        window.location.reload();
      } catch (error) {
        console.log(`Erro ao registrar dispositivo:`, error);
      }
    }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-zinc-900 p-4 rounded-md shadow-lg">
        <div>
          <div className="flex justify-between mb-4">
            <p className="font-semibold text-xl">Device Name</p>
            <div onClick={Exit} className="cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="red"
                className="size-7 rounded-full"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
          </div>

          <div className="mb-4">
            <p>*Device Name</p>
            <input
              onChange={(e) => SetNameDevice(e.target.value)}
              className="border-b bg-zinc-800 rounded-lg p-1 border-black w-72 cursor-text"
              type="text"
              value={nameDevice}
            />
            <p className="text-red-500 text-xs">{nameP}</p>
          </div>

          <div className="mb-4">
            <p>*Device ID</p>
            <input
              onChange={(e) => SetIdDevice(e.target.value)}
              className="border-b bg-zinc-800 rounded-lg p-1 border-black w-72 cursor-text"
              type="text"
              value={idDevice}
            />
            <p className="text-red-500 text-xs">{idP}</p>
          </div>

          <div className="mb-4">
            <p>*Device Location</p>
            <input
              onChange={(e) => SetLocalDevice(e.target.value)}
              className="border-b bg-zinc-800 rounded-lg p-1 border-black w-72 cursor-text"
              type="text"
              value={locationDevice}
            />
            <p className="text-red-500 text-xs">{localP}</p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() =>
                SaveInformationDevice(nameDevice, idDevice, locationDevice)
              }
              className="px-3 py-1 cursor-pointer hover:bg-white hover:text-green-500 bg-zinc-700 text-white rounded-full duration-300 border"
            >
              Add Device
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
