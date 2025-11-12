// Gerencia músicas no IndexedDB (cache offline)

const DB_NAME = "liveShowDB";
const STORE_NAME = "musicas";

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "nomeArquivo" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function salvarNoCache(nomeArquivo, blob) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  await tx.objectStore(STORE_NAME).put({ nomeArquivo, blob }); // Não precisa retornar tx.done
}

export async function listarMusicasCache() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function removerDoCache(nomeArquivo) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  await tx.objectStore(STORE_NAME).delete(nomeArquivo); // Não precisa retornar tx.done
}
