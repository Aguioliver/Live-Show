import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listarMusicas } from "../utils/musicStorage";
import {
  salvarSetlist,
  listarSetlists,
  excluirSetlist,
} from "../utils/setlistStorage";
import { generateUUID } from "../utils/uuid";

export default function Setlists() {
  const [todasMusicas, setTodasMusicas] = useState([]);
  const [setlists, setSetlists] = useState([]);
  const [novaSetlist, setNovaSetlist] = useState("");
  const [selecionadas, setSelecionadas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      setCarregando(true);
      const musicas = await listarMusicas(); // só músicas com áudio local
      const listas = await listarSetlists();
      setTodasMusicas(musicas);
      setSetlists(listas);
    } catch (e) {
      console.error("Erro ao carregar músicas ou setlists:", e);
      alert("Erro ao carregar dados locais. Verifique o armazenamento do navegador.");
    } finally {
      setCarregando(false);
    }
  }

  function toggleMusica(id) {
    setSelecionadas((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  }

  async function criarSetlist() {
    if (!novaSetlist.trim() || selecionadas.length === 0) return;

    const setlist = {
      id: generateUUID(),
      nome: novaSetlist.trim(),
      musicasIds: selecionadas,
      criadaEm: new Date().toISOString(),
    };

    const resultado = await salvarSetlist(setlist);

    if (resultado.success) {
      setNovaSetlist("");
      setSelecionadas([]);
      carregar();
    } else if (resultado.error) {
      alert(`❌ Erro ao salvar: ${resultado.error.message}`);
    }
  }

  async function removerSetlist(id) {
    await excluirSetlist(id);
    carregar();
  }

  function carregarNoPlayer(setlist) {
    localStorage.setItem("setlistAtualId", setlist.id);
    navigate("/player");
  }

  return (
    <div className="p-6 bg-gray-800 rounded-2xl shadow-lg max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Coluna Esquerda */}
      <div>
        <h1 className="text-3xl font-bold mb-6 text-white">Criar Nova Setlist</h1>

        <h3 className="text-xl font-semibold mb-3 text-gray-200">Selecione as músicas:</h3>

        {carregando ? (
          <p className="text-gray-400">Carregando músicas...</p>
        ) : todasMusicas.length === 0 ? (
          <p className="text-gray-400">
            Nenhuma música disponível localmente. Baixe algumas na aba “Músicas”.
          </p>
        ) : (
          <div className="max-h-60 overflow-y-auto bg-gray-900 p-3 rounded-lg">
            <ul className="space-y-1">
              {todasMusicas.map((m) => (
                <li key={m.id}>
                  <label className="flex items-center space-x-3 cursor-pointer text-gray-100 p-1 rounded-md hover:bg-gray-700/50">
                    <input
                      type="checkbox"
                      checked={selecionadas.includes(m.id)}
                      onChange={() => toggleMusica(m.id)}
                      className="h-4 w-4 rounded bg-gray-600 border-gray-500 text-blue-500 focus:ring-blue-500"
                    />
                    <span>{m.titulo}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}

        <input
          type="text"
          placeholder="Nome da nova setlist"
          value={novaSetlist}
          onChange={(e) => setNovaSetlist(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500 my-4 text-white"
        />

        <button
          onClick={criarSetlist}
          disabled={!novaSetlist.trim() || selecionadas.length === 0}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-4 rounded text-sm disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          💾 Criar Setlist
        </button>
      </div>

      {/* Coluna Direita */}
      <div className="bg-gray-900 p-4 rounded-lg">
        <h3 className="text-3xl font-bold mb-6 text-white">Setlists Salvas</h3>

        {setlists.length === 0 ? (
          <p className="text-gray-400">Nenhuma setlist criada ainda.</p>
        ) : (
          <div className="max-h-[60vh] overflow-y-auto pr-2">
            <ul className="space-y-2">
              {setlists.map((s, index) => (
                <li
                  key={s.id}
                  className="flex justify-between items-center p-1 rounded-md transition-colors hover:bg-gray-700/50"
                >
                  <p className="font-medium text-white truncate text-sm">
                    <span className="text-gray-400 mr-2">{index + 1}.</span>
                    {s.nome}
                    <span className="text-xs text-gray-400 ml-2 truncate">
                      ({s.musicasIds.length} músicas)
                    </span>
                  </p>
                  <div className="flex space-x-1 flex-shrink-0">
                    <button
                      onClick={() => carregarNoPlayer(s)}
                      title="Carregar no Player"
                      className="p-1 text-xl transition-transform hover:scale-110"
                    >
                      ▶️
                    </button>
                    <button
                      onClick={() => removerSetlist(s.id)}
                      title="Excluir Setlist"
                      className="p-1 text-xl transition-transform hover:scale-110"
                    >
                      🗑️
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
