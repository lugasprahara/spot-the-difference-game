// scenes.js — the three hand-drawn scenes of Double Take.
//
// Each scene exports a draw(ctx, changed) function. `changed` is a Set of
// difference ids: empty for the original picture, full for the changed copy.
// The same ids, with a centre and radius per difference, drive click
// detection, markers and hints — so what a player can find is exactly what
// the changed copy draws differently. Scenes are 480x360.

import { circle, ellipse, rect, roundRect, triangle, line, polyline, cloud, sparkle, gull, glow } from './painter.js';

// ---------------------------------------------------------------- Sunny Cove
function drawCove(ctx, changed) {
  const has = (id) => changed.has(id);
  // sky and sea
  const sky = ctx.createLinearGradient(0, 0, 0, 160);
  sky.addColorStop(0, '#7fd4ff');
  sky.addColorStop(1, '#dff6ff');
  rect(ctx, 0, 0, 480, 165, sky);
  const sea = ctx.createLinearGradient(0, 150, 0, 240);
  sea.addColorStop(0, '#2ea3d8');
  sea.addColorStop(1, '#5ec2e8');
  rect(ctx, 0, 150, 480, 88, sea);
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.lineWidth = 2.5;
  for (const [x, y, w] of [[30, 178, 44], [210, 196, 56], [330, 172, 38], [90, 214, 48], [400, 208, 52]]) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + w / 2, y - 5, x + w, y);
    ctx.stroke();
  }
  rect(ctx, 0, 238, 480, 122, '#ffe3a3'); // sand
  ctx.fillStyle = 'rgba(214, 164, 84, 0.5)';
  for (const [x, y] of [[40, 268], [150, 330], [300, 262], [452, 300], [210, 288], [96, 344]]) circle(ctx, x, y, 2.5, 'rgba(214,164,84,0.5)');

  // sun — difference: it puts on sunglasses in the changed copy
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    line(ctx, 70 + Math.cos(a) * 40, 62 + Math.sin(a) * 40, 70 + Math.cos(a) * 52, 62 + Math.sin(a) * 52, '#f5b921', 5);
  }
  circle(ctx, 70, 62, 31, '#ffd94d');
  circle(ctx, 70, 62, 31, null);
  ctx.strokeStyle = '#f5b921';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(70, 62, 31, 0, Math.PI * 2); ctx.stroke();
  if (has('shades')) {
    roundRect(ctx, 46, 52, 48, 15, 7, '#22304a');
    rect(ctx, 40, 56, 7, 5, '#22304a');
    rect(ctx, 93, 56, 7, 5, '#22304a');
    ctx.beginPath(); ctx.arc(70, 74, 10, Math.PI * 0.15, Math.PI * 0.85); ctx.strokeStyle = '#c78f12'; ctx.lineWidth = 2.5; ctx.stroke();
  } else {
    circle(ctx, 59, 58, 3.2, '#22304a');
    circle(ctx, 81, 58, 3.2, '#22304a');
    ctx.beginPath(); ctx.arc(70, 66, 11, Math.PI * 0.15, Math.PI * 0.85); ctx.strokeStyle = '#c78f12'; ctx.lineWidth = 2.5; ctx.stroke();
  }

  // clouds — difference: the small cloud vanishes
  cloud(ctx, 168, 52, 1, '#ffffff');
  cloud(ctx, 292, 74, 0.8, '#ffffff');
  if (!has('cloud')) cloud(ctx, 372, 42, 0.55, '#ffffff');
  gull(ctx, 240, 44, 1, '#5b7a99');
  gull(ctx, 268, 60, 0.7, '#5b7a99');

  // boat — difference: the sail changes from red to blue
  rect(ctx, 148, 116, 4, 54, '#7a4a21');
  triangle(ctx, 156, 120, 156, 166, 196, 166, has('sail') ? '#3a7bd5' : '#ff5a5a');
  triangle(ctx, 144, 128, 144, 166, 112, 166, '#fff6e8');
  ctx.beginPath();
  ctx.moveTo(104, 170); ctx.lineTo(204, 170); ctx.lineTo(188, 190); ctx.lineTo(120, 190); ctx.closePath();
  ctx.fillStyle = '#a05c2c'; ctx.fill();
  rect(ctx, 104, 166, 100, 6, '#7a4a21');

  // palm tree — difference: one coconut is gone
  ctx.beginPath();
  ctx.moveTo(438, 252);
  ctx.quadraticCurveTo(428, 180, 406, 122);
  ctx.strokeStyle = '#9c6b30';
  ctx.lineWidth = 13;
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.strokeStyle = '#3f9e4d';
  ctx.lineWidth = 7;
  for (const [ex, ey] of [[352, 104], [378, 88], [414, 84], [446, 96], [452, 122]]) {
    ctx.beginPath();
    ctx.moveTo(406, 118);
    ctx.quadraticCurveTo((406 + ex) / 2, Math.min(118, ey) - 22, ex, ey);
    ctx.stroke();
  }
  circle(ctx, 396, 130, 7.5, '#7a4a21');
  circle(ctx, 416, 134, 7.5, '#7a4a21');
  if (!has('nuts')) circle(ctx, 406, 144, 7.5, '#7a4a21');

  // umbrella — difference: coral stripes become teal stripes
  line(ctx, 122, 300, 118, 222, '#8a5a3b', 5);
  const stripeA = has('umbrella') ? '#2ec4b6' : '#ff7f66';
  ctx.beginPath();
  ctx.moveTo(58, 224);
  ctx.quadraticCurveTo(120, 168, 182, 224);
  ctx.quadraticCurveTo(161, 210, 141, 224);
  ctx.quadraticCurveTo(120, 210, 99, 224);
  ctx.quadraticCurveTo(79, 210, 58, 224);
  ctx.closePath();
  ctx.fillStyle = stripeA; ctx.fill();
  ctx.beginPath();
  ctx.moveTo(99, 224);
  ctx.quadraticCurveTo(120, 210, 141, 224);
  ctx.quadraticCurveTo(131, 190, 120, 182);
  ctx.quadraticCurveTo(109, 190, 99, 224);
  ctx.closePath();
  ctx.fillStyle = '#fff6e8'; ctx.fill();
  line(ctx, 120, 182, 120, 172, '#8a5a3b', 4);

  // towel and beach ball — difference: the ball loses its yellow band
  roundRect(ctx, 178, 306, 96, 30, 5, '#ff8fab');
  rect(ctx, 178, 318, 96, 6, '#fff6e8');
  circle(ctx, 256, 296, 21, '#ffffff');
  ctx.beginPath(); ctx.arc(256, 296, 21, Math.PI * 1.05, Math.PI * 1.55); ctx.lineTo(256, 296); ctx.closePath(); ctx.fillStyle = '#ff5a5a'; ctx.fill();
  ctx.beginPath(); ctx.arc(256, 296, 21, Math.PI * 0.45, Math.PI * 0.95); ctx.lineTo(256, 296); ctx.closePath(); ctx.fillStyle = '#3a7bd5'; ctx.fill();
  if (!has('ball')) {
    ctx.beginPath(); ctx.arc(256, 296, 21, Math.PI * 1.6, Math.PI * 1.95); ctx.lineTo(256, 296); ctx.closePath(); ctx.fillStyle = '#ffd94d'; ctx.fill();
  }
  ctx.beginPath(); ctx.arc(256, 296, 21, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(34,48,74,0.35)'; ctx.lineWidth = 2; ctx.stroke();
  circle(ctx, 256, 296, 4, '#ffffff');

  // bucket and shells (the same in both)
  ctx.beginPath();
  ctx.moveTo(48, 296); ctx.lineTo(84, 296); ctx.lineTo(78, 330); ctx.lineTo(54, 330); ctx.closePath();
  ctx.fillStyle = '#ff8c42'; ctx.fill();
  ctx.beginPath(); ctx.arc(66, 296, 18, Math.PI, Math.PI * 2); ctx.strokeStyle = '#c2571b'; ctx.lineWidth = 3; ctx.stroke();
  for (const [x, y] of [[322, 332], [348, 318]]) {
    ctx.beginPath(); ctx.arc(x, y, 8, Math.PI * 0.9, Math.PI * 2.05); ctx.closePath();
    ctx.fillStyle = '#ffb3c1'; ctx.fill();
    line(ctx, x, y, x - 5, y - 6, '#e58aa5', 1.6);
    line(ctx, x, y, x + 1, y - 8, '#e58aa5', 1.6);
    line(ctx, x, y, x + 6, y - 5, '#e58aa5', 1.6);
  }

  // crab — difference: its left claw is missing
  ellipse(ctx, 392, 322, 27, 15, '#ff6b5e');
  circle(ctx, 382, 304, 4, '#ffffff');
  circle(ctx, 402, 304, 4, '#ffffff');
  circle(ctx, 382, 304, 2, '#22304a');
  circle(ctx, 402, 304, 2, '#22304a');
  line(ctx, 382, 308, 382, 312, '#d94f3d', 2.5);
  line(ctx, 402, 308, 402, 312, '#d94f3d', 2.5);
  ctx.strokeStyle = '#d94f3d'; ctx.lineWidth = 3;
  for (const s of [-1, 1]) for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(392 + s * 22, 326 + i * 3);
    ctx.lineTo(392 + s * 36, 334 + i * 4);
    ctx.stroke();
  }
  if (!has('claw')) {
    circle(ctx, 360, 308, 9, '#ff6b5e');
    triangle(ctx, 356, 300, 364, 300, 360, 306, '#ffe3a3');
  }
  circle(ctx, 424, 308, 9, '#ff6b5e');
  triangle(ctx, 420, 300, 428, 300, 424, 306, '#ffe3a3');
}

