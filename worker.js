'use strict';

import { generatePattern } from './patterns/index.js';

self.onmessage = function (e) {
  const { width, height, startRow, endRow, type = 'noise' } = e.data || {};

  if (
    !Number.isFinite(width) || !Number.isFinite(height) ||
    !Number.isFinite(startRow) || !Number.isFinite(endRow) ||
    width <= 0 || height <= 0 ||
    startRow < 0 || endRow > height || startRow >= endRow
  ) {
    self.postMessage({ type: 'error', error: 'Некорректные параметры' });
    return;
  }

  const start = performance.now();

  try {
    const { pixels, rows } = generatePattern(type, width, startRow, endRow);
    const ms = Math.round(performance.now() - start);

    self.postMessage(
      {
        type: 'noise',
        buffer: pixels.buffer,
        width,
        height,
        rows,
        startRow,
        endRow,
        ms,
      },
      [pixels.buffer]
    );
  } catch (err) {
    self.postMessage({ type: 'error', error: err.message || String(err) });
  }
};