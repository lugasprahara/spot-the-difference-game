// main.js — boot: builds the UI adapter the game talks to (HUD, tabs,
// overlay, toast), wires the buttons, applies a ?shot= state if the
// maker's screenshot script asked for one, and runs the frame loop.

import { Game } from './game.js';
import { SCENES } from './scenes.js';
import { attachInput } from './input.js';
import { readShot } from './shots.js';

const $ = (id) => document.getElementById(id);

const ui = {
  leftCanvas: $('leftCanvas'),
  rightCanvas: $('rightCanvas'),
  toastEl: $('toast'),
  overlayEl: $('overlay'),
  overlayMain: $('overlayMain'),
  overlayRetry: $('overlayRetry'),
  game: null,

  toast(text, kind) {
    this.toastEl.textContent = text;
    this.toastEl.className = `toast ${kind || ''}`;
  },

  setCounter({ left, found, total, sceneTitle, clock, timeFrac, lowTime, hints }) {
    $('leftCount').textContent = left;
    $('foundText').textContent = `Found ${found} of ${total}`;
    $('sceneName').textContent = sceneTitle;
    $('clock').textContent = clock;
    $('timeFill').style.width = `${Math.round(timeFrac * 100)}%`;
    $('timeFill').classList.toggle('low', lowTime);
    document.querySelector('.hud-clock').classList.toggle('low', lowTime);
    const dots = $('foundDots');
    if (dots.childElementCount !== total) {
      dots.innerHTML = '';
      for (let i = 0; i < total; i++) dots.appendChild(document.createElement('span'));
    }
    [...dots.children].forEach((dot, i) => dot.classList.toggle('found', i < found));
    $('hintCount').textContent = hints;
    $('hintBtn').disabled = hints <= 0;
  },

  setTabs(sceneIndex, stars) {
    const tabs = $('levelTabs');
    if (!tabs.childElementCount) {
      SCENES.forEach((scene, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('role', 'tab');
        b.addEventListener('click', () => this.game?.loadScene(i));
        tabs.appendChild(b);
      });
    }
    [...tabs.children].forEach((b, i) => {
      b.textContent = `${i + 1}. ${SCENES[i].title}${stars[i] ? ` ${'★'.repeat(stars[i])}` : ''}`;
      b.setAttribute('aria-selected', String(i === sceneIndex));
      b.classList.toggle('done', stars[i] > 0);
    });
  },

  showOverlay({ title, stars, text, mainLabel, onMain, retryLabel, onRetry }) {
    $('overlayTitle').textContent = title;
    $('overlayText').textContent = text;
    $('overlayStars').innerHTML =
      '★★★'.slice(0, stars).split('').map(() => '<span>★</span>').join('') +
      '★★★'.slice(0, 3 - stars).split('').map(() => '<span class="dim">★</span>').join('');
    this.overlayMain.textContent = mainLabel;
    this.overlayMain.onclick = () => {
      this.overlayEl.hidden = true;
      onMain();
    };
    if (retryLabel) {
      this.overlayRetry.hidden = false;
      this.overlayRetry.textContent = retryLabel;
      this.overlayRetry.onclick = () => {
        this.overlayEl.hidden = true;
        onRetry();
      };
    } else {
      this.overlayRetry.hidden = true;
    }
    this.overlayEl.hidden = false;
  },

  shake() {
    for (const canvas of [this.leftCanvas, this.rightCanvas]) {
      canvas.classList.remove('shake');
      void canvas.offsetWidth;
      canvas.classList.add('shake');
    }
  },

  toggleSound() {
    const on = this.game ? this.game.sounds.toggle() : false;
    $('soundBtn').innerHTML = on ? '🔊 Sound' : '🔇 Muted';
  },
};

ui.leftCtx = ui.leftCanvas.getContext('2d');
ui.rightCtx = ui.rightCanvas.getContext('2d');

const game = new Game(ui);
ui.game = game;
attachInput(game, ui);

$('hintBtn').addEventListener('click', () => game.useHint());
$('restartBtn').addEventListener('click', () => game.loadScene(game.sceneIndex));
$('soundBtn').addEventListener('click', () => ui.toggleSound());

const shot = readShot();
if (shot && shot.kind === 'win') {
  game.applyShotWin();
} else if (shot && shot.kind === 'play') {
  game.applyShotState(shot);
} else {
  const loop = (now) => {
    game.frame(now);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