// ------------------------------------------------------------- Cozy Kitchen
function drawKitchen(ctx, changed) {
  const has = (id) => changed.has(id);
  rect(ctx, 0, 0, 480, 250, '#f7e8d0'); // wall
  rect(ctx, 0, 300, 480, 60, '#d9a066'); // floor
  ctx.strokeStyle = 'rgba(122, 74, 33, 0.35)';
  ctx.lineWidth = 2;
  for (let x = 30; x < 480; x += 62) line(ctx, x, 300, x - 18, 360, 'rgba(122,74,33,0.35)', 2);
  // backsplash tiles
  rect(ctx, 0, 196, 480, 52, '#bfe3dd');
  ctx.strokeStyle = 'rgba(42, 120, 110, 0.35)';
  ctx.lineWidth = 1.5;
  for (let x = 0; x <= 480; x += 34) line(ctx, x, 196, x, 248, 'rgba(42,120,110,0.35)', 1.5);
  line(ctx, 0, 222, 480, 222, 'rgba(42,120,110,0.35)', 1.5);

  // window — difference: the right curtain is gone
  roundRect(ctx, 26, 34, 116, 128, 6, '#ffffff');
  rect(ctx, 34, 42, 100, 112, '#bfe8ff');
  circle(ctx, 112, 66, 13, '#ffd94d');
  cloud(ctx, 48, 74, 0.5, '#ffffff');
  rect(ctx, 34, 42, 100, 112, 'rgba(255,255,255,0)');
  line(ctx, 84, 42, 84, 154, '#ffffff', 6);
  line(ctx, 34, 98, 134, 98, '#ffffff', 6);
  ctx.strokeStyle = '#8a5a3b'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.roundRect(26, 34, 116, 128, 6); ctx.stroke();
  ctx.fillStyle = '#e4572e';
  ctx.beginPath();
  ctx.moveTo(26, 34); ctx.lineTo(52, 34); ctx.lineTo(52, 128);
  ctx.quadraticCurveTo(39, 118, 26, 128); ctx.closePath(); ctx.fill();
  if (!has('curtain')) {
    ctx.beginPath();
    ctx.moveTo(142, 34); ctx.lineTo(116, 34); ctx.lineTo(116, 128);
    ctx.quadraticCurveTo(129, 118, 142, 128); ctx.closePath(); ctx.fill();
  }
  rect(ctx, 20, 160, 128, 8, '#8a5a3b');

  // wall clock — difference: it shows a different time
  circle(ctx, 240, 60, 28, '#8a5a3b');
  circle(ctx, 240, 60, 23, '#ffffff');
  ctx.fillStyle = '#22304a';
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    circle(ctx, 240 + Math.cos(a) * 18.5, 60 + Math.sin(a) * 18.5, i % 3 === 0 ? 2 : 1.2, '#22304a');
  }
  if (has('clock')) {
    line(ctx, 240, 60, 252, 68, '#22304a', 4);   // 5:30
    line(ctx, 240, 60, 240, 76, '#e4572e', 3);
  } else {
    line(ctx, 240, 60, 256, 60, '#22304a', 4);   // 3:00
    line(ctx, 240, 60, 240, 44, '#e4572e', 3);
  }
  circle(ctx, 240, 60, 3, '#22304a');

  // shelf with jars — difference: the middle jar is missing
  const jar = (x, fillTop, fillBody) => {
    roundRect(ctx, x, 88, 24, 30, 4, fillBody);
    rect(ctx, x + 3, 80, 18, 8, fillTop);
  };
  jar(288, '#c2571b', 'rgba(255, 138, 66, 0.75)');
  if (!has('jar')) jar(324, '#2a9d8f', 'rgba(120, 200, 190, 0.75)');
  jar(360, '#b388ff', 'rgba(230, 120, 120, 0.75)');
  rect(ctx, 278, 118, 128, 8, '#8a5a3b');

  // hanging plant — difference: its pink flower is gone
  line(ctx, 452, 0, 452, 62, '#8a5a3b', 3);
  ctx.beginPath();
  ctx.moveTo(434, 62); ctx.lineTo(470, 62); ctx.lineTo(462, 90); ctx.lineTo(442, 90); ctx.closePath();
  ctx.fillStyle = '#e07856'; ctx.fill();
  ctx.strokeStyle = '#3f9e4d'; ctx.lineWidth = 4;
  for (const [ex, ey] of [[432, 116], [446, 128], [460, 120], [470, 108]]) {
    ctx.beginPath(); ctx.moveTo(452, 84); ctx.quadraticCurveTo((452 + ex) / 2 + 4, (84 + ey) / 2, ex, ey); ctx.stroke();
    circle(ctx, ex, ey, 5, '#57b25e');
  }
  if (!has('flower')) {
    circle(ctx, 446, 122, 6, '#ff8fab');
    circle(ctx, 446, 122, 2.4, '#ffd94d');
  }

  // pendant lamp (the same in both)
  line(ctx, 176, 0, 176, 34, '#22304a', 3);
  triangle(ctx, 156, 58, 196, 58, 176, 32, '#f4b41a');
  circle(ctx, 176, 62, 6, '#ffe9a8');

  // counter
  rect(ctx, 0, 248, 480, 10, '#8a5a3b');
  rect(ctx, 0, 258, 480, 44, '#a9744f');

  // fruit bowl — difference: the banana is gone
  ellipse(ctx, 150, 244, 40, 10, '#3a7bd5');
  ctx.beginPath();
  ctx.moveTo(112, 238); ctx.quadraticCurveTo(150, 258, 188, 238); ctx.closePath();
  ctx.fillStyle = '#2f66ad'; ctx.fill();
  circle(ctx, 136, 228, 11, '#ff5a5a');
  circle(ctx, 164, 228, 11, '#ff8c42');
  circle(ctx, 150, 218, 11, '#ff5a5a');
  circle(ctx, 141, 224, 2.5, 'rgba(255,255,255,0.6)');
  circle(ctx, 155, 214, 2.5, 'rgba(255,255,255,0.6)');
  if (!has('banana')) {
    ctx.beginPath();
    ctx.moveTo(128, 214);
    ctx.quadraticCurveTo(150, 198, 176, 210);
    ctx.quadraticCurveTo(152, 210, 132, 220);
    ctx.closePath();
    ctx.fillStyle = '#ffd94d'; ctx.fill();
  }

  // mug — difference: striped on the left, plain on the right
  roundRect(ctx, 204, 226, 20, 22, 3, '#ffffff');
  if (!has('mug')) {
    rect(ctx, 204, 232, 20, 4, '#e4572e');
    rect(ctx, 204, 240, 20, 4, '#e4572e');
  }
  ctx.beginPath(); ctx.arc(228, 237, 6, -Math.PI / 2, Math.PI / 2); ctx.strokeStyle = '#d8d8d8'; ctx.lineWidth = 3; ctx.stroke();

  // stove and kettle — difference: silver kettle becomes copper
  rect(ctx, 302, 240, 108, 8, '#22304a');
  circle(ctx, 322, 244, 9, '#39445e');
  circle(ctx, 388, 244, 9, '#39445e');
  const kettle = has('kettle') ? '#c97b4a' : '#cfd8dc';
  const kettleDark = has('kettle') ? '#a35f33' : '#9fb2ba';
  ctx.beginPath();
  ctx.moveTo(330, 240); ctx.lineTo(334, 208); ctx.quadraticCurveTo(356, 198, 378, 208); ctx.lineTo(382, 240); ctx.closePath();
  ctx.fillStyle = kettle; ctx.fill();
  triangle(ctx, 330, 222, 314, 210, 332, 208, kettleDark);
  rect(ctx, 348, 196, 16, 7, kettleDark);
  ctx.beginPath(); ctx.arc(356, 214, 15, Math.PI * 1.1, Math.PI * 1.6); ctx.strokeStyle = kettleDark; ctx.lineWidth = 4; ctx.stroke();

  // cat on a rug — difference: its tail sticks up, or lies flat
  ellipse(ctx, 398, 330, 66, 15, '#e58e8e');
  ellipse(ctx, 398, 330, 50, 10, '#eda9a9');
  if (has('tail')) {
    ctx.beginPath(); ctx.moveTo(424, 316); ctx.quadraticCurveTo(440, 318, 446, 330); ctx.strokeStyle = '#f2a541'; ctx.lineWidth = 8; ctx.stroke();
  } else {
    ctx.beginPath(); ctx.moveTo(424, 312); ctx.quadraticCurveTo(438, 292, 430, 276); ctx.strokeStyle = '#f2a541'; ctx.lineWidth = 8; ctx.stroke();
    circle(ctx, 430, 274, 5, '#f2a541');
  }
  ellipse(ctx, 398, 310, 31, 18, '#f2a541');
  circle(ctx, 368, 298, 15, '#f2a541');
  triangle(ctx, 356, 292, 360, 278, 368, 288, '#f2a541');
  triangle(ctx, 372, 288, 380, 278, 382, 292, '#f2a541');
  circle(ctx, 363, 297, 2.4, '#22304a');
  circle(ctx, 375, 297, 2.4, '#22304a');
  triangle(ctx, 368, 302, 371, 302, 369.5, 304.5, '#e4572e');
  line(ctx, 352, 302, 360, 303, '#c78f12', 1.6);
  line(ctx, 378, 303, 386, 302, '#c78f12', 1.6);
  ellipse(ctx, 388, 322, 8, 5, '#ffffff');
  ellipse(ctx, 410, 322, 8, 5, '#ffffff');
}

