'use strict';

import { dom } from './dom.js';

const cursor = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
  tx: window.innerWidth / 2,
  ty: window.innerHeight / 2
};

let rafId = null;
let lastTime = performance.now();
const ctx = dom.cursorCanvas.getContext('2d');

function resize() {
  const dpr = window.devicePixelRatio || 1;
  dom.cursorCanvas.width = Math.max(1, Math.floor(window.innerWidth * dpr));
  dom.cursorCanvas.height = Math.max(1, Math.floor(window.innerHeight * dpr));
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener('resize', resize);
resize();

function animate(now) {
  const dt = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;
  const alpha = 1 - Math.exp(-12 * dt);
  cursor.x += (cursor.tx - cursor.x) * alpha;
  cursor.y += (cursor.ty - cursor.y) * alpha;

  const w = window.innerWidth;
  const h = window.innerHeight;

  ctx.clearRect(0, 0, w, h);

  const glow = ctx.createRadialGradient(cursor.x, cursor.y, 0, cursor.x, cursor.y, 40);
  glow.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
  glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cursor.x, cursor.y, 40, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cursor.x, cursor.y, 16, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(cursor.x, cursor.y, 4, 0, Math.PI * 2);
  ctx.fill();

  rafId = requestAnimationFrame(animate);
}

function startAnimation() {
  if (rafId !== null) return;
  lastTime = performance.now();
  rafId = requestAnimationFrame(animate);
}

function stopAnimation() {
  if (rafId === null) return;
  cancelAnimationFrame(rafId);
  rafId = null;
}

['pointermove', 'pointerdown'].forEach(evt => {
  document.addEventListener(evt, (e) => {
    cursor.tx = e.clientX;
    cursor.ty = e.clientY;
  }, { passive: true });
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) stopAnimation();
  else startAnimation();
});

startAnimation();