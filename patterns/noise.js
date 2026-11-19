'use strict';

export function generateNoise(width, startRow, endRow) {
  const rows = endRow - startRow;
  const pixels = new Uint8ClampedArray(width * rows * 4);

  for (let i = 0; i < pixels.length; i += 4) {
    const v = (Math.random() * 256) | 0;
    pixels[i]     = v;
    pixels[i + 1] = v;
    pixels[i + 2] = v;
    pixels[i + 3] = 255;
  }

  return { pixels, rows };
}