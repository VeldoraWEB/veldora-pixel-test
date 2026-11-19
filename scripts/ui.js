'use strict';

import { dom } from './dom.js';

let statusTimeout = null;

export function setStatus(message, type = 'info') {
  dom.statusBar.textContent = message;
  dom.statusBar.className = `status-bar ${type} visible`;

  if (statusTimeout) clearTimeout(statusTimeout);
  if (type !== 'error') {
    statusTimeout = setTimeout(() => {
      dom.statusBar.classList.remove('visible');
    }, 4500);
  }
}