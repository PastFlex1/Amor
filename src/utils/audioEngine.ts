/**
 * Romantic Melodic Web Audio Engine
 * Generates delicate acoustic piano and music box arpeggios in the browser.
 */

type MelodyTune = 'canon' | 'lullaby' | 'romanticWaltz' | 'gentleRiver';

class RomanticAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timerId: number | null = null;
  private currentStep: number = 0;
  private volume: number = 0.5;
  private activeTune: MelodyTune = 'canon';

  // Frequencies (Hz) for notes
  private readonly NOTE_FREQS: Record<string, number> = {
    C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
    C6: 1046.50
  };

  // Melody patterns: note, duration in beats, chord bass
  private readonly CANON_SEQUENCE: Array<{ notes: string[]; bass?: string; duration: number }> = [
    { notes: ['E5', 'G4', 'C4'], bass: 'C3', duration: 0.75 },
    { notes: ['G5'], duration: 0.35 },
    { notes: ['D5', 'F4', 'B3'], bass: 'G3', duration: 0.75 },
    { notes: ['F5'], duration: 0.35 },
    { notes: ['C5', 'E4', 'A3'], bass: 'A3', duration: 0.75 },
    { notes: ['E5'], duration: 0.35 },
    { notes: ['B4', 'D4', 'G3'], bass: 'E3', duration: 0.75 },
    { notes: ['D5'], duration: 0.35 },
    { notes: ['A4', 'C4', 'F3'], bass: 'F3', duration: 0.75 },
    { notes: ['C5'], duration: 0.35 },
    { notes: ['G4', 'B3', 'E3'], bass: 'C3', duration: 0.75 },
    { notes: ['B4'], duration: 0.35 },
    { notes: ['A4', 'C4', 'F3'], bass: 'F3', duration: 0.75 },
    { notes: ['D5'], duration: 0.35 },
    { notes: ['B4', 'D4', 'G3'], bass: 'G3', duration: 0.75 },
    { notes: ['C5'], duration: 0.45 },
  ];

  private readonly RIVER_SEQUENCE: Array<{ notes: string[]; bass?: string; duration: number }> = [
    { notes: ['A4', 'C5', 'E5'], bass: 'A3', duration: 0.6 },
    { notes: ['E5'], duration: 0.3 },
    { notes: ['G5'], duration: 0.5 },
    { notes: ['F4', 'A4', 'D5'], bass: 'F3', duration: 0.6 },
    { notes: ['D5'], duration: 0.3 },
    { notes: ['F5'], duration: 0.5 },
    { notes: ['G4', 'B4', 'E5'], bass: 'E3', duration: 0.6 },
    { notes: ['E5'], duration: 0.3 },
    { notes: ['G5'], duration: 0.5 },
    { notes: ['C4', 'E4', 'G4', 'C5'], bass: 'C3', duration: 0.9 },
  ];

  private readonly WALTZ_SEQUENCE: Array<{ notes: string[]; bass?: string; duration: number }> = [
    { notes: ['C4'], bass: 'C3', duration: 0.4 },
    { notes: ['E4', 'G4'], duration: 0.3 },
    { notes: ['E4', 'G4', 'C5'], duration: 0.4 },
    { notes: ['A3'], bass: 'A3', duration: 0.4 },
    { notes: ['C4', 'E4'], duration: 0.3 },
    { notes: ['C4', 'E4', 'A4'], duration: 0.4 },
    { notes: ['F3'], bass: 'F3', duration: 0.4 },
    { notes: ['A3', 'C4'], duration: 0.3 },
    { notes: ['A3', 'C4', 'F4'], duration: 0.4 },
    { notes: ['G3'], bass: 'G3', duration: 0.4 },
    { notes: ['B3', 'D4'], duration: 0.3 },
    { notes: ['B3', 'D4', 'G4'], duration: 0.4 },
  ];

  public init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
  }

  public setTune(tune: MelodyTune) {
    this.activeTune = tune;
    this.currentStep = 0;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public async play(): Promise<boolean> {
    this.init();
    if (!this.ctx) return false;

    if (this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch (e) {
        console.warn('AudioContext resume failed:', e);
      }
    }

    this.isPlaying = true;
    this.scheduleNextNote();
    return true;
  }

  public pause() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  private scheduleNextNote() {
    if (!this.isPlaying || !this.ctx) return;

    let seq = this.CANON_SEQUENCE;
    if (this.activeTune === 'gentleRiver') seq = this.RIVER_SEQUENCE;
    if (this.activeTune === 'romanticWaltz') seq = this.WALTZ_SEQUENCE;

    const item = seq[this.currentStep % seq.length];
    const now = this.ctx.currentTime;

    // Play chord notes
    item.notes.forEach((noteStr, idx) => {
      this.playPianoTone(noteStr, now + idx * 0.02, 1.8, 0.22 * this.volume);
    });

    // Play bass note if specified
    if (item.bass) {
      this.playBassTone(item.bass, now, 2.5, 0.3 * this.volume);
    }

    this.currentStep++;
    const stepDurationMs = item.duration * 750;

    this.timerId = window.setTimeout(() => {
      this.scheduleNextNote();
    }, stepDurationMs);
  }

  private playPianoTone(note: string, time: number, duration: number, gainVal: number) {
    if (!this.ctx) return;
    const freq = this.NOTE_FREQS[note] || 440;

    // Master envelope
    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0.0001, time);
    // Instant soft attack
    gainNode.gain.exponentialRampToValueAtTime(gainVal, time + 0.04);
    // Exponential warm decay
    gainNode.gain.exponentialRampToValueAtTime(gainVal * 0.4, time + 0.4);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, time + duration);

    // Warm filter for acoustic tone
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, time);
    filter.frequency.exponentialRampToValueAtTime(400, time + duration);

    // Dual oscillator for rich piano harmonics
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, time);

    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, time);

    const osc2Gain = this.ctx.createGain();
    osc2Gain.gain.setValueAtTime(0.2, time);

    osc1.connect(filter);
    osc2.connect(osc2Gain);
    osc2Gain.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + duration);
    osc2.stop(time + duration);
  }

  private playBassTone(note: string, time: number, duration: number, gainVal: number) {
    if (!this.ctx) return;
    const freq = this.NOTE_FREQS[note] || 130.81;

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0.0001, time);
    gainNode.gain.exponentialRampToValueAtTime(gainVal, time + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, time + duration);

    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(350, time);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start(time);
    osc.stop(time + duration);
  }

  public playPageFlip() {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.1);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(250, this.ctx.currentTime + 0.1);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();
    } catch {
      // Audio might be blocked before first interaction
    }
  }
}

export const audioEngine = new RomanticAudioEngine();
