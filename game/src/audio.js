// audio.js — tiny WebAudio synth: every sound is generated, no audio files.
// A pop for a find, a buzz for a miss, a chime for a hint, a jingle for a win.

export class Sounds {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  ensure() {
    if (!this.enabled) return null;
    try {
      if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return this.ctx;
    } catch {
      return null;
    }
  }

  tone(freq, dur, type = 'sine', volume = 0.14, delay = 0) {
    const ctx = this.ensure();
    if (!ctx) return;
    const t0 = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(volume, t0 + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  find() {
    this.tone(659, 0.1, 'sine', 0.16);
    this.tone(988, 0.16, 'sine', 0.16, 0.07);
  }

  miss() {
    this.tone(150, 0.2, 'sawtooth', 0.07);
    this.tone(110, 0.22, 'sawtooth', 0.06, 0.03);
  }

  hint() {
    this.tone(1046, 0.18, 'sine', 0.1);
    this.tone(1318, 0.24, 'sine', 0.08, 0.1);
  }

  win() {
    [523, 659, 784, 1046].forEach((f, i) => this.tone(f, 0.22, 'triangle', 0.15, i * 0.1));
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}
