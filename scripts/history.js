'use strict';

import { dom } from './dom.js';
import { COLORS } from './constants.js';
import { isNoiseActive, stopNoise } from './noise.js';

let currentIndex = 0;
let maxIndex = 0;
let currentColorIndex = 0;

export function applyColor(colorIndex) {
  const color = COLORS[colorIndex];
  document.body.style.backgroundColor = color.hex;
  dom.colorInfo.textContent = `Цвет ${colorIndex + 1} из ${COLORS.length} · ${color.name}`;
}

function initHistory() {
  const state = history.state;
  if (state && typeof state.index === 'number' && typeof state.colorIndex === 'number') {
    currentIndex = state.index;
    currentColorIndex = state.colorIndex;
    maxIndex = Math.max(maxIndex, currentIndex);
  } else {
    const m = window.location.hash.match(/^#color-(\d+)$/);
    if (m) {
      currentColorIndex = parseInt(m[1], 10) % COLORS.length;
    } else {
      currentColorIndex = 0;
    }
    currentIndex = 0;
    maxIndex = 0;
    history.replaceState({ index: 0, colorIndex: currentColorIndex }, '', `#color-${currentColorIndex}`);
  }
  applyColor(currentColorIndex);
}

export function pushNewColor() {
  currentColorIndex = (currentColorIndex + 1) % COLORS.length;
  currentIndex = currentIndex + 1;
  maxIndex = currentIndex;
  history.pushState({ index: currentIndex, colorIndex: currentColorIndex }, '', `#color-${currentColorIndex}`);
  applyColor(currentColorIndex);
}

window.addEventListener('popstate', (e) => {
  const state = e.state;
  if (state && typeof state.index === 'number') {
    currentIndex = state.index;
    currentColorIndex = state.colorIndex;
  } else {
    currentIndex = 0;
    currentColorIndex = 0;
  }
  applyColor(currentColorIndex);
});

initHistory();

document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT') return;

  if (e.key === 'ArrowLeft') {
    if (currentIndex > 0) {
      e.preventDefault();
      history.back();
    }
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    if (currentIndex < maxIndex) {
      history.forward();
    } else {
      pushNewColor();
    }
  } else if (e.key === 'Escape') {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (isNoiseActive()) {
      stopNoise();
    }
  }
});