/**
 * Generative Web Audio score — no external files.
 * Soft drone + filtered air + chapter transition bells.
 */

type AudioHandles = {
  ctx: AudioContext;
  master: GainNode;
  drone: OscillatorNode;
  droneGain: GainNode;
  noiseGain: GainNode;
  started: boolean;
};

let handles: AudioHandles | null = null;

function createNoiseBuffer(ctx: AudioContext) {
  const len = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

export function getJourneyAudio() {
  const ensure = async () => {
    if (handles?.started) return handles;

    const ctx = handles?.ctx ?? new AudioContext();
    if (ctx.state === "suspended") await ctx.resume();

    const master = ctx.createGain();
    master.gain.value = 0.22;
    master.connect(ctx.destination);

    // Warm drone
    const drone = ctx.createOscillator();
    drone.type = "sine";
    drone.frequency.value = 55;
    const drone2 = ctx.createOscillator();
    drone2.type = "sine";
    drone2.frequency.value = 82.5;
    const droneGain = ctx.createGain();
    droneGain.gain.value = 0.35;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 280;
    drone.connect(droneGain);
    drone2.connect(droneGain);
    droneGain.connect(filter);
    filter.connect(master);

    // Soft noise bed
    const noise = ctx.createBufferSource();
    noise.buffer = createNoiseBuffer(ctx);
    noise.loop = true;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.value = 600;
    noiseFilter.Q.value = 0.6;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.04;
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(master);

    drone.start();
    drone2.start();
    noise.start();

    handles = { ctx, master, drone, droneGain, noiseGain, started: true };
    // keep drone2 alive via closure on handles path — attach to handles via master graph only
    (handles as AudioHandles & { drone2?: OscillatorNode }).drone2 = drone2;
    return handles;
  };

  const setMuted = (muted: boolean) => {
    if (!handles) return;
    handles.master.gain.setTargetAtTime(muted ? 0 : 0.22, handles.ctx.currentTime, 0.08);
  };

  const setIntensity = (t: number) => {
    if (!handles?.started) return;
    const { ctx, drone, droneGain, noiseGain } = handles;
    const now = ctx.currentTime;
    drone.frequency.setTargetAtTime(48 + t * 40, now, 0.4);
    droneGain.gain.setTargetAtTime(0.25 + t * 0.2, now, 0.3);
    noiseGain.gain.setTargetAtTime(0.03 + t * 0.05, now, 0.3);
  };

  /** Short bell / whoosh on chapter change */
  const playChapterCue = () => {
    if (!handles?.started) return;
    const { ctx, master } = handles;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.8);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.18, now + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);

    const f = ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.setValueAtTime(2400, now);
    f.frequency.exponentialRampToValueAtTime(400, now + 0.9);

    osc.connect(f);
    f.connect(g);
    g.connect(master);
    osc.start(now);
    osc.stop(now + 1.2);
  };

  return { ensure, setMuted, setIntensity, playChapterCue };
}
