import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSimulator } from '../js/simulator.js';
import { createAudio } from '../js/sim-audio.js';

test('red hold then release sends', () => {
  const sim = createSimulator({});
  assert.deepEqual(sim.pressRed(0), ['squelch-open', 'light:solid:red']);
  assert.deepEqual(sim.releaseRed(1000), ['roger', 'light:pulse:amber', 'sent', 'light:flash:green']);
});

test('short red tap sends nothing', () => {
  const sim = createSimulator({});
  sim.pressRed(0);
  assert.deepEqual(sim.releaseRed(200), ['click', 'light:off']);
});

test('hold past max auto-cuts and sends', () => {
  const sim = createSimulator({});
  sim.pressRed(0);
  const out = sim.tick(15001);
  assert.ok(out.includes('roger'));
  assert.ok(out.includes('sent'));
  assert.deepEqual(sim.releaseRed(15500), []);
  assert.equal(sim.getState().recording, false);
});

test('tick before the max does nothing', () => {
  const sim = createSimulator({});
  sim.pressRed(0);
  assert.deepEqual(sim.tick(14000), []);
  assert.equal(sim.getState().recording, true);
});

test('green plays oldest first with its colour', () => {
  const sim = createSimulator({});
  const out = sim.pressGreen(0);
  assert.ok(out.includes('jingle:abuela'));
  assert.ok(out.includes('light:solid:pink'));
  assert.ok(out.includes('voice:abuela'));
  assert.ok(out.includes('more'));
  assert.equal(sim.getState().lastPlayedId, 'abuela');
});

test('last message has no more tone', () => {
  const sim = createSimulator({});
  sim.pressGreen(0);
  sim.pressGreen(1);
  const third = sim.pressGreen(2);
  assert.ok(!third.includes('more'));
  assert.ok(third.includes('voice:mama'));
  assert.equal(sim.getState().pending, 0);
});

test('green with empty queue only squelches', () => {
  const sim = createSimulator({ queue: [] });
  assert.deepEqual(sim.pressGreen(0), ['squelch-short']);
});

test('green after the queue drains only squelches', () => {
  const sim = createSimulator({});
  for (let i = 0; i < 3; i++) sim.pressGreen(i);
  assert.deepEqual(sim.pressGreen(4), ['squelch-short']);
});

test('pending light breathes in oldest colour', () => {
  const sim = createSimulator({});
  sim.pressGreen(0);
  assert.ok(sim.reset().includes('light:breathe:pink'));
  assert.deepEqual(sim.getState(), { recording: false, pending: 3, lastPlayedId: null });
});

test('reset with nothing queued turns the light off', () => {
  assert.deepEqual(createSimulator({ queue: [] }).reset(), ['light:off']);
});

test('green is ignored while recording', () => {
  const sim = createSimulator({});
  sim.pressRed(0);
  assert.deepEqual(sim.pressGreen(10), []);
  assert.equal(sim.getState().pending, 3);
});

// ---- audio ----
function fakeContextClass(log) {
  const param = () => ({ value: 0, setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {}, cancelScheduledValues() {} });
  const node = (kind) => ({ kind, connect() { return this; }, disconnect() {}, start() { log.started++; }, stop() {}, frequency: param(), gain: param(), Q: param(), detune: param(), buffer: null, type: '' });
  return class FakeCtx {
    constructor() { log.contexts++; this.currentTime = 0; this.state = 'running'; this.sampleRate = 8000; this.destination = node('dest'); }
    resume() { return Promise.resolve(); }
    createOscillator() { return node('osc'); }
    createGain() { return node('gain'); }
    createBiquadFilter() { return node('filter'); }
    createBufferSource() { return node('src'); }
    createBuffer(c, n) { return { getChannelData: () => new Float32Array(n) }; }
  };
}

test('audio is lazy and mute silences', () => {
  const log = { contexts: 0, started: 0 };
  const audio = createAudio({ AudioContextClass: fakeContextClass(log) });
  assert.equal(log.contexts, 0, 'no AudioContext before the first play');
  assert.equal(audio.isMuted(), false);
  audio.play('click');
  assert.equal(log.contexts, 1);
  assert.ok(log.started > 0);
  const before = log.started;
  audio.setMuted(true);
  assert.equal(audio.isMuted(), true);
  audio.play('roger');
  audio.play('jingle:abuela');
  assert.equal(log.started, before, 'muted plays nothing');
  audio.play('light:off');
  assert.equal(log.contexts, 1);
});

test('muted from the start never creates a context', () => {
  const log = { contexts: 0, started: 0 };
  const audio = createAudio({ AudioContextClass: fakeContextClass(log) });
  audio.setMuted(true);
  const slot = audio.play('squelch-open');
  assert.equal(log.contexts, 0);
  assert.ok(slot && slot.end > slot.start, 'timing is still reported so the light can follow');
});
