import { useState, useRef, useEffect } from "react";
import { gsap } from "../../lib/gsap";

export default function AmbientSound() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0;
    audio.src = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=";
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const toggle = async () => {
    if (!audioRef.current) return;

    if (!isReady) {
      try {
        const ctx = new AudioContext();
        ctxRef.current = ctx;
        const source = ctx.createMediaElementSource(audioRef.current);
        const gain = ctx.createGain();
        gain.gain.value = 0;
        source.connect(gain);
        gain.connect(ctx.destination);
        gainRef.current = gain;
        await audioRef.current.play();
        setIsReady(true);
        setIsPlaying(true);
        gsap.to(gain.gain, { value: 0.15, duration: 2, ease: "power2.out" });
      } catch {
        // Audio context blocked
      }
      return;
    }

    if (isPlaying) {
      gsap.to(gainRef.current!.gain, {
        value: 0,
        duration: 1,
        ease: "power2.in",
        onComplete: () => {
          audioRef.current?.pause();
          setIsPlaying(false);
        },
      });
    } else {
      await audioRef.current.play();
      setIsPlaying(true);
      gsap.to(gainRef.current!.gain, { value: 0.15, duration: 2, ease: "power2.out" });
    }
  };

  return (
    <button
      className="ambient-sound-btn"
      onClick={toggle}
      aria-label={isPlaying ? "Mute ambient sound" : "Play ambient sound"}
      title={isPlaying ? "Mute" : "Sound"}
    >
      {isPlaying ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      )}
    </button>
  );
}
