// gerarMusicJson.js
import fs from "fs";
import path from "path";

const musicDir = path.resolve("public/music");
const outputFile = path.join(musicDir, "music.json");

// Função auxiliar para formatar o nome do arquivo como título
function formatarTitulo(nomeArquivo) {
  return nomeArquivo
    .replace(/\.[^/.]+$/, "") // remove extensão
    .replace(/[-_]/g, " ") // substitui traços/underscores por espaços
    .replace(/\b\w/g, (l) => l.toUpperCase()); // capitaliza as iniciais
}

try {
  // Lê todos os arquivos da pasta /public/music
  const arquivos = fs.readdirSync(musicDir);

  // Filtra apenas os arquivos de áudio
  const musicas = arquivos
    .filter((nome) => nome.match(/\.(mp3|wav|ogg|m4a)$/i))
    .map((nome) => ({
      titulo: formatarTitulo(nome),
      url: `/music/${nome}`,
    }));

  // Salva o JSON no mesmo diretório
  fs.writeFileSync(outputFile, JSON.stringify(musicas, null, 2), "utf-8");

  console.log(`✅ Arquivo ${outputFile} atualizado com ${musicas.length} músicas.`);
} catch (err) {
  console.error("❌ Erro ao gerar music.json:", err);
}
