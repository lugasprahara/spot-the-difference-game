// input.js — pointer and keyboard controls. Clicks on either canvas are
// translated from display pixels back into the scene's 480x360 coordinates
// and handed to the game; keys map to hint, restart, next scene and sound.

export function scenePoint(canvas, event) {
  const box = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - box.left) / box.width) * canvas.width,
    y: ((event.clientY - box.top) / box.height) * canvas.height,
  };
}

export function attachInput(game, ui) {
  for (const canvas of [ui.leftCanvas, ui.rightCanvas]) {
    canvas.addEventListener('pointerdown', (event) => {
      const p = scenePoint(canvas, event);
      game.click(p.x, p.y);
    });
  }
  window.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    const key = event.key.toLowerCase();
    if (key === 'h') game.useHint();
    else if (key === 'r') game.loadScene(game.sceneIndex);
    else if (key === 'n') game.nextScene();
    else if (key === 'm') ui.toggleSound();
  });
}
