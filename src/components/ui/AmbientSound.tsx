import { useState, useRef, useCallback, useEffect, forwardRef, useImperativeHandle } from "react";

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

    // Master compressor for smooth output
    const compressor = this.ctx.createDynamicsCompressor();
    compressor.threshold.value = -20;
    compressor.ratio.value = 4;
    compressor.connect(this.masterGain);

    this.playTanpura(compressor);
    this.playBreeze(compressor);
    this.playFountain(compressor);
    this.scheduleBirds(compressor);
    this.scheduleChime(compressor);

    // Slow fade in
    this.masterGain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 5);
    this.isPlaying = true;
  }

  // Rich tanpura drone with harmonics
  private playTanpura(dest: AudioNode) {
    if (!this.ctx) return;

    const createString = (fundamental: number, detune: number) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = "sawtooth";
      osc.frequency.value = fundamental;
      osc.detune.value = detune;

      // Warm filter
      filter.type = "lowpass";
      filter.frequency.value = 800;
      filter.Q.value = 0.7;

      gain.gain.value = 0.012;

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(dest);
      osc.start();
      this.oscillators.push(osc);

      // Jwari shimmer — slow amplitude modulation
      const jwari = this.ctx.createOscillator();
      const jwariGain = this.ctx.createGain();
      jwari.frequency.value = 0.15 + Math.random() * 0.1;
      jwariGain.gain.value = 0.003;
      jwari.connect(jwariGain);
      jwariGain.connect(gain.gain);
      jwari.start();
      this.oscillators.push(jwari);
    };

    // Sa-Pa-Sa (C3-G3-C4) with slight detuning for warmth
    createString(130.81, -3);
    createString(130.81, 3);
    createString(196.00, -2);
    createString(261.63, 0);
  }

  // Soft wind — layered brown noise
  private playBreeze(dest: AudioNode) {
    if (!this.ctx) return;

    const createBrownNoise = () => {
      if (!this.ctx) return { buffer: null as AudioBuffer | null, source: null as AudioBufferSourceNode | null };
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

      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      return { buffer, source };
    };

    // Layer 1 — deep rumble
    const { source: s1 } = createBrownNoise();
    if (s1) {
      const f1 = this.ctx.createBiquadFilter();
      f1.type = "lowpass";
      f1.frequency.value = 200;
      const g1 = this.ctx.createGain();
      g1.gain.value = 0.025;
      s1.connect(f1);
      f1.connect(g1);
      g1.connect(dest);
      s1.start();
    }

    // Layer 2 — mid breeze
    const { source: s2 } = createBrownNoise();
    if (s2) {
      const f2 = this.ctx.createBiquadFilter();
      f2.type = "bandpass";
      f2.frequency.value = 400;
      f2.Q.value = 0.4;
      const g2 = this.ctx.createGain();
      g2.gain.value = 0.015;

      // Slow sweep
      const lfo = this.ctx.createOscillator();
      const lfoG = this.ctx.createGain();
      lfo.frequency.value = 0.06;
      lfoG.gain.value = 150;
      lfo.connect(lfoG);
      lfoG.connect(f2.frequency);
      lfo.start();

      s2.connect(f2);
      f2.connect(g2);
      g2.connect(dest);
      s2.start();
    }
  }

  // Fountain — gentle water sounds
  private playFountain(dest: AudioNode) {
    if (!this.ctx) return;

    // Continuous trickle
    const trickle = () => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 1800 + Math.random() * 800;
      gain.gain.setValueAtTime(0.004, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(dest);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    };

    const scheduleTrickle = () => {
      const delay = 400 + Math.random() * 800;
      const timer = setTimeout(() => {
        trickle();
        scheduleTrickle();
      }, delay);
      this.timers.push(timer);
    };
    scheduleTrickle();

    // Occasional plop
    const plop = () => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      const freq = 300 + Math.random() * 400;
      osc.frequency.setValueAtTime(freq * 2, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(dest);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    };

    const schedulePlop = () => {
      const delay = 2000 + Math.random() * 5000;
      const timer = setTimeout(() => {
        plop();
        schedulePlop();
      }, delay);
      this.timers.push(timer);
    };
    schedulePlop();
  }

  // Bird chirps — natural patterns
  private scheduleBirds(dest: AudioNode) {
    const createBirdPhrase = () => {
      if (!this.ctx) return;
      const baseFreq = 2200 + Math.random() * 1200;
      const pattern = Math.floor(Math.random() * 3);

      const chirp = (freq: number, delay: number, duration: number) => {
        const timer = setTimeout(() => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(freq * 1.15, this.ctx.currentTime + duration * 0.5);
          osc.frequency.exponentialRampToValueAtTime(freq * 0.95, this.ctx.currentTime + duration);
          gain.gain.setValueAtTime(0.006, this.ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.008, this.ctx.currentTime + duration * 0.3);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
          osc.connect(gain);
          gain.connect(dest);
          osc.start();
          osc.stop(this.ctx.currentTime + duration + 0.05);
        }, delay);
        this.timers.push(timer);
      };

      if (pattern === 0) {
        // Simple two-note
        chirp(baseFreq, 0, 0.1);
        chirp(baseFreq * 1.1, 150, 0.1);
      } else if (pattern === 1) {
        // Three-note ascending
        chirp(baseFreq, 0, 0.08);
        chirp(baseFreq * 1.08, 120, 0.08);
        chirp(baseFreq * 1.15, 240, 0.1);
      } else {
        // Quick trill
        for (let i = 0; i < 4; i++) {
          chirp(baseFreq + (i % 2) * 100, i * 80, 0.06);
        }
      }

      const nextTimer = setTimeout(createBirdPhrase, 10000 + Math.random() * 20000);
      this.timers.push(nextTimer);
    };

    const startTimer = setTimeout(createBirdPhrase, 4000 + Math.random() * 6000);
    this.timers.push(startTimer);
  }

  // Soft bell chime
  private scheduleChime(dest: AudioNode) {
    const chime = () => {
      if (!this.ctx) return;
      const freqs = [1046.5, 1318.5, 1568, 2093]; // C6, E6, G6, C7
      const freq = freqs[Math.floor(Math.random() * freqs.length)];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.008, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 2);
      osc.connect(gain);
      gain.connect(dest);
      osc.start();
      osc.stop(this.ctx.currentTime + 2.5);

      const nextTimer = setTimeout(chime, 25000 + Math.random() * 20000);
      this.timers.push(nextTimer);
    };

    const startTimer = setTimeout(chime, 8000);
    this.timers.push(startTimer);
  }

  stop() {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;
    this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 3);
    this.oscillators.forEach(o => { try { o.stop(); } catch { /* already stopped */ } });
    this.oscillators = [];
    const ctx = this.ctx;
    setTimeout(() => { ctx.close(); }, 3500);
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
    const [isPlaying, setIsPlaying] = useState(false);
    const engineRef = useRef<AmbientEngine | null>(null);

    useImperativeHandle(ref, () => ({
      start: () => {
        if (!engineRef.current) {
          engineRef.current = new AmbientEngine();
        }
        engineRef.current.start();
        setIsPlaying(true);
      },
    }));

    useEffect(() => {
      if (autoStart && !engineRef.current) {
        engineRef.current = new AmbientEngine();
        engineRef.current.start();
        setIsPlaying(true);
      }
    }, [autoStart]);

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
);

export default AmbientSound;
