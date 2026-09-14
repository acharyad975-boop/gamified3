// Procedural Web Audio API Sound Synthesizer (Zero external dependencies)
class SoundSystem {
  constructor() {
    this.ctx = null;
    this.enabled = localStorage.getItem('adaptivecs_sound_enabled') !== 'false';
    this.volume = parseFloat(localStorage.getItem('adaptivecs_sound_volume') || '0.35');
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  toggleSound() {
    this.enabled = !this.enabled;
    localStorage.setItem('adaptivecs_sound_enabled', this.enabled);
    return this.enabled;
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    localStorage.setItem('adaptivecs_sound_volume', this.volume);
  }

  playTone(freq, type = 'sine', duration = 0.1, delay = 0) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);

      gain.gain.setValueAtTime(this.volume * 0.5, this.ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + delay + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + delay);
      osc.stop(this.ctx.currentTime + delay + duration);
    } catch (e) {
      // Audio autoplay policy fail-safe
    }
  }

  playStep() {
    this.playTone(320, 'triangle', 0.05);
  }

  playClick() {
    this.playTone(440, 'sine', 0.04);
  }

  playCoin() {
    this.playTone(587.33, 'sine', 0.08); // D5
    this.playTone(880, 'sine', 0.12, 0.06); // A5
  }

  playCorrect() {
    this.playTone(523.25, 'triangle', 0.1); // C5
    this.playTone(659.25, 'triangle', 0.1, 0.08); // E5
    this.playTone(783.99, 'triangle', 0.18, 0.16); // G5
  }

  playError() {
    this.playTone(220, 'sawtooth', 0.15);
    this.playTone(180, 'sawtooth', 0.2, 0.1);
  }

  playLevelComplete() {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'triangle', 0.18, idx * 0.09);
    });
  }
}

export const sounds = new SoundSystem();
export default sounds;
