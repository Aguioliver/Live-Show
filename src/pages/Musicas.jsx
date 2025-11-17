// src/pages/Musicas.jsx
import { useEffect, useState } from "react";
import {
  listarMusicasCache,
  salvarNoCache,
  removerDoCache,
} from "../utils/cacheManager";
import { getFileNameFromUrl } from "../utils/fileUtils";

export default function Musicas() {
  const [musicasOnline, setMusicasOnline] = useState([]);
  const [musicasOffline, setMusicasOffline] = useState([]);
  const [loadingOnline, setLoadingOnline] = useState(true);

  useEffect(() => {
    carregarListaOnline();
    carregarCache();
  }, []);

  async function carregarListaOnline() {
    setLoadingOnline(true);
    try {
      const res = await fetch("/music/music.json");
      if (!res.ok) throw new Error("Não foi possível carregar /music/music.json");
      const data = await res.json();

      // Normaliza cada item para garantir os campos que usamos abaixo
      const normalizado = data.map((item) => {
        const url = item.url || item.path || "";
        const nomeArquivo = getFileNameFromUrl(url);
        return {
          titulo: item.titulo || nomeArquivo.replace(/\.[^/.]+$/, ""),
          url,
          nomeArquivo,
        };
      });

      setMusicasOnline(normalizado);
    } catch (e) {
      console.error("Erro ao carregar lista de músicas da rede:", e);
      setMusicasOnline([]);
    } finally {
      setLoadingOnline(false);
    }
  }

  async function carregarCache() {
    try {
      const cache = await listarMusicasCache(); // retorna [{ nomeArquivo, blob }, ...]
      setMusicasOffline(cache || []);
    } catch (err) {
      console.error("Erro ao listar cache:", err);
      setMusicasOffline([]);
    }
  }

  async function baixarMusica(musica) {
    try {
      // Baixa o áudio
      const res = await fetch(musica.url);
      if (!res.ok) throw new Error("Erro ao baixar arquivo: " + res.status);
      const blob = await res.blob();

      // Baixa a letra, se existir
      let lyrics = null;
      if (musica.lyricsUrl) {
        const lyricsRes = await fetch(musica.lyricsUrl);
        if (lyricsRes.ok) {
          lyrics = await lyricsRes.text();
        }
      }

      await salvarNoCache(musica.nomeArquivo, musica.titulo, blob, lyrics);
      await carregarCache();
    } catch (e) {
      console.error("Erro ao baixar música:", e);
      alert("Falha ao baixar a música. Veja o console para detalhes.");
    }
  }

  async function removerMusica(musica) {
    try {
      await removerDoCache(musica.nomeArquivo);
      await carregarCache();
    } catch (e) {
      console.error("Erro ao remover do cache:", e);
      alert("Falha ao remover do cache.");
    }
  }

  function estaNoCache(nomeArquivo) {
    return musicasOffline.some((m) => m.nomeArquivo === nomeArquivo);
  }

  return (
    <div className="p-6 bg-gray-800 rounded-2xl shadow-lg max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white text-center">🎵 Gerenciador de Músicas</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Coluna Esquerda: Músicas Online */}
        <div className="bg-gray-900 p-4 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-white">Disponíveis para Baixar</h2>
          {loadingOnline ? (
            <p className="text-gray-300">Carregando lista...</p>
          ) : musicasOnline.length === 0 ? (
            <p className="text-gray-400">
              Nenhuma música encontrada. Verifique <code>/public/music/music.json</code>.
            </p>
          ) : (
            <ul className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
              {musicasOnline.map((m, index) => (
                <li
                  key={m.nomeArquivo}
                  className="flex justify-between items-center cursor-pointer p-1 rounded-md transition-colors hover:bg-gray-700/50"
                >
                  <div className="min-w-0 mr-4">
                    <p className="font-medium text-white truncate text-sm">
                      <span className="text-gray-400 mr-2">{index + 1}.</span>
                      {m.titulo}
                      <span className="text-xs text-gray-400 ml-2 truncate">({m.nomeArquivo})</span>
                    </p>
                  </div>

                  <div className="flex-shrink-0">
                    {estaNoCache(m.nomeArquivo) ? (
                      <button
                        onClick={() => removerMusica(m)}
                        className="p-1 text-xl transition-transform hover:scale-110"
                      >
                        🗑️
                      </button>
                    ) : (
                      <button
                        onClick={() => baixarMusica(m)}
                        className="p-1 text-xl transition-transform hover:scale-110"
                      >
                        ⬇️
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Coluna Direita: Músicas Offline */}
        <div className="bg-gray-900 p-4 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-white">Baixadas (Offline)</h2>
          {musicasOffline.length === 0 ? (
            <p className="text-gray-400">Nenhuma música baixada ainda.</p>
          ) : (
            <ul className="space-y-2 text-gray-300 max-h-[60vh] overflow-y-auto pr-2">
              {musicasOffline.map((m, index) => (
                <li key={m.nomeArquivo} className="p-1 text-sm">
                  <span className="text-gray-500 mr-2">{index + 1}.</span>
                  {m.nomeArquivo}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
