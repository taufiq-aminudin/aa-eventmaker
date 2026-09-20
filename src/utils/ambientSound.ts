// Web Audio API generator for ambient event melodies & tactile sound effects
// 100% client-side, zero external files, works offline in PWA

class SoundManager {
  private ctx: AudioContext | null = null;
  private isPlayingAmbient = false;
  private ambientInterval: number | null = null;
  private masterGain: GainNode | null = null;

  private init() {
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a soft pleasant bell/chime note
  playChime(freq: number, duration = 1.2, gainValue = 0.12) {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    try {
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      noteGain.gain.setValueAtTime(gainValue, this.ctx.currentTime);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(noteGain);
      noteGain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  // Celebratory sound for check-in or milestone
  playCheckInSuccess() {
    this.init();
    // Two ascending pleasant notes (G5 -> C6)
    setTimeout(() => this.playChime(783.99, 0.8, 0.15), 0);
    setTimeout(() => this.playChime(1046.5, 1.4, 0.2), 160);
  }

  // Soft click / tap feedback
  playTapSound() {
    this.playChime(523.25, 0.25, 0.04);
  }

  // Gentle pentatonic ambient music loop for wedding & gala events
  toggleAmbientMelody(): boolean {
    this.init();
    if (this.isPlayingAmbient) {
      this.stopAmbientMelody();
      return false;
    } else {
      this.startAmbientMelody();
      return true;
    }
  }

  isAmbientPlaying(): boolean {
    return this.isPlayingAmbient;
  }

  private startAmbientMelody() {
    this.isPlayingAmbient = true;
    // Pentatonic scale frequencies (C, D, E, G, A, C5, D5, E5, G5)
    const scale = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25, 783.99];
    let step = 0;

    // Play an initial chord
    this.playChime(scale[0], 2.5, 0.08);
    this.playChime(scale[2], 2.5, 0.06);
    this.playChime(scale[4], 3.0, 0.05);

    this.ambientInterval = window.setInterval(() => {
      if (!this.isPlayingAmbient) return;
      const note = scale[step % scale.length];
      const harmonyNote = scale[(step + 2) % scale.length];
      this.playChime(note, 2.0, 0.07);
      if (step % 2 === 0) {
        this.playChime(harmonyNote, 2.4, 0.05);
      }
      step = (step + Math.floor(Math.random() * 3) + 1) % scale.length;
    }, 1800);
  }

  private stopAmbientMelody() {
    this.isPlayingAmbient = false;
    if (this.ambientInterval !== null) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
  }
}

export const soundManager = new SoundManager();
