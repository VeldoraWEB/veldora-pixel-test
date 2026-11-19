'use strict';

import { generateNoise }   from './noise.js';
import { generateChecker } from './checker.js';

const GENERATORS = {
  noise:   generateNoise,
  checker: generateChecker,
};

export function generatePattern(type, width, startRow, endRow) {
  const gen = GENERATORS[type];
  if (!gen) throw new Error(`Неизвестный тип паттерна: ${type}`);
  return gen(width, startRow, endRow);
}