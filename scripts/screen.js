'use strict';

import { dom } from './dom.js';
import { setStatus } from './ui.js';

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      setStatus(`Ошибка полноэкранного режима: ${err.message}`, 'error');
    });
  } else {
    document.exitFullscreen();
  }
}

dom.btnFullscreen.addEventListener('click', toggleFullscreen);
dom.btnEsc.addEventListener('click', () => {
  if (document.fullscreenElement) document.exitFullscreen();
});

document.addEventListener('fullscreenchange', () => {
  document.body.classList.toggle('is-fullscreen', !!document.fullscreenElement);
});