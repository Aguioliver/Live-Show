import localforage from "localforage";
import { listarMusicasCache } from "./cacheManager";
import { getFileNameFromUrl } from "./fileUtils"; // Precisaremos criar este arquivo

localforage.config({
  name: "LiveShow",
  storeName: "musicas",
});

// Lista apenas músicas com áudio armazenado localmente (no IndexedDB via cacheManager)
export const listarMusicas = async () => {
  try {
    // 1. Pega a lista de músicas online para ter os metadados (títulos)
    const res = await fetch("/music/music.json");
    if (!res.ok) throw new Error("Falha ao carregar music.json");
    const musicasOnline = await res.json();

    // 2. Pega a lista de músicas do cache (que só tem nomeArquivo e blob)
    const musicasEmCache = await listarMusicasCache(); // Retorna [{ nomeArquivo, blob }]

    // 3. Combina as duas listas
    const musicasCompletas = musicasEmCache.map((cacheItem) => {
      // Encontra a música online correspondente pelo nome do arquivo
      const musicaOnline = musicasOnline.find(
        (m) => getFileNameFromUrl(m.url) === cacheItem.nomeArquivo
      );

      return {
        id: cacheItem.nomeArquivo, // Usamos o nome do arquivo como ID único
        titulo: musicaOnline?.titulo || cacheItem.nomeArquivo,
        nomeArquivo: cacheItem.nomeArquivo,
        audioBlob: cacheItem.blob, // O blob de áudio
        audioLocal: true,
      };
    });

    // Ordena alfabeticamente por título
    return musicasCompletas.sort((a, b) =>
      a.titulo.toLowerCase().localeCompare(b.titulo.toLowerCase())
    );
  } catch (error) {
    console.error("Erro ao listar músicas locais:", error);
    return [];
  }
};

// Busca uma música específica
export const obterMusicaPorId = async (id) => {
  try {
    // Como não salvamos mais objetos completos no localforage,
    // vamos buscar na lista combinada.
    const todas = await listarMusicas();
    return todas.find(m => m.id === id) || null;
  } catch (error) {
    console.error("Erro ao obter música:", error);
    return null;
  }
};
