import { useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:3005", {
  withCredentials: true,
});

function SocketListener({ SetArrayDevice }) {
  useEffect(() => {
    const handleUpdate = ({ status, code }) => {
      console.log("Atualização recebida!", status, code);

      // Atualiza os dispositivos após receber a atualização
      axios
        .get("http://localhost:3005/Device/List", { withCredentials: true })
        .then((res) => {
          const lista = Array.isArray(res.data.devices) ? res.data.devices : [];
          SetArrayDevice(lista);
        });
    };

    socket.on("stateUpdate", handleUpdate);
    return () => socket.off("stateUpdate", handleUpdate);
  }, [SetArrayDevice]);

  return null;
}

export default SocketListener;
