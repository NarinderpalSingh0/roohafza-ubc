import { useState, useRef, useCallback, useEffect, forwardRef, useImperativeHandle } from "react";

const isMobile = () => window.innerWidth < 768;
const MUTE_KEY = "rooh-afza-muted";

class AmbientEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying = false;
  private timers: ReturnType<typeof setTimeout>[] = [];
  private oscillators: OscillatorNode[] = [];

  async start() {
    if (this.isPlaying) return;
    this.ctx = new AudioContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0;
    this.masterGain.connect(this.ctx.destination);

    const compressor = this.ctx.createDynamicsCompressor();
    compressor.threshold.value = -24;
    compressor.ratio.value = 3;
    compressor.connect(this.masterGain);

    this.playTanpura(compressor);
    this.playWind(compressor);
    this.playFountain(compressor);

    if (!isMobile()) {
      this.scheduleBirds(compressor);
      this.scheduleChime(compressor);
    }

    // Fade in over 2.5s
    this.masterGain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + 2.5);
    this.isPlaying = true;
  }

  // Warm tanpura: triangle (70%) + sawtooth (30%), slow filter LFO
  private playTanpura(dest: AudioNode) {
    if (!this.ctx) return;

    const createString = (fundamental: number, detune: number) => {
      if (!this.ctx) return;

      // Triangle (70%)
      const tri = this.ctx.createOscillator();
      tri.type = "triangle";
      tri.frequency.value = fundamental;
      tri.detune.value = detune;

      // Sawtooth (30%)
      const saw = this.ctx.createOscillator();
      saw.type = "sawtooth";
      saw.frequency.value = fundamental;
      saw.detune.value = detune;

      const triGain = this.ctx!.createGain();
      triGain.gain.value = 0.018;
      const sawGain = this.ctx!.createGain();
      sawGain.gain.value = 0.006;

      // Warm filter with slow LFO
      const filter = this.ctx!.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 600;
      filter.Q.value = 0.5;

      const lfo = this.ctx!.createOscillator();
      const lfoGain = this.ctx!.createGain();
      lfo.frequency.value = 0.07; // Very slow
      lfoGain.gain.value = 100;
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();

      tri.connect(triGain);
      saw.connect(sawGain);
      triGain.connect(filter);
      sawGain.connect(filter);
      filter.connect(dest);
      tri.start();
      saw.start();
      this.oscillators.push(tri, saw, lfo);
    };

    // Sa-Pa-Sa with slight detuning
    createString(130.81, -2);
    createString(130.81, 2);
    createString(196.00, -1);
    createString(261.63, 1);
  }

  // Stereo-wide wind
  private playWind(dest: AudioNode) {
    if (!this.ctx) return;

    const createBrownNoise = () => {
      if (!this.ctx) return null;
      const bufferSize = 4 * this.ctx.sampleRate;
      const buffer = this.ctx.createBuffer(2, bufferSize, this.ctx.sampleRate);

      for (let channel = 0; channel < 2; channel++) {
        const data = buffer.getChannelData(channel);
        let lastOut = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          data[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = data[i];
          data[i] *= 3.5;
        }
      }

      const source = this.ctx!.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      return source;
    };

    // Deep rumble — center
    const s1 = createBrownNoise();
    if (s1) {
      const f1 = this.ctx.createBiquadFilter();
      f1.type = "lowpass";
      f1.frequency.value = 180;
      const g1 = this.ctx.createGain();
      g1.gain.value = 0.02;
      s1.connect(f1);
      f1.connect(g1);
      g1.connect(dest);
      s1.start();
    }

    // Mid breeze — stereo wide using stereo panner
    const s2 = createBrownNoise();
    if (s2) {
      const f2 = this.ctx.createBiquadFilter();
      f2.type = "bandpass";
      f2.frequency.value = 350;
      f2.Q.value = 0.3;

      // Slow sweep
      const lfo = this.ctx.createOscillator();
      const lfoG = this.ctx.createGain();
      lfo.frequency.value = 0.05;
      lfoG.gain.value = 120;
      lfo.connect(lfoG);
      lfoG.connect(f2.frequency);
      lfo.start();

      // Split to stereo
      const splitter = this.ctx.createChannelSplitter(2);
      const merger = this.ctx.createChannelMerger(2);
      const leftGain = this.ctx.createGain();
      const rightGain = this.ctx.createGain();
      leftGain.gain.value = 0.7;
      rightGain.gain.value = 0.7;

      s2.connect(f2);
      f2.connect(splitter);
      splitter.connect(leftGain, 0);
      splitter.connect(rightGain, 1);
      leftGain.connect(merger, 0, 0);
      rightGain.connect(merger, 0, 1);
      merger.connect(dest);
      s2.start();
      this.oscillators.push(lfo);
    }
  }

  // Centered fountain
  private playFountain(dest: AudioNode) {
    if (!this.ctx) return;

    const trickle = () => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 1600 + Math.random() * 600;
      gain.gain.setValueAtTime(0.003, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(dest);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.07);
    };

    const scheduleTrickle = () => {
      const delay = 500 + Math.random() * 1000;
      const timer = setTimeout(() => {
        trickle();
        scheduleTrickle();
      }, delay);
      this.timers.push(timer);
    };
    scheduleTrickle();

    const plop = () => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const freq = 250 + Math.random() * 350;
      osc.frequency.setValueAtTime(freq * 2, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(dest);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    };

    const schedulePlop = () => {
      const delay = 3000 + Math.random() * 6000;
      const timer = setTimeout(() => {
        plop();
        schedulePlop();
      }, delay);
      this.timers.push(timer);
    };
    schedulePlop();
  }

  // Birds with random panning, 20-40s interval
  private scheduleBirds(dest: AudioNode) {
    const createBirdPhrase = () => {
      if (!this.ctx) return;
      const baseFreq = 2200 + Math.random() * 1200;
      const pattern = Math.floor(Math.random() * 3);

      // Random pan ±25%
      const pan = (Math.random() * 0.5 - 0.25);
      const panner = this.ctx.createStereoPanner();
      panner.pan.value = pan;

      const chirp = (freq: number, delay: number, duration: number) => {
        const timer = setTimeout(() => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(freq * 1.12, this.ctx.currentTime + duration * 0.5);
          osc.frequency.exponentialRampToValueAtTime(freq * 0.95, this.ctx.currentTime + duration);
          gain.gain.setValueAtTime(0.005, this.ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.006, this.ctx.currentTime + duration * 0.3);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
          osc.connect(gain);
          gain.connect(panner);
          osc.start();
          osc.stop(this.ctx.currentTime + duration + 0.05);
        }, delay);
        this.timers.push(timer);
      };

      if (pattern === 0) {
        chirp(baseFreq, 0, 0.1);
        chirp(baseFreq * 1.08, 140, 0.1);
      } else if (pattern === 1) {
        chirp(baseFreq, 0, 0.08);
        chirp(baseFreq * 1.06, 110, 0.08);
        chirp(baseFreq * 1.12, 220, 0.09);
      } else {
        for (let i = 0; i < 3; i++) {
          chirp(baseFreq + (i % 2) * 80, i * 75, 0.05);
        }
      }

      panner.connect(dest);

      // 20-40 seconds between phrases
      const nextTimer = setTimeout(createBirdPhrase, 20000 + Math.random() * 20000);
      this.timers.push(nextTimer);
    };

    const startTimer = setTimeout(createBirdPhrase, 5000 + Math.random() * 5000);
    this.timers.push(startTimer);
  }

  // Bell chime — centered, 60-90s interval
  private scheduleChime(dest: AudioNode) {
    const chime = () => {
      if (!this.ctx) return;
      const freqs = [1046.5, 1318.5, 1568];
      const freq = freqs[Math.floor(Math.random() * freqs.length)];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.006, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 2.5);
      osc.connect(gain);
      gain.connect(dest);
      osc.start();
      osc.stop(this.ctx.currentTime + 3);

      // 60-90 seconds between chimes
      const nextTimer = setTimeout(chime, 60000 + Math.random() * 30000);
      this.timers.push(nextTimer);
    };

    const startTimer = setTimeout(chime, 12000);
    this.timers.push(startTimer);
  }

  // Smooth fade out over 0.8s
  stop() {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;
    this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.8);
    this.oscillators.forEach(o => { try { o.stop(this.ctx!.currentTime + 1); } catch { /* already stopped */ } });
    this.oscillators = [];
    const ctx = this.ctx;
    setTimeout(() => { ctx.close(); }, 1200);
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

