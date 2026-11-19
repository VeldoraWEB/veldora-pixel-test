'use strict';

import './cursor.js';
import './screen.js';
import { pushNewColor } from './history.js';
import { isNoiseActive, stopNoise } from './noise.js';

document.addEventListener('pointerdown', (e) => {
  if (e.target.closest('.toolbar') === null) {
    if (document.activeElement && document.activeElement.blur) {
      document.activeElement.blur();
    }
  }
});

document.addEventListener('click', (e) => {
  if (e.target.closest('.toolbar') || e.target.closest('.status-bar') || e.target.closest('.hint') || e.target.closest('.esc-btn')) {
    return;
  }
  if (isNoiseActive()) {
    stopNoise();
    return;
  }
  pushNewColor();
});