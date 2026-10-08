(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.PartnerCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const MAX_ROSTER = 40, MAX_HISTORY = 2000;
  const key = (a, b) => [a, b].sort().join('|');
  const normalize = name => name.normalize('NFKC').trim().replace(/\s+/gu, ' ');
  const identity = name => normalize(name).toLowerCase();
  function validName(name) {
    return typeof name === 'string' && normalize(name).length > 0 && normalize(name).length <= 60 && !/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]/u.test(name);
  }
  function parseNames(text, existing = []) {
    const names = text.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    if (!names.length) throw new Error('empty');
    if (names.length + existing.length > MAX_ROSTER) throw new Error('tooMany');
    const seen = new Set(existing.map(p => identity(p.name)));
    return names.map(raw => {
      if (!validName(raw)) throw new Error('invalidName');
      const name = normalize(raw), id = identity(name);
      if (seen.has(id)) throw new Error('duplicate');
      seen.add(id); return name;
    });
  }
  function stats(roster, history) {
    const people = new Map(roster.map(p => [p.id, { rounds: 0, byes: 0, partners: new Set() }]));
    const pairs = new Map();
    let repeated = 0;
    history.forEach(round => {
      round.pairs.forEach(([a, b]) => {
        const k = key(a, b), count = pairs.get(k) || 0;
        if (count) repeated++;
        pairs.set(k, count + 1);
        people.get(a).rounds++; people.get(b).rounds++;
        people.get(a).partners.add(b); people.get(b).partners.add(a);
      });
      if (round.bye !== null) { people.get(round.bye).rounds++; people.get(round.bye).byes++; }
    });
    return { people, pairs, repeated };
  }
  function shuffle(array, rng) {
    const copy = array.slice();
    for (let i = copy.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]]; }
    return copy;
  }
  function preview(roster, history, rng = Math.random) {
    const active = roster.filter(p => p.present).map(p => p.id);
    if (active.length < 4 || active.length > 20) throw new Error('attendanceRange');
    if (history.length >= MAX_HISTORY) throw new Error('historyFull');
    const summary = stats(roster, history);
    const order = shuffle(active, rng);
    // The dummy participant represents rest. Only attendees with the fewest
    // completed rests are eligible; matching then scores previous pairings.
    if (order.length % 2) order.push(null);
    const n = order.length, all = (1 << n) - 1;
    const minBye = Math.min(...active.map(id => summary.people.get(id).byes));
    const repeatWeight = MAX_HISTORY * 10 + 1;
    const costs = Array.from({ length: n }, () => new Float64Array(n));
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      if (order[i] === null || order[j] === null) {
        const id = order[i] === null ? order[j] : order[i];
        costs[i][j] = summary.people.get(id).byes === minBye ? 0 : Infinity;
      } else {
        const times = summary.pairs.get(key(order[i], order[j])) || 0;
        costs[i][j] = times ? repeatWeight + times : 0;
      }
    }
    const memo = new Map([[0, 0]]), choice = new Map();
    function solve(mask) {
      if (memo.has(mask)) return memo.get(mask);
      const first = 31 - Math.clz32(mask & -mask), rest = mask ^ (1 << first);
      let best = Infinity, partner = -1;
      for (let j = first + 1; j < n; j++) if (rest & (1 << j)) {
        const edge = costs[first][j];
        if (!Number.isFinite(edge)) continue;
        const score = edge + solve(rest ^ (1 << j));
        if (score < best) { best = score; partner = j; }
      }
      memo.set(mask, best); choice.set(mask, partner); return best;
    }
    solve(all);
    const pairs = []; let bye = null, mask = all, repeated = 0, previousMeetings = 0;
    while (mask) {
      const i = 31 - Math.clz32(mask & -mask), j = choice.get(mask);
      if (j === undefined || j < 0) throw new Error('generationFailed');
      const a = order[i], b = order[j];
      if (a === null || b === null) bye = a === null ? b : a;
      else { pairs.push([a, b]); const count = summary.pairs.get(key(a, b)) || 0; repeated += count > 0 ? 1 : 0; previousMeetings += count; }
      mask ^= (1 << i) | (1 << j);
    }
    return { pairs: shuffle(pairs, rng), bye, repeated, previousMeetings };
  }
  function validateSnapshot(value) {
    const fail = () => { throw new Error('invalidBackup'); };
    if (!value || value.version !== 1 || !['ko', 'en'].includes(value.lang) || !Array.isArray(value.roster) || value.roster.length > MAX_ROSTER || !Array.isArray(value.history) || value.history.length > MAX_HISTORY) fail();
    const ids = new Set(), names = new Set(), tokens = new Set();
    const roster = value.roster.map(p => {
      if (!p || typeof p.id !== 'string' || !/^[a-zA-Z0-9_-]{1,80}$/.test(p.id) || ids.has(p.id) || !validName(p.name) || typeof p.present !== 'boolean' || names.has(identity(p.name))) fail();
      ids.add(p.id); names.add(identity(p.name));
      return { id: p.id, name: normalize(p.name), present: p.present };
    });
    const history = value.history.map(round => {
      if (!round || typeof round.id !== 'string' || !/^[a-zA-Z0-9_-]{1,80}$/.test(round.id) || tokens.has(round.id) || typeof round.at !== 'string' || !Number.isFinite(Date.parse(round.at)) || !Array.isArray(round.pairs) || round.pairs.length < 2 || round.pairs.length > 10 || (round.bye !== null && !ids.has(round.bye))) fail();
      tokens.add(round.id); const used = new Set();
      const pairs = round.pairs.map(pair => {
        if (!Array.isArray(pair) || pair.length !== 2) fail();
        return pair.map(id => { if (!ids.has(id) || used.has(id)) fail(); used.add(id); return id; });
      });
      if (round.bye !== null) { if (used.has(round.bye)) fail(); used.add(round.bye); }
      if (used.size < 4 || used.size > 20) fail();
      return { id: round.id, at: round.at, pairs, bye: round.bye };
    });
    return { version: 1, lang: value.lang, roster, history };
  }
  return { MAX_ROSTER, MAX_HISTORY, key, normalize, identity, validName, parseNames, stats, preview, validateSnapshot };
});
