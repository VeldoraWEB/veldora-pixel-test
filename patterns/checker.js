'use strict';

export function generateChecker(width, startRow, endRow, cell = 4) {
  const rows = endRow - startRow;
  const pixels = new Uint8ClampedArray(width * rows * 4);

  for (let y = 0; y < rows; y++) {
    const globalY = startRow + y;
    const yRow = (globalY / cell) | 0;
    for (let x = 0; x < width; x++) {
      const v = (((x / cell) | 0) + yRow) & 1 ? 255 : 0;
      const idx = (y * width + x) * 4;
      pixels[idx]     = v;
      pixels[idx + 1] = v;
      pixels[idx + 2] = v;
      pixels[idx + 3] = 255;
    }
  }

  return { pixels, rows };
}