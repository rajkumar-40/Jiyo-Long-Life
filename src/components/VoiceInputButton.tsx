import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2, Sparkles, AlertCircle } from 'lucide-react';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  language: string; // "Marathi" | "Hindi" | "English" etc.
  className?: string;
}

// Map the friendly language selection to standard BCP-47 language codes for speech recognition
const LANGUAGE_CODE_MAP: Record<string, string> = {
  'Marathi': 'mr-IN',
  'Hindi': 'hi-IN',
  'English': 'en-IN',
  'Sanskrit': 'sa-IN',
  'Gujarati': 'gu-IN',
  'Spanish': 'es-ES',
  'French': 'fr-FR',
  'German': 'de-DE',
  'Japanese': 'ja-JP',
  'Arabic': 'ar-AE',
  'Russian': 'ru-RU',
  'Portuguese': 'pt-PT',
  'Chinese': 'zh-CN',
  'Bengali': 'bn-IN'
};

export default function VoiceInputButton({ onTranscript, language, className = "" }: VoiceInputButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
    }
  }, []);

  const startListening = () => {
    setError(null);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      setError("Speech recognition is not supported in this browser. Please try Chrome, Edge, or Safari.");
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.continuous = false; // We can let user speak a sentence at a time
      rec.interimResults = false;
      
      // Determine language code
      const code = LANGUAGE_CODE_MAP[language] || 'en-IN';
      rec.lang = code;

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onerror = (event: any) => {
        console.error("Speech recognition error:", event);
        if (event.error === 'not-allowed') {
          setError("Microphone permission denied. Please allow microphone access in your browser.");
        } else if (event.error === 'no-speech') {
          setError("No speech was detected. Please try speaking closer to the microphone.");
        } else {
          setError(`Error occurred: ${event.error}`);
        }
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          onTranscript(transcript);
        }
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (e: any) {
      console.error(e);
      setError("Failed to start speech recognition.");
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Auto clean up on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  if (!isSupported) {
    return (
      <span className="text-[10px] text-gray-400 italic">
        Speech Input unsupported in this browser
      </span>
    );
  }

  // Language display name
  const displayLang = LANGUAGE_CODE_MAP[language] ? `${language} Speech Enabled` : "Speech Enabled";

  return (
    <div className={`flex flex-col items-start gap-1.5 ${className}`}>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleListening}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse ring-2 ring-red-300'
              : 'bg-[#e8f5e9] hover:bg-[#c8e6c9] text-[#2e7d32] border border-[#a5d6a7]'
          }`}
          title={isListening ? "Stop listening" : `Start speaking in ${language}`}
        >
          {isListening ? (
            <>
              <MicOff className="w-3.5 h-3.5" />
              <span>Listening in {language}... Click to Stop</span>
            </>
          ) : (
            <>
              <Mic className="w-3.5 h-3.5 text-[#2e7d32]" />
              <span className="flex items-center gap-1">
                Speak details in {language} <Sparkles className="w-3 h-3 text-amber-500" />
              </span>
            </>
          )}
        </button>
        {isListening && (
          <span className="flex gap-1 items-center">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <span className="text-[10px] text-red-600 font-bold">Mic Active</span>
          </span>
        )}
      </div>
      
      {error && (
        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-md border border-red-100">
          <AlertCircle className="w-3 h-3 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
