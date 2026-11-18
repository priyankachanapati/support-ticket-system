import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

function isWorkingJsdomStorage(storage) {
  if (!storage) {
    return false;
  }
  if (typeof Storage !== 'undefined' && !(storage instanceof Storage)) {
    return false;
  }
  if (
    typeof storage.getItem !== 'function' ||
    typeof storage.setItem !== 'function' ||
    typeof storage.removeItem !== 'function' ||
    typeof storage.clear !== 'function'
  ) {
    return false;
  }
  try {
    const probeKey = '__vitest_storage_probe__';
    storage.setItem(probeKey, '1');
    storage.removeItem(probeKey);
    return true;
  } catch {
    return false;
  }
}

function ensureJsdomLocalStorage() {
  try {
    if (isWorkingJsdomStorage(window.localStorage)) {
      return;
    }
  } catch {
    // Accessing window.localStorage threw (e.g. Node WebStorage without --localstorage-file)
  }

  const jsdomStorage = globalThis.jsdom?.window?.localStorage;
  if (isWorkingJsdomStorage(jsdomStorage)) {
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: jsdomStorage,
    });
    if (globalThis !== window) {
      Object.defineProperty(globalThis, 'localStorage', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: jsdomStorage,
      });
    }
  }
}

ensureJsdomLocalStorage();

beforeEach(() => {
  vi.restoreAllMocks();
  ensureJsdomLocalStorage();
  window.localStorage.clear();
  window.location.hash = '';
});

afterEach(() => {
  vi.restoreAllMocks();
  cleanup();
  ensureJsdomLocalStorage();
  window.localStorage.clear();
  window.location.hash = '';
});
