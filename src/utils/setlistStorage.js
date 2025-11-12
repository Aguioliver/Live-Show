import localforage from "localforage";

const setlistDB = localforage.createInstance({
  name: "LiveShow",
  storeName: "setlists",
});

export const salvarSetlist = async (setlist) => {
  try {
    await setlistDB.setItem(setlist.id, setlist);
    return { success: true };
  } catch (error) {
    console.error("Falha ao salvar a setlist no localforage:", error);
    return { success: false, error };
  }
};

export const listarSetlists = async () => {
  const setlists = [];
  await setlistDB.iterate((value) => {
    setlists.push(value);
  });
  return setlists.sort((a, b) => a.nome.localeCompare(b.nome));
};

export const buscarSetlistPorId = async (id) => {
  if (!id) return null;
  return await setlistDB.getItem(id);
};

export const excluirSetlist = async (id) => {
  await setlistDB.removeItem(id);
};
