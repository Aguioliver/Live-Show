import { Howl } from "howler";

let currentSound = null;

/**
 * Toca um áudio hospedado na pasta /public/music/
 * @param {string} fileName - nome do arquivo (ex: "musica1.mp3")
 */
export function playAudio(fileName) {
  // para qualquer som anterior
  if (currentSound) {
    currentSound.stop();
    currentSound = null;
  }

  // cria um novo Howl apontando para o arquivo hospedado
  currentSound = new Howl({
    src: [`/music/${fileName}`],
    html5: true, // necessário para arquivos grandes e streaming confiável
    onloaderror: (id, err) => console.error("Erro ao carregar:", err),
    onplayerror: (id, err) => console.error("Erro ao reproduzir:", err),
  });

  // desbloqueia o áudio no iPad após interação do usuário
  currentSound.once("unlock", () => {
    currentSound.play();
  });

  currentSound.play();
}

/**
 * Para o áudio atual
 */
export function stopAudio() {
  if (currentSound) {
    currentSound.stop();
    currentSound = null;
  }
}