// ----------------------------------------------------------- Moonlit Garden
const STARS = [
  [28, 30], [58, 96], [104, 36], [138, 78], [176, 26], [214, 58], [246, 22], [282, 84],
  [308, 30], [356, 92], [388, 40], [420, 76], [452, 24], [466, 110], [196, 108], [92, 128],
  [240, 128], [352, 140], [30, 168], [440, 150], [268, 160], [150, 150],
];

function drawGarden(ctx, changed) {
  const has = (id) => changed.has(id);
  const sky = ctx.createLinearGradient(0, 0, 0, 360);
  sky.addColorStop(0, '#141d3d');
  sky.addColorStop(0.7, '#2c3d68');
  sky.addColorStop(1, '#3c5a4a');
  rect(ctx, 0, 0, 480, 360, sky);
  STARS.forEach(([x, y], i) => circle(ctx, x, y, i % 4 === 0 ? 2 : 1.3, 'rgba(255,255,255,0.85)'));
  // difference: the big sparkle star is gone
  if (!has('star')) sparkle(ctx, 330, 50, 15, '#fff3b0');

  // moon — difference: crescent becomes full
  glow(ctx, 70, 60, 52, 'rgba(245, 240, 216, 0.35)');
  circle(ctx, 70, 60, 27, '#f5f0d8');
  if (has('moon')) {
    circle(ctx, 60, 52, 6, '#ddd5b8');
    circle(ctx, 80, 70, 4.5, '#ddd5b8');
    circle(ctx, 66, 76, 3.2, '#ddd5b8');
  } else {
    circle(ctx, 84, 50, 23, '#1a2447');
  }

  // fence behind everything on the ground
  rect(ctx, 0, 296, 480, 64, '#22402e');
  ctx.fillStyle = '#6b4f35';
  for (let x = 8; x < 480; x += 40) rect(ctx, x, 238, 9, 66, '#6b4f35');
  rect(ctx, 0, 252, 480, 7, '#7d5c3e');
  rect(ctx, 0, 276, 480, 7, '#7d5c3e');

  // house silhouette — difference: its window goes dark
  rect(ctx, 398, 148, 82, 92, '#141c33');
  triangle(ctx, 388, 150, 490, 150, 439, 112, '#0d1322');
  rect(ctx, 452, 196, 18, 44, '#0d1322');
  if (has('window')) {
    rect(ctx, 428, 158, 24, 28, '#0d1322');
  } else {
    rect(ctx, 428, 158, 24, 28, '#ffd94d');
    line(ctx, 440, 158, 440, 186, '#8a5a3b', 3);
    line(ctx, 428, 172, 452, 172, '#8a5a3b', 3);
  }

  // the big tree
  ctx.beginPath();
  ctx.moveTo(102, 302); ctx.lineTo(112, 196); ctx.lineTo(130, 196); ctx.lineTo(140, 302); ctx.closePath();
  ctx.fillStyle = '#5a4232'; ctx.fill();
  line(ctx, 116, 190, 62, 152, '#5a4232', 10);
  line(ctx, 128, 186, 178, 156, '#5a4232', 9);
  circle(ctx, 120, 138, 56, '#2e5d43');
  circle(ctx, 74, 162, 38, '#35704e');
  circle(ctx, 168, 158, 42, '#2a5540');
  circle(ctx, 120, 108, 34, '#35704e');

  // swing — difference: the seat is missing, only ropes remain
  line(ctx, 88, 156, 88, 232, '#d8cfc0', 3);
  line(ctx, 118, 156, 118, 232, '#d8cfc0', 3);
  if (!has('swing')) roundRect(ctx, 80, 232, 46, 9, 3, '#b08968');

  // owl on the branch — difference: it falls asleep (eyes shut)
  ellipse(ctx, 152, 128, 15, 19, '#8a6f4d');
  circle(ctx, 152, 110, 12.5, '#a5855c');
  triangle(ctx, 142, 102, 146, 94, 150, 102, '#8a6f4d');
  triangle(ctx, 154, 102, 158, 94, 162, 102, '#8a6f4d');
  if (has('owl')) {
    ctx.beginPath(); ctx.arc(147, 110, 3.6, Math.PI * 0.1, Math.PI * 0.9); ctx.strokeStyle = '#22304a'; ctx.lineWidth = 2; ctx.stroke();
    ctx.beginPath(); ctx.arc(158, 110, 3.6, Math.PI * 0.1, Math.PI * 0.9); ctx.stroke();
  } else {
    circle(ctx, 147, 110, 3.8, '#ffffff');
    circle(ctx, 158, 110, 3.8, '#ffffff');
    circle(ctx, 147, 110, 1.9, '#22304a');
    circle(ctx, 158, 110, 1.9, '#22304a');
  }
  triangle(ctx, 150, 115, 155, 115, 152.5, 119, '#f4b41a');

  // fireflies — difference: three of the five are gone
  const flies = [[186, 166], [206, 188], [224, 168], [196, 202], [218, 208]];
  flies.forEach(([x, y], i) => {
    if (has('flies') && i >= 2) return;
    glow(ctx, x, y, 13, 'rgba(255, 224, 102, 0.5)');
    circle(ctx, x, y, 3, '#ffe066');
  });

  // lantern on a post — difference: its light goes out
  rect(ctx, 297, 196, 6, 62, '#3a2c1c');
  if (!has('lantern')) glow(ctx, 300, 182, 34, 'rgba(255, 202, 122, 0.55)');
  roundRect(ctx, 288, 166, 24, 32, 3, '#22304a');
  rect(ctx, 292, 171, 16, 22, has('lantern') ? '#1a2438' : '#ffca7a');
  triangle(ctx, 284, 167, 316, 167, 300, 154, '#22304a');

  // pond with a frog — difference: the frog hops away
  ellipse(ctx, 372, 322, 88, 25, '#274b73');
  ellipse(ctx, 372, 318, 80, 20, '#31597f');
  ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(348, 322, 22, 5, 0, Math.PI * 0.15, Math.PI * 0.7); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(404, 312, 16, 4, 0, Math.PI * 1.2, Math.PI * 1.8); ctx.stroke();
  ellipse(ctx, 402, 328, 11, 5, '#3f9e4d');
  ellipse(ctx, 338, 314, 12, 5.5, '#3f9e4d');
  if (!has('frog')) {
    circle(ctx, 338, 306, 9, '#57b25e');
    circle(ctx, 332, 297, 4, '#57b25e');
    circle(ctx, 344, 297, 4, '#57b25e');
    circle(ctx, 332, 297, 1.8, '#22304a');
    circle(ctx, 344, 297, 1.8, '#22304a');
  }

  // flower bed — difference: one purple flower turns yellow
  const flowers = [
    [36, '#ff8fab'], [74, '#ffd94d'], [112, '#ff6b5e'], [150, '#fff6e8'],
    [188, '#ff8fab'], [288, '#ff6b5e'], [318, '#ffd94d'],
  ];
  for (const [x, c] of flowers) {
    line(ctx, x, 344, x, 326, '#3f9e4d', 3);
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      circle(ctx, x + Math.cos(a) * 5.5, 322 + Math.sin(a) * 5.5, 4.2, c);
    }
    circle(ctx, x, 322, 3, '#f4b41a');
  }
  line(ctx, 250, 344, 250, 328, '#3f9e4d', 3);
  const special = has('flower') ? '#ffd94d' : '#b388ff';
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    circle(ctx, 250 + Math.cos(a) * 6, 324 + Math.sin(a) * 6, 4.6, special);
  }
  circle(ctx, 250, 324, 3.2, '#fff6e8');

  // snail — difference: its shell turns from orange to green
  ellipse(ctx, 66, 338, 20, 8, '#a8c686');
  circle(ctx, 84, 330, 4, '#a8c686');
  line(ctx, 84, 328, 88, 318, '#a8c686', 2.5);
  circle(ctx, 88, 317, 2, '#a8c686');
  circle(ctx, 56, 326, 14, has('snail') ? '#7fbf7f' : '#ff9f68');
  ctx.beginPath(); ctx.arc(56, 326, 8, 0.6, 4.4); ctx.strokeStyle = 'rgba(34,48,74,0.45)'; ctx.lineWidth = 2.4; ctx.stroke();
  ctx.beginPath(); ctx.arc(56, 326, 4, 2.2, 6); ctx.stroke();
}

