'use strict';

import { dom } from './dom.js';
import { setStatus } from './ui.js';

let activeWorker = null;
let noiseActive = false;

export function isNoiseActive() {
  return noiseActive;
}

function terminateWorker() {
  if (activeWorker) {
    try { activeWorker.terminate(); } catch (_) {}
    activeWorker = null;
  }
}

export function stopNoise() {
  terminateWorker();
  dom.patternSelect.disabled = false;

  if (!noiseActive) return;

  noiseActive = false;
  dom.noiseCanvas.classList.remove('active');
  dom.noiseCanvas.getContext('2d').clearRect(0, 0, dom.noiseCanvas.width, dom.noiseCanvas.height);
  document.body.classList.remove('noise-active');
  dom.btnNoise.disabled = false;
}

export function startNoise() {
  if (noiseActive) stopNoise();

  const dpr = window.devicePixelRatio || 1;
  const w = Math.min(Math.floor(window.innerWidth * dpr), 3840);
  const h = Math.min(Math.floor(window.innerHeight * dpr), 2160);
  const patternType = dom.patternSelect.value;

  setStatus('Генерация в Web Worker…', 'info');
  dom.btnNoise.disabled = true;
  dom.patternSelect.disabled = true;

  function fail(message) {
    console.error(message);
    terminateWorker();
    dom.btnNoise.disabled = false;
    dom.patternSelect.disabled = false;
    noiseActive = false;
    dom.noiseCanvas.classList.remove('active');
    document.body.classList.remove('noise-active');
  }

  try {
    activeWorker = new Worker('worker.js', { type: 'module' });

    activeWorker.onmessage = (e) => {
      const data = e.data || {};

      if (data.type === 'error' || data.error) {
        fail(`Ошибка воркера: ${data.error || 'неизвестная'}`);
        return;
      }

      if (data.type === 'noise') {
        try {
          const pixels = new Uint8ClampedArray(data.buffer);
          const imageData = new ImageData(pixels, data.width, data.height);

          dom.noiseCanvas.width = data.width;
          dom.noiseCanvas.height = data.height;
          dom.noiseCanvas.classList.add('active');
          dom.noiseCanvas.getContext('2d').putImageData(imageData, 0, 0);

          noiseActive = true;
          document.body.classList.add('noise-active');

          setStatus(`Worker сработал за ${data.ms} мс. Клик/Esc - остановить.`, 'success');
        } catch (err) {
          fail(`Не удалось собрать паттерн: ${err.message}`);
          return;
        }

        terminateWorker();
        dom.btnNoise.disabled = false;
        dom.patternSelect.disabled = false;
      }
    };

    activeWorker.onerror = (err) => {
      fail(`Ошибка воркера: ${err.message || 'unknown'}`);
    };

    activeWorker.postMessage({
      width: w,
      height: h,
      startRow: 0,
      endRow: h,
      type: patternType,
    });
  } catch (err) {
    fail(`Не удалось запустить воркер: ${err.message}`);
  }
}

dom.btnNoise.addEventListener('click', startNoise);