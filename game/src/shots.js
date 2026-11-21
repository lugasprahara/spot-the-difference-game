// shots.js — reads the ?shot= query the maker's screenshot script uses
// (see shots.json at the repository root). Normal play has no query and
// this returns null; a shot query freezes the game in a state worth
// photographing: mid-hunt with markers down, or the finale.

export function readShot() {
  const q = new URLSearchParams(window.location.search);
  if (!q.has('shot')) return null;
  return {
    kind: q.get('shot'),
    level: Number(q.get('level') ?? 1),
    found: Number(q.get('found') ?? 0),
    left: Number(q.get('left') ?? 0),
  };
}