// ------------------------------------------------------------------- exports
export const SCENES = [
  {
    id: 'cove',
    title: 'Sunny Cove',
    timeLimit: 240,
    draw: drawCove,
    differences: [
      { id: 'shades', x: 70, y: 60, r: 30, label: 'The sun put on sunglasses' },
      { id: 'cloud', x: 374, y: 44, r: 24, label: 'A little cloud drifted away' },
      { id: 'sail', x: 168, y: 142, r: 26, label: 'The sail changed from red to blue' },
      { id: 'nuts', x: 406, y: 134, r: 21, label: 'A coconut fell off the palm' },
      { id: 'umbrella', x: 120, y: 208, r: 38, label: 'The umbrella stripes changed colour' },
      { id: 'ball', x: 256, y: 296, r: 24, label: 'The beach ball lost its yellow band' },
      { id: 'claw', x: 366, y: 308, r: 20, label: 'The crab lost a claw' },
    ],
  },
  {
    id: 'kitchen',
    title: 'Cozy Kitchen',
    timeLimit: 240,
    draw: drawKitchen,
    differences: [
      { id: 'curtain', x: 130, y: 84, r: 22, label: 'A curtain went missing' },
      { id: 'clock', x: 240, y: 60, r: 29, label: 'The clock tells a different time' },
      { id: 'jar', x: 336, y: 102, r: 19, label: 'A jar vanished from the shelf' },
      { id: 'flower', x: 447, y: 120, r: 17, label: 'The plant lost its flower' },
      { id: 'banana', x: 152, y: 208, r: 21, label: 'The banana left the fruit bowl' },
      { id: 'mug', x: 214, y: 237, r: 15, label: 'The mug lost its stripes' },
      { id: 'kettle', x: 356, y: 218, r: 27, label: 'The kettle turned to copper' },
      { id: 'tail', x: 432, y: 292, r: 21, label: 'The cat put its tail down' },
    ],
  },
  {
    id: 'garden',
    title: 'Moonlit Garden',
    timeLimit: 300,
    draw: drawGarden,
    differences: [
      { id: 'moon', x: 70, y: 60, r: 30, label: 'The crescent moon filled out' },
      { id: 'star', x: 330, y: 50, r: 19, label: 'The brightest star blinked out' },
      { id: 'owl', x: 152, y: 110, r: 19, label: 'The owl fell asleep' },
      { id: 'swing', x: 103, y: 234, r: 22, label: 'The swing seat is gone' },
      { id: 'flies', x: 207, y: 186, r: 27, label: 'Three fireflies went home' },
      { id: 'lantern', x: 300, y: 182, r: 21, label: 'The lantern went out' },
      { id: 'window', x: 440, y: 172, r: 17, label: 'The house window went dark' },
      { id: 'frog', x: 338, y: 305, r: 19, label: 'The frog hopped away' },
      { id: 'flower', x: 250, y: 324, r: 17, label: 'A purple flower turned yellow' },
      { id: 'snail', x: 57, y: 327, r: 17, label: 'The snail repainted its shell green' },
    ],
  },
];
