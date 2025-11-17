import { useState, useEffect } from "react";
import { listarMusicas } from "../utils/musicStorage";
import { buscarMusicaCache, salvarNoCache } from "../utils/cacheManager";

export default function Lyrics() {
  const [musicas, setMusicas] = useState([]);
  const [musicaSelecionada, setMusicaSelecionada] = useState(null);
  const [letraEditavel, setLetraEditavel] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    carregarMusicasLocais();
  }, []);

  async function carregarMusicasLocais() {
    setCarregando(true);
    try {
      const musicasLocais = await listarMusicas();
      // Filtra para mostrar apenas músicas que têm a propriedade 'lyrics' preenchida
      const musicasComLetra = musicasLocais.filter((m) => m.lyrics);
      setMusicas(musicasComLetra);
    } catch (error) {
      console.error("Erro ao carregar músicas locais:", error);
      alert("Não foi possível carregar as músicas.");
    } finally {
      setCarregando(false);
    }
  }

  function selecionarMusica(musica) {
    setMusicaSelecionada(musica);
    setLetraEditavel(musica.lyrics || "");
    setEditando(false); // Sempre volta para o modo de visualização ao trocar de música
  }

  async function salvarAlteracoes() {
    if (!musicaSelecionada) return;

    setSalvando(true);
    try {
      // Precisamos do blob de áudio original para salvar novamente
      const musicaOriginal = await buscarMusicaCache(musicaSelecionada.nomeArquivo);
      if (!musicaOriginal) {
        throw new Error("Não foi possível encontrar a música original no cache.");
      }

      // Salva com a letra atualizada
      await salvarNoCache(
        musicaSelecionada.nomeArquivo,
        musicaSelecionada.titulo,
        musicaOriginal.blob,
        letraEditavel
      );

      // Atualiza o estado local para refletir a mudança
      setMusicaSelecionada((prev) => ({ ...prev, lyrics: letraEditavel }));
      setMusicas((prev) =>
        prev.map((m) =>
          m.id === musicaSelecionada.id ? { ...m, lyrics: letraEditavel } : m
        )
      );

      alert("Letra salva com sucesso!");
      setEditando(false); // Volta para o modo de visualização após salvar
    } catch (error) {
      console.error("Erro ao salvar a letra:", error);
      alert("Ocorreu um erro ao salvar as alterações.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="p-6 bg-gray-800 rounded-2xl shadow-lg max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Coluna de Músicas */}
      <div className="md:col-span-1 bg-gray-900 p-4 rounded-lg flex flex-col">
        <h2 className="text-2xl font-bold mb-4 text-white">Letras baixadas</h2>
        {carregando ? (
          <p className="text-gray-400">Carregando...</p>
        ) : (
          <ul className="space-y-2 flex-grow overflow-y-auto pr-2 max-h-[70vh]">
            {musicas.map((m) => (
              <li
                key={m.id}
                onClick={() => selecionarMusica(m)}
                className={`cursor-pointer p-2 rounded-md transition-colors text-sm ${
                  musicaSelecionada?.id === m.id
                    ? "bg-blue-800/70"
                    : "hover:bg-gray-700/50"
                }`}
              >
                <p className="font-medium text-white truncate">{m.titulo}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Coluna de Edição */}
      <div className="md:col-span-2 bg-gray-900 p-4 rounded-lg flex flex-col">
        {musicaSelecionada ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white truncate" title={musicaSelecionada.titulo}>
                {musicaSelecionada.titulo}
              </h2>
              {!editando && (
                <button
                  onClick={() => setEditando(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-4 rounded text-sm"
                >
                  ✏️ Editar
                </button>
              )}
            </div>

            {editando ? (
              <>
                <textarea
                  value={letraEditavel}
                  onChange={(e) => setLetraEditavel(e.target.value)}
                  className="w-full flex-grow p-3 rounded bg-gray-800 border border-gray-700 text-gray-200 font-mono text-sm leading-relaxed resize-none"
                  placeholder="Digite a letra aqui..."
                />
                <div className="flex justify-end gap-2 mt-4">
                  <button onClick={() => setEditando(false)} className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded">Cancelar</button>
                  <button
                    onClick={salvarAlteracoes}
                    disabled={salvando}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded disabled:bg-gray-500"
                  >
                    {salvando ? "Salvando..." : "💾 Salvar"}
                  </button>
                </div>
              </>
            ) : (
              <div className="w-full flex-grow overflow-y-auto pr-2 max-h-[70vh]">
                <pre className="text-gray-300 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {letraEditavel || "Nenhuma letra cadastrada para esta música."}
                </pre>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-400 self-center mt-10">Selecione uma música na lista para ver e editar a letra.</p>
        )}
      </div>
    </div>
  );
}