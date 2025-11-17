import { useState, useEffect } from "react";
import { buscarSetlistPorId } from "../utils/setlistStorage";
import { listarMusicas } from "../utils/musicStorage";
import { Play, Pause, StopCircle } from "lucide-react";

export default function Player({
  musicaAtual,
  isPlaying,
  progress,
  duration,
  selecionarMusica,
  tocarPausar,
  parar,
}) {
  const [setlist, setSetlist] = useState(null);

  // 🔹 Carrega a setlist atual do localStorage
  useEffect(() => {
    async function carregarSetlist() {
      const id = localStorage.getItem("setlistAtualId");
      if (!id) return;

      const setlistData = await buscarSetlistPorId(id);
      if (!setlistData) return;

      const todasAsMusicas = await listarMusicas();
      const musicasCompletas = setlistData.musicasIds
        .map((musicaId) => todasAsMusicas.find((m) => m.id === musicaId))
        .filter(Boolean);

      setSetlist({ ...setlistData, musicas: musicasCompletas });
    }

    carregarSetlist();
  }, []);

  // 🔹 Formata o tempo de segundos para MM:SS
  const formatTime = (secs) => {
    if (isNaN(secs) || secs === 0) return "00:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };
  // 🔹 Renderização
  if (!setlist) {
    return (
      <div className="p-6 text-center bg-gray-800 rounded-xl max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">▶️ Player</h2>
        <p className="text-gray-400">Nenhuma setlist carregada.</p>
        <p className="text-gray-400">
          Vá até a aba <strong>Setlists</strong> e clique em “Carregar no Player”.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-800 rounded-xl shadow-lg max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-white text-center">
        🎧 Player
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna Esquerda: Lista de Músicas */}
        <div className="bg-gray-900 p-4 rounded-lg">
          <h3 className="text-2xl font-bold mb-4 text-white">Playlist</h3>
          <ul className="space-y-2 max-h-[70vh] overflow-y-auto pr-2">
            {setlist.musicas.map((m, index) => (
              <li
                key={m.id}
                onClick={() => selecionarMusica(m)}
                className={`flex justify-between items-center cursor-pointer p-1 rounded-md transition-colors ${
                  musicaAtual?.id === m.id
                    ? "bg-green-800/50"
                    : "hover:bg-gray-700/50"
                }`}
              >
                <p className="font-medium text-white truncate text-sm">
                  <span className="text-gray-400 mr-2">{index + 1}.</span>
                  {m.titulo}
                  <span className="text-xs text-gray-400 ml-2 truncate">({m.nomeArquivo})</span>
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Coluna Central: Player */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          {/* Painel de Informações */}
          <div className="bg-gray-900 p-4 rounded-lg h-fit sticky top-20">
            <h3 className="text-2xl font-bold mb-4 text-white text-center truncate" title={setlist.nome}>
              [{setlist.nome}]
            </h3>
            <div className="border-b border-gray-700 pb-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-400">Tocando agora</p>
                <p className="text-lg font-semibold text-white truncate">
                  {musicaAtual?.titulo || "Nenhuma música selecionada"}
                </p>
              </div>
            </div>
            {/* --- Barra de Progresso e Tempo --- */}
            <div className="pt-4">
              <div className="w-full bg-gray-600 rounded-full h-1.5">
                <div
                  className="bg-green-500 h-1.5 rounded-full"
                  style={{ width: `${(progress / duration) * 100 || 0}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>

          {/* Painel de Controles */}
          <div className="bg-gray-900 p-4 rounded-lg">
            <div className="flex justify-center items-center space-x-6">
                <button
                  onClick={tocarPausar}
                  disabled={!musicaAtual}
                  className="p-5 rounded-xl bg-green-600 text-white hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                >
                  {isPlaying ? <Pause size={48} /> : <Play size={48} />}
                </button>
                <button
                  onClick={parar}
                  disabled={!musicaAtual}
                  className="p-5 rounded-xl bg-red-600 text-white hover:bg-red-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                >
                  <StopCircle size={48} />
                </button>
              </div>
          </div>
        </div>

        {/* Coluna Direita: Letra da Música */}
        <div className="bg-gray-900 p-4 rounded-lg lg:col-span-1">
          <h3 className="text-2xl font-bold mb-4 text-white">Letra</h3>
          <div className="max-h-[70vh] overflow-y-auto pr-2">
            {musicaAtual?.lyrics ? (
              <pre className="text-gray-300 whitespace-pre-wrap font-sans text-base leading-relaxed">
                {musicaAtual.lyrics}
              </pre>
            ) : (
              <p className="text-gray-500">Nenhuma letra disponível para esta música.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
