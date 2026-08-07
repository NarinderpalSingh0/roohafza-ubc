import { useState, useRef, useCallback, useEffect } from "react";

class AmbientEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying = false;
  private intervals: ReturnType<typeof setInterval>[] = [];

  async start() {
    if (this.isPlaying) return;
    this.ctx = new AudioContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0;
    this.masterGain.connect(this.ctx.destination);

    // Tanpura drone — two detuned oscillators
    const drone1 = this.ctx.createOscillator();
    const drone2 = this.ctx.createOscillator();
    const droneGain = this.ctx.createGain();
    drone1.type = "sine";
    drone1.frequency.value = 130.81; // C3
    drone2.type = "sine";
    drone2.frequency.value = 196.00; // G3
    droneGain.gain.value = 0.06;
    drone1.connect(droneGain);
    drone2.connect(droneGain);
    droneGain.connect(this.masterGain);
    drone1.start();
    drone2.start();

    // Soft shimmer — high sine
    const shimmer = this.ctx.createOscillator();
    const shimmerGain = this.ctx.createGain();
    shimmer.type = "sine";
    shimmer.frequency.value = 523.25; // C5
    shimmerGain.gain.value = 0.015;
    shimmer.connect(shimmerGain);
    shimmerGain.connect(this.masterGain);
    shimmer.start();

    // Wind — filtered noise
    const windBuffer = this.createNoiseBuffer(2);
    const wind = this.ctx.createBufferSource();
    wind.buffer = windBuffer;
    wind.loop = true;
    const windFilter = this.ctx.createBiquadFilter();
    windFilter.type = "lowpass";
    windFilter.frequency.value = 400;
    windFilter.Q.value = 0.5;
    const windGain = this.ctx.createGain();
    windGain.gain.value = 0.04;
    wind.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(this.masterGain);
    wind.start();

    // Modulate wind
    const windLfo = this.ctx.createOscillator();
    const windLfoGain = this.ctx.createGain();
    windLfo.frequency.value = 0.1;
    windLfoGain.gain.value = 150;
    windLfo.connect(windLfoGain);
    windLfoGain.connect(windFilter.frequency);
    windLfo.start();

    // Water drops — periodic
    this.startWaterDrops();

    // Fade in
    this.masterGain.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + 3);
    this.isPlaying = true;
  }

  private createNoiseBuffer(seconds: number): AudioBuffer {
    const sampleRate = this.ctx!.sampleRate;
    const length = sampleRate * seconds;
    const buffer = this.ctx!.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  private startWaterDrops() {
    const createDrop = () => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.value = 800 + Math.random() * 1200;
      filter.type = "bandpass";
      filter.frequency.value = 1000;
      filter.Q.value = 5;

      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain!);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.4) createDrop();
    }, 2000 + Math.random() * 3000);
    this.intervals.push(interval);

    const interval2 = setInterval(() => {
      if (Math.random() > 0.6) createDrop();
    }, 4000 + Math.random() * 4000);
    this.intervals.push(interval2);
  }

  stop() {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;
    this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 2);
    setTimeout(() => {
      this.ctx?.close();
      this.ctx = null;
      this.masterGain = null;
    }, 2500);
    this.intervals.forEach(clearInterval);
    this.intervals = [];
    this.isPlaying = false;
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
    return this.isPlaying;
  }
}

export default function AmbientSound() {
  const [isPlaying, setIsPlaying] = useState(false);
  const engineRef = useRef<AmbientEngine | null>(null);

  const toggle = useCallback(() => {
    if (!engineRef.current) {
      engineRef.current = new AmbientEngine();
    }
    engineRef.current.toggle();
    setIsPlaying(prev => !prev);
  }, []);

  useEffect(() => {
    return () => {
      engineRef.current?.stop();
    };
  }, []);

  return (
    <button
      className="ambient-sound-btn"
      onClick={toggle}
      aria-label={isPlaying ? "Mute ambient sound" : "Play ambient sound"}
      title={isPlaying ? "Mute" : "Sound"}
    >
      {isPlaying ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      )}
    </button>
  );
}
