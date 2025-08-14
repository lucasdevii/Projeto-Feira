import axios from "axios";
import { useEffect, useState } from "react";

export default function ListDevice(props) {
  const [indexIconDelete, SetIndexIconDelete] = useState(null);

  useEffect(() => {
    ListDevices();
  }, []);

  function ListDevices() {
    axios
      .get("http://localhost:3005/Device/List", { withCredentials: true })
      .then((res) => {
        // Garantir que seja array, senão retorna array vazio
        const lista = Array.isArray(res.data.devices) ? res.data.devices : [];
        props.SetArrayDevice(lista);
      })
      .catch((error) => console.log("error: ", error));
  }

  function DeleteIndex(deviceID) {
    if (!deviceID) {
      console.error("deviceID é inválido:", deviceID);
      return;
    }

    axios
      .delete(`http://localhost:3005/Device/Delete/${deviceID}`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.status);
        alert("Dispositivo excluído com sucesso!");
        ListDevices();
      })
      .catch((error) => {
        console.log("erro:", error);
      });
  }

  // Para evitar erro no map, criar uma variável devices garantindo ser array
  const devices = Array.isArray(props.arrayDevice) ? props.arrayDevice : [];

  return (
    <div>
      {devices.length === 0 ? (
        <div className="h-80 w-full flex flex-col justify-center items-center">
          <img
            className="w-48 invert"
            src="../../public/Searching.png"
            alt=""
          />
          <h2 className="text-lg font-semibold">
            Nenhum serviço encontrado...
          </h2>
        </div>
      ) : (
        devices.map((device) => (
          <div
            key={device.device.code}
            className="flex items-center pl-6 h-8 w-full justify-between border-b border-black"
          >
            <div className="items-center flex">
              <div className="w-14 flex justify-center">
                {device.device.detection === "NORMAL" ? (
                  <div className="flex flex-col w-full">
                    <div className="w-7 h-2 rounded-xl bg-green-500"></div>
                    <p className="text-xs">Seguro</p>
                  </div>
                ) : (
                  <div className="flex flex-col w-14">
                    <div className="w-7 h-2 rounded-xl bg-red-500"></div>
                    <p className="text-xs">Risco</p>
                  </div>
                )}
              </div>
              <div className="flex">
                <div className="w-32">
                  <div className="w-14">
                    <p className="text-sm font-medium">{device.customName}</p>
                  </div>
                </div>
                <div className="w-32 ml-1">
                  <div className="w-14">
                    <p className="text-sm">{device.customLocal}</p>
                  </div>
                </div>
                <div className="w-14">
                  <p className="text-sm">{device.device.code}</p>
                </div>
              </div>
            </div>
            <div className="flex  items-center">
              {indexIconDelete === device.device.code ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => DeleteIndex(device.device.code)}
                    className="py-1 text-sm px-2 bg-red-500 rounded-md hover:scale-105 transition-transform"
                  >
                    Excluir
                  </button>
                  <button
                    onClick={() => SetIndexIconDelete(null)}
                    className="py-1 text-sm px-2 bg-zinc-300 rounded-md hover:scale-105 transition-transform"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <svg
                  onClick={() => SetIndexIconDelete(device.device.code)}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6 mx-1 cursor-pointer transition-transform duration-300 hover:scale-110"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 
                    4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 
                    7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375
                    c-.621 0-1.125.504-1.125 1.125v1.5c0 
                    .621.504 1.125 1.125 1.125Z"
                  />
                </svg>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
