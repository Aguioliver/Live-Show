import { createContext, useContext } from "react";
import { useAudioPlayer } from "../useAudioPlayer.js";

const AudioContext = createContext(null);

export function AudioProvider({ children }) {
  const audioPlayer = useAudioPlayer();

  return (
    <AudioContext.Provider value={audioPlayer}>{children}</AudioContext.Provider>
  );
}

export const useAudio = () => {
  return useContext(AudioContext);
};