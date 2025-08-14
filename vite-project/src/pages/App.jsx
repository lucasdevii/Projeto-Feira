import "../styles/App.css";

import { Link } from "react-router-dom";

import FooterPagePart from "../components/Footer.jsx";
import HeaderPageFunciton from "../components/Header.jsx";

function App() {
  return (
    <div className="w-full h-screen">
      <HeaderPageFunciton />
      <div className="mt-14 ">
        <div className="h-64 mx-28">
          <div
            className=" mt-14 bg-no-repeat bg-cover h-full w-full rounded-md flex items-end "
            style={{ backgroundImage: "url('/imageDevice.jpg')" }}
          >
            <div className="h-full w-full flex items-end bg-gradient-to-t from-zinc-900 to-transparent rounded-md">
              <div className="mx-5 my-2 ">
                <h1 className=" font-semibold text-white text-xl">
                  Tecnologia Avançada de Detecção de Gáses tóxicos e inflamáveis
                </h1>
                <p className="text-xs text-white mb-2">
                  Nosso dispositivo inovador oferece precisão e confiabilidade
                  incomparáveis na detecção de vazamentos de gás, garantindo a
                  segurança da sua casa ou empresa.
                </p>
                <button
                  type="button"
                  className="bg-black text-white font-light text-sm rounded-md py-1 px-3 hover:scale-105 hover:bg-white hover:text-black transition-transform"
                >
                  Saiba mais
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-28 mb-6 mt-2">
          <h1 className="text-base font-semibold mb-1">Sobre o produto</h1>
          <p className="break-words text-sm">
            Este produto detecta gases inflamáveis, como metano, em residências,
            áreas públicas e celeiros. Com sensores precisos, monitora
            vazamentos e alerta em tempo real, prevenindo riscos de explosões e
            incêndios. Fácil de instalar, garante segurança eficiente em
            ambientes com acúmulo de gases perigosos.
          </p>
        </div>
        <div className="mx-28 mb-6">
          <h1 className="text-base font-semibold mb-2">Benefícios/Recursos</h1>
          <div className="justify-between flex my-6 items-center">
            <div className="border w-80 h-16 border-1 border-zinc-800 bg-zinc-900 rounded-md flex items-center mx-1 p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6 mx-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                />
              </svg>
              <p className="">Alta Precisão do aparelho</p>
            </div>
            <div className="border w-80 h-16 border-1 border-zinc-800 bg-zinc-900 rounded-md flex items-center mx-1 p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6 mx-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
              <p className="">Instalação Fácil</p>
            </div>
            <div className="border h-16 border-1 border-zinc-800 bg-zinc-900 rounded-md flex items-center mx-1 p-1 w-80">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-7 mx-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              <p className="">monitoramento em tempo-real</p>
            </div>
          </div>
        </div>
        <div className="mx-28 mb-5">
          <h1 className="text-base font-semibold mb-1">
            Reconhecimento e Experiência do Usuário
          </h1>
          <p className="text-sm ">
            Testado internamente, o dispositivo tem mostrado desempenho
            confiável em residências e empresas. Usuários destacam a segurança
            imediata e a facilidade de uso como seus principais diferenciais.
          </p>
        </div>
        <div className="mx-28 mb-6">
          <div className="flex flex-col text-center mb-5">
            <h1 className="text-lg font-semibold mb-1">
              Mantenha-se Atualizado
            </h1>
            <p className="text-xs justify-center text-center">
              Receba as últimas notícias e atualizações sobre nosso dispositivo
              de detecção de vazamentos de gás.
            </p>
          </div>
          <div className="flex items-center  justify-center mx-auto">
            <div className="bg-zinc-800 rounded-xl flex items-center h-10 pr-2">
              <input
                className="bg-zinc-800 h-10 text-xs p-2 rounded-xl placeholder-green-400 focus:outline-none"
                type="text"
                placeholder="Digite seu email"
              />
              <button className="bg-green-500 h-8 py-1 px-2 text-sm rounded-xl hover:scale-110 hover:bg-green-600 transition-transform">
                Inscrever-se
              </button>
            </div>
          </div>
        </div>
        <div className="mx-28 ">
          <h1 className="font-semibold mb-1">Contate-nos</h1>
          <p className="text-xs mb-4">
            Para dúvidas ou suporte, entre em contato pelo e-mail:
            infogas.suport@gmail.com.
          </p>
          <button className="bg-green-500 py-0.5 mb-6 px-2 text-sm rounded-md hover:scale-110 duration-200 hover:bg-green-600">
            Contato
          </button>
        </div>
      </div>
      <div>
        <footer className="pb-8">
          <FooterPagePart />
        </footer>
      </div>
    </div>
  );
}
export default App;
