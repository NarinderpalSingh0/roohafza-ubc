import { useState, useRef, useCallback, useEffect } from "react";

class AmbientEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying = false;
  private timers: ReturnType<typeof setTimeout>[] = [];

  async start() {
    if (this.isPlaying) return;
    this.ctx = new AudioContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0;
    this.masterGain.connect(this.ctx.destination);

    // Tanpura drone — warm pad with harmonics
    this.playDrone();

    // Soft breeze — brown noise (smoother than white)
    this.playBreeze();

    // Water fountain — gentle bubbling
    this.playFountain();

    // Bird chirps — occasional
    this.scheduleBirds();

    // Chime — every 25s
    this.scheduleChime();

    // Fade in
    this.masterGain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + 4);
    this.isPlaying = true;
  }

  private playDrone() {
    if (!this.ctx || !this.masterGain) return;

    const notes = [130.81, 196.00, 261.63]; // C3, G3, C4
    const droneGain = this.ctx.createGain();
    droneGain.gain.value = 0.04;
    droneGain.connect(this.masterGain);

    notes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const oscGain = this.ctx!.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      oscGain.gain.value = 0.025 - i * 0.005;
      osc.connect(oscGain);
      oscGain.connect(droneGain);
      osc.start();

      // Slow vibrato
      const lfo = this.ctx!.createOscillator();
      const lfoGain = this.ctx!.createGain();
      lfo.frequency.value = 0.3 + i * 0.1;
      lfoGain.gain.value = 0.5;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();
    });
  }

  private playBreeze() {
    if (!this.ctx || !this.masterGain) return;

    // Brown noise — much smoother than white noise
    const bufferSize = 2 * this.ctx.sampleRate;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 300;
    filter.Q.value = 0.3;

    const gain = this.ctx.createGain();
    gain.gain.value = 0.03;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    source.start();

    // Gentle modulation
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.value = 0.08;
    lfoGain.gain.value = 80;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();
  }

  private playFountain() {
    if (!this.ctx || !this.masterGain) return;

    const createBubble = () => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = "sine";
      const baseFreq = 400 + Math.random() * 600;
      osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, this.ctx.currentTime + 0.2);

      filter.type = "bandpass";
      filter.frequency.value = 600;
      filter.Q.value = 2;

      gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain!);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    };

    const scheduleNext = () => {
      const delay = 1500 + Math.random() * 3000;
      const timer = setTimeout(() => {
        createBubble();
        scheduleNext();
      }, delay);
      this.timers.push(timer);
    };
    scheduleNext();

    // Second layer — softer continuous trickle
    const scheduleTrickle = () => {
      const delay = 800 + Math.random() * 1500;
      const timer = setTimeout(() => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = 1200 + Math.random() * 400;
        gain.gain.setValueAtTime(0.006, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(this.masterGain!);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
        scheduleTrickle();
      }, delay);
      this.timers.push(timer);
    };
    scheduleTrickle();
  }

  private scheduleBirds() {
    const createChirp = () => {
      if (!this.ctx || !this.masterGain) return;
      const baseFreq = 2000 + Math.random() * 1500;
      const chirps = 2 + Math.floor(Math.random() * 3);

      for (let i = 0; i < chirps; i++) {
        const timer = setTimeout(() => {
          if (!this.ctx || !this.masterGain) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.2, this.ctx.currentTime + 0.05);
          osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.9, this.ctx.currentTime + 0.1);
          gain.gain.setValueAtTime(0.008, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
          osc.connect(gain);
          gain.connect(this.masterGain!);
          osc.start();
          osc.stop(this.ctx.currentTime + 0.15);
        }, i * 120);
        this.timers.push(timer);
      }

      const nextTimer = setTimeout(createChirp, 8000 + Math.random() * 15000);
      this.timers.push(nextTimer);
    };

    const startTimer = setTimeout(createChirp, 3000 + Math.random() * 5000);
    this.timers.push(startTimer);
  }

  private scheduleChime() {
    const createChime = () => {
      if (!this.ctx || !this.masterGain) return;
      const freqs = [1046.5, 1318.5, 1568]; // C6, E6, G6
      const freq = freqs[Math.floor(Math.random() * freqs.length)];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.012, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.5);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start();
      osc.stop(this.ctx.currentTime + 1.8);

      const nextTimer = setTimeout(createChime, 20000 + Math.random() * 15000);
      this.timers.push(nextTimer);
    };

    const startTimer = setTimeout(createChime, 5000);
    this.timers.push(startTimer);
  }

  stop() {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;
    this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 2);
    const ctx = this.ctx;
    setTimeout(() => {
      ctx.close();
    }, 2500);
    this.timers.forEach(clearTimeout);
    this.timers = [];
    this.ctx = null;
    this.masterGain = null;
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
