// AudioRecorderContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import { useAudioRecorder } from "react-audio-voice-recorder";

const AudioRecorderContext = createContext();

export const AudioRecorderProvider = ({ children }) => {
  const [audioBlob, setAudioBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const recorder = useAudioRecorder();

//   useEffect(() => {
//     if (isRecording) {
//       recorder.startRecording();
//     } else {
//       recorder.stopRecording();
//     }
//   }, [isRecording]);

  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
    recorder.stopRecording((blob) => {
      setAudioBlob(blob);
      const url = URL.createObjectURL(blob);
      const audio = document.createElement("audio");
      audio.src = url;
      audio.controls = true;
      document.body.appendChild(audio);
    });
  };

  return (
    <AudioRecorderContext.Provider
      value={{
        recorder,
        audioBlob,
        isRecording,
        startRecording,
        stopRecording,
      }}
    >
      {children}
    </AudioRecorderContext.Provider>
  );
};

export const useAudioRecorderContext = () => useContext(AudioRecorderContext);
