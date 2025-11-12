import { listarMusicasCache } from "./cacheManager";

// Lista apenas músicas com áudio armazenado localmente (no IndexedDB via cacheManager)
export const listarMusicas = async () => {
  try {
    // 1. Pega a lista de músicas do cache, que agora contém tudo que precisamos.
    const musicasEmCache = await listarMusicasCache(); // Retorna [{ nomeArquivo, blob }]

    // 2. Mapeia os dados do cache para o formato que o app espera.
    const musicasCompletas = musicasEmCache.map((cacheItem) => {
      return {
        id: cacheItem.nomeArquivo, // Usamos o nome do arquivo como ID único
        titulo: cacheItem.titulo || cacheItem.nomeArquivo, // Usa o título salvo
        nomeArquivo: cacheItem.nomeArquivo,
        audioBlob: cacheItem.blob, // O blob de áudio
        audioLocal: true,
      };
    });

    // 3. Ordena alfabeticamente por título
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
