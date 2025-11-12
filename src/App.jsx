import { HashRouter, Routes, Route, NavLink } from "react-router-dom";
import Musicas from "./pages/Musicas";
import Setlists from "./pages/Setlists";
import Player from "./pages/Player";
import { useAudioPlayer } from "../useAudioPlayer.js";

function App() {
  const {
    musicaAtual,
    isPlaying,
    progress,
    duration,
    selecionarMusica,
    tocarPausar,
    parar,
  } = useAudioPlayer();

  const linkStyle = "px-4 py-2 rounded-md text-sm font-medium transition-colors";
  const activeLinkStyle = "bg-blue-600 text-white";
  const inactiveLinkStyle = "text-gray-300 hover:bg-gray-700 hover:text-white";

  return (
    <HashRouter>
      <div className="min-h-screen text-white p-4">
        <nav className="flex justify-center mb-6">
          <div className="flex space-x-2 bg-gray-800 p-1 rounded-xl">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${linkStyle} ${isActive ? activeLinkStyle : inactiveLinkStyle}`
              }
            >
              Músicas
            </NavLink>
            <NavLink
              to="/setlists"
              className={({ isActive }) =>
                `${linkStyle} ${isActive ? activeLinkStyle : inactiveLinkStyle}`
              }
            >
              Setlists
            </NavLink>
            <NavLink
              to="/player"
              className={({ isActive }) =>
                `${linkStyle} ${isActive ? activeLinkStyle : inactiveLinkStyle}`
              }
            >
              Player
            </NavLink>
          </div>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<Musicas />} />
            <Route path="/setlists" element={<Setlists />} />
            <Route
              path="/player"
              element={
                <Player
                  musicaAtual={musicaAtual}
                  isPlaying={isPlaying}
                  progress={progress}
                  duration={duration}
                  selecionarMusica={selecionarMusica}
                  tocarPausar={tocarPausar}
                  parar={parar}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}

export default App;
