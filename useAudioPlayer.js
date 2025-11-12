// src/hooks/useAudioPlayer.js
import { useState, useEffect } from "react";
import { Howl } from "howler";

export function useAudioPlayer() {
  const [howl, setHowl] = useState(null);
  const [musicaAtual, setMusicaAtual] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  // Limpa o som ao fechar a aplicação
  useEffect(() => {
    return () => {
      if (howl) howl.unload();
    };
  }, [howl]);

  // Atualiza o progresso da música
  useEffect(() => {
    let animationFrameId;
    const updateProgress = () => {
      if (isPlaying && howl) {
        if (howl.playing()) {
          setProgress(howl.seek());
        }
        animationFrameId = requestAnimationFrame(updateProgress);
      }
    };

    if (isPlaying) {
      animationFrameId = requestAnimationFrame(updateProgress);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, howl]);

  const selecionarMusica = (musica) => {
    if (musicaAtual?.id === musica.id) return;

    if (howl) {
      howl.stop();
      howl.unload();
    }

    setProgress(0);
    setDuration(0);

    if (!musica?.audioBlob) {
      alert("Esta música não foi baixada ou o áudio não foi encontrado.");
      setMusicaAtual(null);
      setIsPlaying(false);
      return;
    }

    const url = URL.createObjectURL(musica.audioBlob);
    const novoSom = new Howl({
      src: [url],
      format: [musica.nomeArquivo.split(".").pop()],
      html5: true,
      onload: function () { setDuration(this.duration()); },
      onend: () => setIsPlaying(false),
      onunload: function() { URL.revokeObjectURL(this._src); },
    });

    novoSom.play();
    setHowl(novoSom);
    setMusicaAtual(musica);
    setIsPlaying(true);
  };

  const tocarPausar = () => {
    if (!howl) return;
    howl.playing() ? howl.pause() : howl.play();
    setIsPlaying(howl.playing());
  };

  const parar = () => {
    if (howl) howl.stop();
    setIsPlaying(false);
    setProgress(0);
  };

  return { howl, musicaAtual, isPlaying, progress, duration, selecionarMusica, tocarPausar, parar };
}