const AmbientSound = forwardRef<{ start: () => void }, { autoStart?: boolean }>(
  function AmbientSound({ autoStart = true }, ref) {
    const [isPlaying, setIsPlaying] = useState(() => {
      const muted = localStorage.getItem(MUTE_KEY);
      return muted !== "true";
    });
    const engineRef = useRef<AmbientEngine | null>(null);

    useImperativeHandle(ref, () => ({
      start: () => {
        const muted = localStorage.getItem(MUTE_KEY);
        if (muted === "true") return;
        if (!engineRef.current) {
          engineRef.current = new AmbientEngine();
        }
        engineRef.current.start();
        setIsPlaying(true);
      },
    }));

    useEffect(() => {
      if (autoStart && !engineRef.current) {
        const muted = localStorage.getItem(MUTE_KEY);
        if (muted !== "true") {
          engineRef.current = new AmbientEngine();
          engineRef.current.start();
          setIsPlaying(true);
        }
      }
    }, [autoStart]);

    // Resume after tab switch
    useEffect(() => {
      const handleVisibility = () => {
        if (document.visibilityState === "visible" && isPlaying && engineRef.current && !engineRef.current["isPlaying"]) {
          engineRef.current.start();
        }
      };
      document.addEventListener("visibilitychange", handleVisibility);
      return () => document.removeEventListener("visibilitychange", handleVisibility);
    }, [isPlaying]);

    const toggle = useCallback(() => {
      if (!engineRef.current) {
        engineRef.current = new AmbientEngine();
      }
      engineRef.current.toggle();
      setIsPlaying(prev => {
        const next = !prev;
        localStorage.setItem(MUTE_KEY, String(!next));
        return next;
      });
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
);

export default AmbientSound;
