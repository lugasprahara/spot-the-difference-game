# spot-the-difference-game

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/lugasprahara/spot-the-difference-game/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/lugasprahara/spot-the-difference-game/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

**Double Take** — an original spot-the-difference game. Three hand-drawn
canvas scenes (Sunny Cove, Cozy Kitchen, Moonlit Garden) hide 25 differences
between them: a sun in sunglasses, a kettle turned to copper, an owl that
fell asleep. Click a difference in either picture to ring it on both, beat
the countdown, and earn up to three stars a scene. Wrong clicks cost 5
seconds, hints cost 10 — and the garden at night does not give up its
secrets easily. Pure HTML/CSS/JS, no dependencies, plays fully offline.

## Run it

```sh
node serve.ts          # serves game/ on http://localhost:8080
# or hand the entry in like the grader does:
MAKEFUN_OUTPUT_DIR=out node main.ts
```

## How it is put together

- `game/index.html` + `game/style.css` — the page, HUD and overlay
- `game/src/scenes.js` — the three scenes and their difference data
- `game/src/painter.js` — the shared canvas drawing kit (and the found-ring)
- `game/src/game.js` — state: countdown, markers, hints, stars, overlays
- `game/src/input.js` — pointer and keyboard controls
- `game/src/audio.js` — a small WebAudio synth (no audio files)
- `game/src/shots.js` — the frozen states the screenshots were taken in
- `main.ts` — copies `game/` and `screenshots/` out and writes the dossier
- `vendor/makefun-game.ts` — the kit's dossier library, unchanged

---

<sub>Entered on [make.fun](https://make.fun/?ref=aes5np1n&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
