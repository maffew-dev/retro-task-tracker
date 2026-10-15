// Web Audio API Retro 8-bit Procedural Sound Synthesizer
// Completely self-contained, no external mp3/wav files required

class RetroAudioEngine {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  // 1. Crisp UI Button Click (Square wave tick)
  public playClick() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // 2. Drag Pickup (Subtle pitch rise)
  public playPickup() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(540, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // 3. Drag Drop (Chunky retro thud)
  public playDrop() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.09);

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // 4. Task Complete (Classic 8-bit coin chime: B5 -> E6 arpeggio)
  public playComplete() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [987.77, 1318.51]; // B5, E6
      const duration = 0.09;

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now + idx * duration);

        gain.gain.setValueAtTime(0.12, now + idx * duration);
        gain.gain.exponentialRampToValueAtTime(0.001, now + (idx + 1) * duration + 0.1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * duration);
        osc.stop(now + (idx + 1) * duration + 0.12);
      });
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // 5. Level Up / Victory Fanfare (Arcade triumphant 4-note chord)
  public playLevelUp() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // C5, E5, G5, C6
      const notes = [523.25, 659.25, 783.99, 1046.50];
      const noteDuration = 0.11;

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * noteDuration);

        const holdTime = idx === notes.length - 1 ? 0.35 : noteDuration;
        gain.gain.setValueAtTime(0.15, now + idx * noteDuration);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * noteDuration + holdTime);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * noteDuration);
        osc.stop(now + idx * noteDuration + holdTime + 0.05);
      });
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // 6. Pomodoro Digital Watch Beep
  public playPomodoroDing() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const beeps = [2000, 2000];

      beeps.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.18);

        gain.gain.setValueAtTime(0.16, now + idx * 0.18);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.18 + 0.1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.18);
        osc.stop(now + idx * 0.18 + 0.12);
      });
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // 7. Delete / Cancel (Descending buzz)
  public playDelete() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(120, this.ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.16);
    } catch {
      // Audio autoplay policy fallback
    }
  }
}

export const retroAudio = new RetroAudioEngine();
