// Pure state machine for the "Pruébala" simulator. No DOM, no audio, no clock:
// time only arrives through the `t` arguments (milliseconds).

export const DEFAULT_QUEUE = [
  { id: 'abuela', name: 'Abuela', colour: 'pink', notes: ['C4', 'E4', 'G4'] },
  { id: 'tio', name: 'Tío', colour: 'blue', notes: ['G4', 'E4', 'C4'] },
  { id: 'mama', name: 'Mamá', colour: 'green', notes: ['C4', 'C4', 'G4'] },
];

export function createSimulator({ queue = DEFAULT_QUEUE, minHoldMs = 300, maxHoldMs = 15000 } = {}) {
  let next = 0; // index of the oldest unheard message
  let recordingSince = null;
  let lastPlayedId = null;

  const pending = () => queue.length - next;
  const send = () => ['roger', 'light:pulse:amber', 'sent', 'light:flash:green'];

  return {
    pressRed(t) {
      if (recordingSince !== null) return [];
      recordingSince = t;
      return ['squelch-open', 'light:solid:red'];
    },

    releaseRed(t) {
      if (recordingSince === null) return [];
      const held = t - recordingSince;
      recordingSince = null;
      return held < minHoldMs ? ['click', 'light:off'] : send();
    },

    pressGreen() {
      if (recordingSince !== null) return [];
      if (pending() === 0) return ['squelch-short'];
      const msg = queue[next++];
      lastPlayedId = msg.id;
      const out = [`jingle:${msg.id}`, `light:solid:${msg.colour}`, `voice:${msg.id}`];
      if (pending() > 0) out.push('more');
      return out;
    },

    tick(t) {
      if (recordingSince === null || t - recordingSince < maxHoldMs) return [];
      recordingSince = null;
      return send();
    },

    reset() {
      next = 0;
      recordingSince = null;
      lastPlayedId = null;
      return queue.length > 0 ? [`light:breathe:${queue[0].colour}`] : ['light:off'];
    },

    getState() {
      return { recording: recordingSince !== null, pending: pending(), lastPlayedId };
    },
  };
}
