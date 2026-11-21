// painter.js — small Canvas 2D drawing helpers shared by every scene.
// Every scene is drawn twice from the same code: once plain (the original)
// and once with a set of difference ids switched on (the changed copy).

export function circle(ctx, x, y, r, fill) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
}

export function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
}

export function rect(ctx, x, y, w, h, fill) {
  if (fill) ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

export function roundRect(ctx, x, y, w, h, r, fill) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
}

export function triangle(ctx, x1, y1, x2, y2, x3, y3, fill) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
}

export function line(ctx, x1, y1, x2, y2, stroke, width) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = stroke;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.stroke();
}

export function polyline(ctx, points, stroke, width) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.strokeStyle = stroke;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();
}

// A soft cartoon cloud: three overlapping puffs on a flat base.
export function cloud(ctx, x, y, s, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, 16 * s, Math.PI * 0.5, Math.PI * 1.5);
  ctx.arc(x + 16 * s, y - 9 * s, 13 * s, Math.PI * 1, Math.PI * 1.95);
  ctx.arc(x + 34 * s, y - 4 * s, 11 * s, Math.PI * 1.3, Math.PI * 0.5);
  ctx.closePath();
  ctx.fill();
}

// A four-point sparkle star, for night skies and magic moments.
export function sparkle(ctx, x, y, r, fill) {
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.quadraticCurveTo(x, y, x, y + r);
  ctx.quadraticCurveTo(x, y, x - r, y);
  ctx.quadraticCurveTo(x, y, x, y - r);
  ctx.fillStyle = fill;
  ctx.fill();
}

// A seagull: two little arcs.
export function gull(ctx, x, y, s, stroke) {
  ctx.beginPath();
  ctx.arc(x - 7 * s, y, 7 * s, Math.PI * 1.15, Math.PI * 1.95);
  ctx.arc(x + 7 * s, y, 7 * s, Math.PI * 1.05, Math.PI * 1.85);
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2 * s;
  ctx.lineCap = 'round';
  ctx.stroke();
}

// The ring drawn around a difference once it is found. `t` is 0..1 progress
// of the pop-in animation; the ring settles at radius r with a soft halo.
export function foundRing(ctx, x, y, r, t) {
  const grow = 1 + 0.35 * Math.max(0, 1 - t * 2);
  ctx.beginPath();
  ctx.arc(x, y, r * grow + 6, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(228, 87, 46, 0.35)';
  ctx.lineWidth = 7;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x, y, r * grow + 6, 0, Math.PI * 2);
  ctx.strokeStyle = '#e4572e';
  ctx.lineWidth = 3.5;
  ctx.stroke();
  // a small check in the corner of the ring
  const cx = x + (r + 6) * 0.72;
  const cy = y - (r + 6) * 0.72;
  circle(ctx, cx, cy, 8, '#e4572e');
  polyline(ctx, [[cx - 4, cy], [cx - 1, cy + 3.5], [cx + 4.5, cy - 3.5]], '#ffffff', 2.4);
}

// The pulsing ring a hint shows around one unfound difference.
export function hintPulse(ctx, x, y, r, phase) {
  const wave = (Math.sin(phase * 5) + 1) / 2;
  ctx.beginPath();
  ctx.arc(x, y, r + 10 + wave * 7, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(244, 180, 26, ${0.85 - wave * 0.4})`;
  ctx.lineWidth = 4;
  ctx.setLineDash([10, 7]);
  ctx.stroke();
  ctx.setLineDash([]);
}

// A soft radial glow (lantern light, fireflies, moon halo).
export function glow(ctx, x, y, r, colour) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, colour);
  g.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
}
