// Web Audio API ambient melody synthesizer & audio helper
// Plays soft, elegant romantic arpeggios using browser AudioContext without requiring external MP3 downloads

class AmbientMusicPlayer {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timerId: any = null;
  private currentTrack: string = 'romance';
  private onStateChange: ((playing: boolean) => void) | null = null;

  // Chord notes (frequencies in Hz)
  private tracks: Record<string, { name: string; chords: number[][] }> = {
    romance: {
      name: 'Harmoni Romantis (Acoustic Piano)',
      chords: [
        [261.63, 329.63, 392.0, 523.25], // C Major
        [220.0, 261.63, 329.63, 440.0],  // A Minor
        [174.61, 220.0, 261.63, 349.23], // F Major
        [196.0, 246.94, 293.66, 392.0],  // G Major
      ],
    },
    gamelan: {
      name: 'Gamelan Pelog Halus (Tradisional)',
      chords: [
        [293.66, 349.23, 440.0, 587.33], // D minor / Pelog style
        [261.63, 329.63, 392.0, 523.25],
        [329.63, 392.0, 493.88, 659.25],
        [220.0, 293.66, 349.23, 440.0],
      ],
    },
    celebration: {
      name: 'Pesta Ceria (Festive Joy)',
      chords: [
        [392.0, 493.88, 587.33, 783.99], // G Major upbeat
        [329.63, 392.0, 493.88, 659.25], // E minor
        [261.63, 329.63, 392.0, 523.25], // C Major
        [293.66, 369.99, 440.0, 587.33], // D Major
      ],
    },
  };

  public getTracks() {
    return Object.entries(this.tracks).map(([key, val]) => ({
      key,
      name: val.name,
    }));
  }

  public setTrack(trackKey: string) {
    if (this.tracks[trackKey]) {
      this.currentTrack = trackKey;
      if (this.isPlaying) {
        this.stop();
        this.start();
      }
    }
  }

  public getCurrentTrackName(): string {
    return this.tracks[this.currentTrack]?.name || 'Harmoni Romantis';
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public subscribe(cb: (playing: boolean) => void) {
    this.onStateChange = cb;
  }

  public start() {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!this.ctx) {
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      this.isPlaying = true;
      if (this.onStateChange) this.onStateChange(true);

      const track = this.tracks[this.currentTrack] || this.tracks.romance;
      let chordIndex = 0;
      let noteIndex = 0;

      const playNextNote = () => {
        if (!this.isPlaying || !this.ctx) return;

        const currentChord = track.chords[chordIndex];
        const freq = currentChord[noteIndex];

        // Soft sine wave oscillator for romantic bell / harp sound
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        // Soft attack and natural decay
        const now = this.ctx.currentTime;
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.07, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 1.2);

        // Advance note
        noteIndex = (noteIndex + 1) % currentChord.length;
        if (noteIndex === 0) {
          chordIndex = (chordIndex + 1) % track.chords.length;
        }

        this.timerId = setTimeout(playNextNote, 420);
      };

      playNextNote();
    } catch (e) {
      console.warn('AudioContext playback prevented or not supported', e);
      this.isPlaying = false;
      if (this.onStateChange) this.onStateChange(false);
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.onStateChange) this.onStateChange(false);
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }
}

export const globalAudioPlayer = new AmbientMusicPlayer();
