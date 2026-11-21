// game.js — the state machine of Double Take: scenes, the countdown, found
// markers with their pop-in animation, hints, mistakes, stars and overlays.
// Rendering is one function: draw both panels, then the markers on top.

import { SCENES } from './scenes.js';
import { foundRing, hintPulse } from './painter.js';
import { Sounds } from './audio.js';

const ALL_CHANGED = (scene) => new Set(scene.differences.map((d) => d.id));
const NO_CHANGE = new Set();

function formatClock(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export class Game {
  constructor(ui) {
    this.ui = ui;
    this.sounds = new Sounds();
    this.sceneIndex = 0;
    this.stars = SCENES.map(() => 0);
    this.totalMistakes = 0;
    this.ringBorn = new Map(); // difference id -> timestamp the ring appeared
    this.hintTarget = null;    // { id, until }
    this.loadScene(0);
  }

  get scene() {
    return SCENES[this.sceneIndex];
  }

  loadScene(index) {
    this.sceneIndex = index;
    this.found = new Set();
    this.ringBorn.clear();
    this.hintTarget = null;
    this.hintsLeft = 3;
    this.mistakes = 0;
    this.timeLeft = this.scene.timeLimit;
    this.running = true;
    this.over = false;
    this.lastTick = null;
    this.say(`Scene ${index + 1}: ${this.scene.title} — find all ${this.scene.differences.length} differences!`, '');
    this.syncHud();
    this.render(performance.now());
  }

  // ------------------------------------------------------------- interaction
  click(x, y) {
    if (!this.running || this.over) return;
    this.sounds.ensure();
    let best = null;
    for (const d of this.scene.differences) {
      const dist = Math.hypot(x - d.x, y - d.y);
      if (dist <= d.r + 10 && (!best || dist < best.dist)) best = { d, dist };
    }
    if (best && !this.found.has(best.d.id)) {
      this.found.add(best.d.id);
      this.ringBorn.set(best.d.id, performance.now());
      this.sounds.find();
      const left = this.scene.differences.length - this.found.size;
      this.say(`Found it — ${best.d.label}! ${left} to go.`, 'good');
      this.syncHud();
      if (left === 0) this.completeScene();
    } else if (best) {
      this.say('You already found that one — keep hunting!', '');
    } else {
      this.mistakes += 1;
      this.totalMistakes += 1;
      this.timeLeft = Math.max(0, this.timeLeft - 5);
      this.sounds.miss();
      this.ui.shake();
      this.say('Not a difference — that cost 5 seconds!', 'bad');
      this.syncHud();
      if (this.timeLeft <= 0) this.timeUp();
    }
    this.render(performance.now());
  }

  useHint() {
    if (!this.running || this.over || this.hintsLeft <= 0) return;
    const open = this.scene.differences.filter((d) => !this.found.has(d.id));
    if (!open.length) return;
    const pick = open[Math.floor(Math.random() * open.length)];
    this.hintsLeft -= 1;
    this.timeLeft = Math.max(0, this.timeLeft - 10);
    this.hintTarget = { id: pick.id, until: performance.now() + 2600 };
    this.sounds.hint();
    this.say('Something glitters near a difference… (−10 seconds)', '');
    this.syncHud();
    if (this.timeLeft <= 0) this.timeUp();
  }

  // ------------------------------------------------------------------- flow
  completeScene() {
    this.over = true;
    const frac = this.timeLeft / this.scene.timeLimit;
    let stars = frac >= 0.4 ? 3 : frac >= 0.18 ? 2 : 1;
    if (this.mistakes >= 6) stars = Math.max(1, stars - 1);
    this.stars[this.sceneIndex] = Math.max(this.stars[this.sceneIndex], stars);
    this.sounds.win();
    const last = this.sceneIndex === SCENES.length - 1;
    if (last) {
      this.showFinale();
    } else {
      this.ui.showOverlay({
        title: `${this.scene.title} — complete!`,
        stars,
        text: `All ${this.scene.differences.length} differences found with ${formatClock(this.timeLeft)} to spare and ${this.mistakes} wrong click${this.mistakes === 1 ? '' : 's'}.`,
        mainLabel: `Next scene: ${SCENES[this.sceneIndex + 1].title}`,
        onMain: () => this.loadScene(this.sceneIndex + 1),
        retryLabel: 'Replay scene',
        onRetry: () => this.loadScene(this.sceneIndex),
      });
    }
    this.syncTabs();
  }

  showFinale() {
    const total = this.stars.reduce((a, b) => a + b, 0);
    this.ui.showOverlay({
      title: 'You finished Double Take!',
      stars: Math.round(total / SCENES.length),
      text: `Every scene cleared: ${total} of ${SCENES.length * 3} stars, ${this.totalMistakes} wrong clicks along the way. The garden at night was the sneaky one — well spotted!`,
      mainLabel: 'Play again',
      onMain: () => {
        this.stars = SCENES.map(() => 0);
        this.totalMistakes = 0;
        this.loadScene(0);
        this.syncTabs();
      },
      retryLabel: 'Replay the garden',
      onRetry: () => this.loadScene(SCENES.length - 1),
    });
  }

  timeUp() {
    if (this.over) return;
    this.over = true;
    this.sounds.miss();
    this.ui.showOverlay({
      title: 'Time up!',
      stars: 0,
      text: `So close — ${this.found.size} of ${this.scene.differences.length} differences found in ${this.scene.title}. The rest are still hiding in plain sight.`,
      mainLabel: 'Try the scene again',
      onMain: () => this.loadScene(this.sceneIndex),
      retryLabel: null,
      onRetry: null,
    });
  }

  nextScene() {
    if (this.sceneIndex < SCENES.length - 1) this.loadScene(this.sceneIndex + 1);
  }

  // -------------------------------------------------------------------- hud
  say(text, kind) {
    this.ui.toast(text, kind);
  }

  syncHud() {
    const total = this.scene.differences.length;
    const left = total - this.found.size;
    this.ui.setCounter({
      left,
      found: this.found.size,
      total,
      sceneTitle: this.scene.title,
      clock: formatClock(this.timeLeft),
      timeFrac: Math.max(0, this.timeLeft / this.scene.timeLimit),
      lowTime: this.timeLeft <= 60 && this.running && !this.over,
      hints: this.hintsLeft,
    });
    this.syncTabs();
  }

  syncTabs() {
    this.ui.setTabs(this.sceneIndex, this.stars);
  }

  // ----------------------------------------------------------------- render
  frame(now) {
    if (this.running && !this.over && this.lastTick !== null) {
      const dt = (now - this.lastTick) / 1000;
      this.timeLeft -= dt;
      if (this.timeLeft <= 0) {
        this.timeLeft = 0;
        this.syncHud();
        this.timeUp();
      } else if (Math.ceil(this.timeLeft) !== Math.ceil(this.timeLeft + dt)) {
        this.syncHud();
      }
    }
    this.lastTick = now;
    this.render(now);
  }

  render(now) {
    const scene = this.scene;
    const left = this.ui.leftCtx;
    const right = this.ui.rightCtx;
    scene.draw(left, NO_CHANGE);
    scene.draw(right, ALL_CHANGED(scene));
    for (const d of scene.differences) {
      if (!this.found.has(d.id)) continue;
      const born = this.ringBorn.get(d.id) ?? now - 1000;
      const t = Math.min(1, (now - born) / 350);
      foundRing(left, d.x, d.y, d.r, t);
      foundRing(right, d.x, d.y, d.r, t);
    }
    if (this.hintTarget && now < this.hintTarget.until) {
      const d = scene.differences.find((item) => item.id === this.hintTarget.id);
      if (d && !this.found.has(d.id)) {
        hintPulse(left, d.x, d.y, d.r, now / 160);
        hintPulse(right, d.x, d.y, d.r, now / 160);
      }
    } else if (this.hintTarget) {
      this.hintTarget = null;
    }
  }

  // ------------------------------------------------------- screenshot states
  // A frozen mid-game state for the maker's screenshots (?shot=play): some
  // differences already ringed, the clock stopped where the shot wants it.
  applyShotState({ level, found, left }) {
    this.loadScene(level - 1);
    const diffs = this.scene.differences;
    for (let i = 0; i < Math.min(found, diffs.length); i++) {
      this.found.add(diffs[i].id);
      this.ringBorn.set(diffs[i].id, performance.now() - 1000);
    }
    this.timeLeft = left;
    this.running = false;
    this.say(`Found ${this.found.size} of ${diffs.length} — the rest are hiding in plain sight!`, '');
    this.syncHud();
    this.render(performance.now());
  }

  // A frozen finale for the win screenshot (?shot=win).
  applyShotWin() {
    this.loadScene(SCENES.length - 1);
    for (const d of this.scene.differences) {
      this.found.add(d.id);
      this.ringBorn.set(d.id, performance.now() - 1000);
    }
    this.stars = [3, 3, 2];
    this.totalMistakes = 4;
    this.timeLeft = 74;
    this.running = false;
    this.over = true;
    this.showFinale();
    this.syncHud();
    this.render(performance.now());
  }
}
