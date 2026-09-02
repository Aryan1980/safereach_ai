/**
 * High-decibel Safety Siren & Beacon using Web Audio API
 * Generates an alternating frequency police/emergency siren directly in the browser.
 */

class AudioSirenManager {
  private audioCtx: AudioContext | null = null;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private intervalId: NodeJS.Timeout | null = null;
  private isPlaying: boolean = false;

  public start(): boolean {
    if (this.isPlaying) return true;

    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioContextClass();

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
      this.gainNode.connect(this.audioCtx.destination);

      this.osc1 = this.audioCtx.createOscillator();
      this.osc2 = this.audioCtx.createOscillator();

      this.osc1.type = 'sawtooth';
      this.osc2.type = 'sine';

      this.osc1.connect(this.gainNode);
      this.osc2.connect(this.gainNode);

      let toggle = false;
      const step = () => {
        if (!this.audioCtx || !this.osc1 || !this.osc2) return;
        const now = this.audioCtx.currentTime;
        const freq1 = toggle ? 960 : 770;
        const freq2 = toggle ? 1200 : 880;

        this.osc1.frequency.setTargetAtTime(freq1, now, 0.08);
        this.osc2.frequency.setTargetAtTime(freq2, now, 0.08);
        toggle = !toggle;
      };

      step();
      this.intervalId = setInterval(step, 400);

      this.osc1.start();
      this.osc2.start();
      this.isPlaying = true;
      return true;
    } catch (e) {
      console.error('Failed to initialize emergency audio siren:', e);
      return false;
    }
  }

  public stop(): void {
    if (!this.isPlaying) return;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    try {
      if (this.osc1) {
        this.osc1.stop();
        this.osc1.disconnect();
        this.osc1 = null;
      }
      if (this.osc2) {
        this.osc2.stop();
        this.osc2.disconnect();
        this.osc2 = null;
      }
      if (this.gainNode) {
        this.gainNode.disconnect();
        this.gainNode = null;
      }
      if (this.audioCtx) {
        this.audioCtx.close();
        this.audioCtx = null;
      }
    } catch (e) {
      console.error('Error stopping siren audio:', e);
    }

    this.isPlaying = false;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const audioSiren = new AudioSirenManager();
