/**
 * Spatial Audio Engine for 3D Wedding Experience
 *
 * Utilizes the Web Audio API with a 3D HRTF (Head-Related Transfer Function) PannerNode
 * to position audio in full 3D binaural space. As the user tilts their mobile device,
 * the acoustic origin moves in real-time across the listener's stereo field.
 */

class SpatialAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private panner: PannerNode | null = null;
  private isRunning: boolean = false;
  private droneOscillators: { osc: OscillatorNode; gain: GainNode }[] = [];
  private chimeTimer: number | null = null;

  private initContext() {
    if (this.ctx) return;

    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();

    // Master volume gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);

    // 3D HRTF Panner for realistic binaural acoustic spatialization
    this.panner = this.ctx.createPanner();
    this.panner.panningModel = "HRTF";
    this.panner.distanceModel = "inverse";
    this.panner.refDistance = 1;
    this.panner.maxDistance = 10000;
    this.panner.rolloffFactor = 1;
    this.panner.coneInnerAngle = 360;

    // Default position: centered, slightly in front
    this.panner.positionX.setValueAtTime(0, this.ctx.currentTime);
    this.panner.positionY.setValueAtTime(0, this.ctx.currentTime);
    this.panner.positionZ.setValueAtTime(-1.5, this.ctx.currentTime);

    // Route: Generator -> Panner -> MasterGain -> Destination
    this.panner.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);
  }

  /**
   * Starts the 3D Indian wedding celestial acoustic drone (Tanpura resonance & temple chimes)
   */
  public async start(): Promise<boolean> {
    this.initContext();
    if (!this.ctx || !this.masterGain || !this.panner) return false;

    if (this.ctx.state === "suspended") {
      await this.ctx.resume();
    }

    if (this.isRunning) return true;
    this.isRunning = true;

    // Fade in master
    this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(0.42, this.ctx.currentTime + 2.0);

    // Tanpura D3 / Pancham tuning (D - A - D - D)
    const frequencies = [
      { f: 146.83, type: "sawtooth" as OscillatorType, vol: 0.08 }, // Sa (D3)
      { f: 220.0, type: "sine" as OscillatorType, vol: 0.12 },     // Pa (A3)
      { f: 293.66, type: "sine" as OscillatorType, vol: 0.09 },    // Sa' (D4)
      { f: 440.0, type: "triangle" as OscillatorType, vol: 0.05 }, // Pa' (A4)
      { f: 587.33, type: "sine" as OscillatorType, vol: 0.03 },    // Sa'' (D5)
    ];

    // Warm resonant low-pass filter
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(540, this.ctx.currentTime);
    filter.Q.setValueAtTime(3.5, this.ctx.currentTime);
    filter.connect(this.panner);

    // Subtle gentle breath LFO on filter frequency
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(0.18, this.ctx.currentTime); // ~5 second gentle breath
    lfoGain.gain.setValueAtTime(140, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    // Create acoustic drone voices
    this.droneOscillators = frequencies.map(({ f, type, vol }) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(f + (Math.random() - 0.5) * 0.6, this.ctx!.currentTime);

      gain.gain.setValueAtTime(0.001, this.ctx!.currentTime);
      gain.gain.linearRampToValueAtTime(vol, this.ctx!.currentTime + 2.5);

      osc.connect(gain);
      gain.connect(filter);
      osc.start();

      return { osc, gain };
    });

    // Schedule ambient spatial temple bell sparkle every 6-9 seconds
    this.scheduleNextChime();

    return true;
  }

  /**
   * Schedule soothing random temple chimes floating across 3D space
   */
  private scheduleNextChime() {
    if (!this.isRunning) return;
    const delay = 5000 + Math.random() * 4500;
    this.chimeTimer = window.setTimeout(() => {
      if (this.isRunning) {
        const panX = (Math.random() - 0.5) * 2;
        this.playSpatialChime(panX);
        this.scheduleNextChime();
      }
    }, delay);
  }

  /**
   * Plays a crystalline, meditative spatial temple chime at a specific 3D coordinate
   */
  public playSpatialChime(panX: number = 0) {
    if (!this.ctx || !this.isRunning || !this.masterGain) return;

    // Create dedicated panner for this chime
    const chimePanner = this.ctx.createPanner();
    chimePanner.panningModel = "HRTF";
    chimePanner.positionX.setValueAtTime(panX * 2, this.ctx.currentTime);
    chimePanner.positionY.setValueAtTime(0.5, this.ctx.currentTime);
    chimePanner.positionZ.setValueAtTime(-1.2, this.ctx.currentTime);
    chimePanner.connect(this.masterGain);

    // Pentatonic scale note (D, E, F#, A, B)
    const notes = [587.33, 659.25, 739.99, 880.0, 987.77, 1174.66];
    const freq = notes[Math.floor(Math.random() * notes.length)];

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);

    // Bell envelope: sharp strike, lingering singing resonance
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

    osc.connect(gain);
    gain.connect(chimePanner);

    osc.start(now);
    osc.stop(now + 4.0);
  }

  /**
   * Dynamically shifts the 3D acoustic soundstage when user tilts the phone or moves cursor
   * @param normX -1 (left tilt) to +1 (right tilt)
   * @param normY -1 (upward tilt) to +1 (downward tilt)
   */
  public updateSpatialPan(normX: number, normY: number) {
    if (!this.ctx || !this.panner || !this.isRunning) return;

    // As phone tilts to the right, acoustic stage rotates spatially in counter perspective
    const targetX = normX * 2.8;
    const targetY = normY * 1.6;
    const targetZ = -1.5 + Math.abs(normX) * 0.4;

    const t = this.ctx.currentTime;
    this.panner.positionX.setTargetAtTime(targetX, t, 0.08);
    this.panner.positionY.setTargetAtTime(targetY, t, 0.08);
    this.panner.positionZ.setTargetAtTime(targetZ, t, 0.08);
  }

  /**
   * Stops the spatial audio engine
   */
  public stop() {
    if (!this.ctx || !this.masterGain) return;
    this.isRunning = false;

    if (this.chimeTimer) {
      clearTimeout(this.chimeTimer);
      this.chimeTimer = null;
    }

    // Gentle fade out
    this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);

    setTimeout(() => {
      this.droneOscillators.forEach(({ osc }) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // ignore already stopped
        }
      });
      this.droneOscillators = [];
    }, 1300);
  }

  public getStatus(): boolean {
    return this.isRunning;
  }
}

export const spatialAudio = new SpatialAudioEngine();
