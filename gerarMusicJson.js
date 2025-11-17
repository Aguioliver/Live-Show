// gerarMusicJson.js
import fs from "fs";
import path from "path";

const publicDir = path.resolve("public");
const musicDir = path.resolve("public/music");
const outputFile = path.join(musicDir, "music.json");

// Função auxiliar para formatar o nome do arquivo como título
function formatarTitulo(nomeArquivo) {
  return nomeArquivo
    .replace(/\.[^/.]+$/, "") // remove extensão
    .replace(/[-_]/g, " ") // substitui traços/underscores por espaços
    .replace(/\b\w/g, (l) => l.toUpperCase()); // capitaliza as iniciais
}

// Função recursiva para encontrar todos os arquivos de áudio
function findAudioFilesRecursive(dir) {
  let audioFiles = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      audioFiles = audioFiles.concat(findAudioFilesRecursive(fullPath));
    } else if (entry.isFile() && entry.name.match(/\.(mp3|wav|ogg|m4a)$/i)) {
      audioFiles.push(fullPath);
    }
  }
  return audioFiles;
}

try {
  // Encontra todos os arquivos de áudio recursivamente a partir da pasta /public/music
  const audioFilePaths = findAudioFilesRecursive(musicDir);

  const musicas = audioFilePaths.map((filePath) => {
    const relativePath = path.relative(publicDir, filePath).replace(/\\/g, "/"); // Caminho relativo para a URL
    const fileName = path.basename(filePath); // Apenas o nome do arquivo
    const baseName = fileName.replace(/\.[^/.]+$/, ""); // Nome sem extensão
    const lyricsPath = path.join(publicDir, "lyrics", `${baseName}.txt`);
    const lyricsUrl = fs.existsSync(lyricsPath) ? `/lyrics/${baseName}.txt` : null;

    return {
      titulo: formatarTitulo(fileName),
      url: `/${relativePath}`,
      lyricsUrl: lyricsUrl,
    };
  });

  // Ordena a lista de músicas em ordem alfabética pelo título
  musicas.sort((a, b) => a.titulo.localeCompare(b.titulo));

  // Salva o JSON no mesmo diretório
  fs.writeFileSync(outputFile, JSON.stringify(musicas, null, 2), "utf-8");

  console.log(`✅ Arquivo ${outputFile} atualizado com ${musicas.length} músicas.`);
} catch (err) {
  console.error("❌ Erro ao gerar music.json:", err);
}
