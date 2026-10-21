// Web Audio synthesis for the simulator. Everything is generated on the fly:
// no recorded audio, no voices. The AudioContext is created lazily on the
// first play() (which always follows a user gesture) and never when muted.

const DEFAULT_JINGLE = ['C4', 'E4', 'G4'];
const NOTE_HZ = { C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88, C5: 523.25 };

// Duration of each effect in ms. Reported by play() even when muted so the
// light can keep following the same timeline.
const DURATION = {
  'squelch-open': 170,
  'squelch-short': 120,
  click: 45,
  roger: 150,
  sent: 300,
  more: 240,
  jingle: 500,
  voice: 1300,
};

// Soft babble: a different pitch and syllable pattern per family member.
const VOICES = {
  abuela: { base: 232, pattern: [1, 1.12, 0.94, 1.2, 1.05, 0.9, 1.15, 0.98] },
  tio: { base: 128, pattern: [1, 0.9, 1.1, 0.85, 1.05, 1.2, 0.92, 1] },
  mama: { base: 188, pattern: [1, 1.08, 1.18, 0.96, 1.1, 0.88, 1.02, 0.94] },
};
const VOWELS = [[700, 1100], [500, 1700], [320, 2200], [450, 800], [600, 1300]];

function kindOf(effect) {
  const kind = effect.split(':')[0];
  return Object.prototype.hasOwnProperty.call(DURATION, kind) ? kind : null;
}

export function createAudio({ AudioContextClass } = {}) {
  const Ctor = AudioContextClass ?? (typeof window !== 'undefined' ? window.AudioContext || window.webkitAudioContext : undefined);
  let ctx = null;
  let master = null;
  let noise = null;
  let muted = false;
  let busyUntil = 0; // ms on the performance clock
  let sources = new Set(); // scheduled source nodes, so cancel() can stop them

  function track(src) {
    sources.add(src);
    src.onended = () => sources.delete(src);
    return src;
  }

  // iOS Safari keeps a context created outside a click/touchend suspended until
  // resume() runs inside one, so every gesture gets a chance to unlock it.
  function wake() {
    if (ctx && ctx.state !== 'running') {
      try { ctx.resume(); } catch { /* not resumable yet */ }
    }
  }

  const nowMs = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());

  function ensure() {
    if (ctx || !Ctor) return ctx;
    try {
      ctx = new Ctor();
      master = ctx.createGain();
      master.gain.value = 0.7;
      master.connect(ctx.destination);
      if (ctx.state === 'suspended') ctx.resume();
    } catch {
      ctx = null;
    }
    return ctx;
  }

  function env(gain, at, dur, peak, attack = 0.008) {
    const g = gain.gain;
    g.setValueAtTime(0.0001, at);
    g.linearRampToValueAtTime(peak, at + attack);
    g.exponentialRampToValueAtTime(0.0001, at + dur);
  }

  function tone(freq, at, dur, { type = 'sine', peak = 0.22, attack = 0.01, to = master } = {}) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, at);
    env(g, at, dur, peak, attack);
    osc.connect(g).connect(to);
    track(osc);
    osc.start(at);
    osc.stop(at + dur + 0.02);
  }

  function noiseBurst(at, dur, { freq, q = 0.8, peak = 0.25, type = 'bandpass' }) {
    if (!noise) {
      const len = Math.floor(ctx.sampleRate * 0.5);
      noise = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = noise.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    }
    const src = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const g = ctx.createGain();
    src.buffer = noise;
    filter.type = type;
    filter.frequency.setValueAtTime(freq, at);
    filter.Q.setValueAtTime(q, at);
    env(g, at, dur, peak, 0.006);
    src.connect(filter).connect(g).connect(master);
    track(src);
    src.start(at);
    src.stop(at + dur + 0.02);
  }

  function voice(id, at) {
    const v = VOICES[id] ?? VOICES.abuela;
    const step = 0.15;
    v.pattern.forEach((p, i) => {
      const t0 = at + i * step;
      const [f1, f2] = VOWELS[(i * 2 + id.length) % VOWELS.length];
      const src = ctx.createOscillator();
      src.type = 'sawtooth';
      src.frequency.setValueAtTime(v.base * p, t0);
      const out = ctx.createGain();
      env(out, t0, step * 0.85, 0.13, 0.025);
      for (const [f, level] of [[f1, 1], [f2, 0.55]]) {
        const band = ctx.createBiquadFilter();
        const lvl = ctx.createGain();
        band.type = 'bandpass';
        band.frequency.setValueAtTime(f, t0);
        band.Q.setValueAtTime(4, t0);
        lvl.gain.value = level;
        src.connect(band).connect(lvl).connect(out);
      }
      out.connect(master);
      track(src);
      src.start(t0);
      src.stop(t0 + step);
    });
  }

  function synth(effect, kind, at, notes) {
    switch (kind) {
      case 'squelch-open':
        noiseBurst(at, 0.16, { freq: 2200, q: 0.7, peak: 0.28 });
        tone(1500, at + 0.06, 0.08, { peak: 0.04 });
        break;
      case 'squelch-short':
        noiseBurst(at, 0.1, { freq: 1800, q: 0.7, peak: 0.16 });
        break;
      case 'click':
        noiseBurst(at, 0.03, { freq: 3500, q: 0.5, peak: 0.16, type: 'highpass' });
        break;
      case 'roger':
        tone(1000, at, 0.13, { peak: 0.2, attack: 0.006 });
        break;
      case 'sent':
        tone(659.25, at, 0.12, { peak: 0.16, type: 'triangle' });
        tone(880, at + 0.14, 0.15, { peak: 0.16, type: 'triangle' });
        break;
      case 'more':
        tone(587.33, at, 0.08, { peak: 0.1, type: 'triangle' });
        tone(783.99, at + 0.1, 0.1, { peak: 0.1, type: 'triangle' });
        break;
      case 'jingle': {
        // The melody comes with the effect (the queue item's own notes), so the
        // legend and the sound share one source.
        (notes && notes.length ? notes : DEFAULT_JINGLE)
          .filter((n) => NOTE_HZ[n])
          .forEach((n, i) => tone(NOTE_HZ[n], at + i * 0.16, 0.2, { peak: 0.2, type: 'triangle' }));
        break;
      }
      case 'voice':
        voice(effect.split(':')[1] ?? 'abuela', at);
        break;
    }
  }

  return {
    // Schedules an effect after whatever is already sounding (plus an optional
    // `delay` in ms). A jingle plays the `notes` passed with it. Returns
    // { start, end } in ms from now, or null for effects that make no sound
    // (the light:* ones).
    play(effect, { delay = 0, notes } = {}) {
      const kind = kindOf(effect);
      if (!kind) return null;
      const now = nowMs();
      const start = Math.max(now, busyUntil) + delay;
      const end = start + DURATION[kind];
      busyUntil = end;
      if (!muted && ensure()) {
        wake();
        synth(effect, kind, ctx.currentTime + (start - now) / 1000, notes);
      }
      return { start: start - now, end: end - now };
    },

    // Stops everything already scheduled and frees the timeline, so the next
    // play() starts now instead of after the queued sounds.
    cancel() {
      for (const src of sources) {
        try { src.stop(); } catch { /* already stopped */ }
      }
      sources = new Set();
      busyUntil = nowMs();
    },

    // Call from pointerup/click: resumes a suspended context (iOS unlock).
    resume() {
      wake();
    },

    setMuted(value) {
      muted = Boolean(value);
      if (master && ctx) master.gain.setValueAtTime(muted ? 0 : 0.7, ctx.currentTime);
    },

    isMuted() {
      return muted;
    },
  };
}
