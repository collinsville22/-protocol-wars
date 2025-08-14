'use client';

import { useEffect, useRef, useState } from 'react';

interface SoundSystemProps {
  enabled?: boolean;
}

export default function SoundSystem({ enabled = true }: SoundSystemProps) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !enabled) return;

    const initAudio = async () => {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        setIsInitialized(true);
      } catch (error) {
        console.log('Audio context initialization failed:', error);
      }
    };

    // Initialize on user interaction
    const handleUserInteraction = () => {
      if (!isInitialized) {
        initAudio();
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('keydown', handleUserInteraction);
      }
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [enabled]);

  const playSound = (frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.1) => {
    if (!audioContextRef.current || !isInitialized || !enabled) return;

    try {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, audioContextRef.current.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration);

      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + duration);
    } catch (error) {
      console.log('Sound playback failed:', error);
    }
  };

  // Expose sound functions globally
  useEffect(() => {
    if (!isInitialized) return;

    const sounds = {
      missionComplete: () => {
        playSound(523, 0.2, 'sine', 0.15); // C5
        setTimeout(() => playSound(659, 0.2, 'sine', 0.15), 100); // E5
        setTimeout(() => playSound(784, 0.3, 'sine', 0.15), 200); // G5
      },
      
      unitDeploy: () => {
        playSound(220, 0.1, 'square', 0.1); // A3
        setTimeout(() => playSound(440, 0.15, 'square', 0.1), 50); // A4
      },
      
      battleVictory: () => {
        const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
        notes.forEach((note, i) => {
          setTimeout(() => playSound(note, 0.25, 'sine', 0.12), i * 100);
        });
      },
      
      attack: () => {
        playSound(150, 0.3, 'sawtooth', 0.08);
        setTimeout(() => playSound(100, 0.2, 'sawtooth', 0.06), 100);
      },
      
      notification: () => {
        playSound(800, 0.1, 'sine', 0.08);
        setTimeout(() => playSound(1000, 0.1, 'sine', 0.08), 100);
      },
      
      resourceGain: () => {
        playSound(400, 0.15, 'triangle', 0.06);
        setTimeout(() => playSound(500, 0.1, 'triangle', 0.06), 75);
      },
      
      error: () => {
        playSound(200, 0.2, 'sawtooth', 0.1);
        setTimeout(() => playSound(150, 0.3, 'sawtooth', 0.08), 100);
      }
    };

    // Make sounds available globally
    (window as any).gameSounds = sounds;

    return () => {
      delete (window as any).gameSounds;
    };
  }, [isInitialized]);

  return null; // This component doesn't render anything
}

// Hook for using game sounds in components
export function useGameSounds() {
  const [soundsReady, setSoundsReady] = useState(false);

  useEffect(() => {
    const checkSounds = () => {
      if ((window as any).gameSounds) {
        setSoundsReady(true);
      } else {
        setTimeout(checkSounds, 100);
      }
    };
    checkSounds();
  }, []);

  const playSound = (soundName: string) => {
    if (soundsReady && (window as any).gameSounds) {
      (window as any).gameSounds[soundName]?.();
    }
  };

  return { playSound, soundsReady };
}