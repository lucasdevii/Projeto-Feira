import "../styles/App.css";
import HeaderPageFunction from "../components/Header";
import FooterPagePart from "../components/Footer";
import Modal from "../components/ModalTEST";
import ListDeviceTEST from "../components/ListDeviceTEST";
import SocketListener from "../components/Services/SocketListenerStatus";
import { useState } from "react";

function Dispositivos() {
  const [modalModifier, SetModalModifier] = useState(false);
  const [arrayDevice, SetArrayDevice] = useState([]);

  return (
    <div className="w-full h-screen flex flex-col justify-between">
      <div>
        {modalModifier && (
          <Modal
            arrayDevice={arrayDevice}
            SetArrayDevice={SetArrayDevice}
            SetModal={SetModalModifier}
          />
        )}
        <SocketListener SetArrayDevice={SetArrayDevice} />
        <HeaderPageFunction />

        <div className="mt-14 mx-24 flex justify-between">
          <h1 className="text-xl font-semibold">Dispositivos</h1>
          <button
            onClick={() => SetModalModifier(!modalModifier)}
            className="px-2 py-1 bg-green-500 font-semibold rounded-full hover:bg-white hover:text-green-600 duration-200 hover:scale-105"
          >
            Adicionar serviço
          </button>
        </div>

        <div className="h-96 mx-24 mt-3 rounded-lg border border-black">
          <div className="flex h-10 border-b items-center border-black justify-between">
            <div className="items-center flex">
              <div className="w-20 flex justify-center">
                <p className="text-sm font-medium">Status</p>
              </div>
              <div className="flex ">
                <div>
                  <div className="mr-24">
                    <p className="text-sm font-medium">Name</p>
                  </div>
                </div>
                <div className="mr-24">
                  <p className="text-sm font-medium">local</p>
                </div>
                <div className="">
                  <p className="text-sm font-medium">id</p>
                </div>
              </div>
            </div>
            <div></div>
          </div>

          <div className="h-80 rounded-b-lg flex">
            <div className="h-full w-full">
              <ListDeviceTEST
                arrayDevice={arrayDevice}
                SetArrayDevice={SetArrayDevice}
              />
            </div>
          </div>
        </div>
      </div>

      <footer className="py-8">
        <FooterPagePart />
      </footer>
    </div>
  );
}

export default Dispositivos;
