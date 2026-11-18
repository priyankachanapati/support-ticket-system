import { STORAGE_KEY, STORAGE_MESSAGES, USERS } from '../data/constants.js';
import { createSeedState } from '../data/seed.js';

function resolveStorage(customStorage) {
  if (customStorage !== undefined) {
    return customStorage;
  }
  try {
    if (typeof window === 'undefined') {
      return null;
    }
    const storage = window.localStorage;
    if (
      !storage ||
      typeof storage.getItem !== 'function' ||
      typeof storage.setItem !== 'function'
    ) {
      return null;
    }
    return storage;
  } catch {
    return null;
  }
}

export function isValidStoreShape(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return false;
  }

  if (!Array.isArray(data.users) || data.users.length < USERS.length) {
    return false;
  }

  const validRoles = new Set(['Employee', 'Support Staff']);
  const userIds = new Set();
  for (const user of data.users) {
    if (
      !user ||
      typeof user !== 'object' ||
      typeof user.id !== 'string' ||
      !user.id ||
      typeof user.name !== 'string' ||
      !user.name.trim() ||
      !validRoles.has(user.role)
    ) {
      return false;
    }
    userIds.add(user.id);
  }

  if (!USERS.every((seedUser) => userIds.has(seedUser.id))) {
    return false;
  }

  if (!Array.isArray(data.tickets) || !Array.isArray(data.comments)) {
    return false;
  }

  if (
    data.activeUserId !== null &&
    (typeof data.activeUserId !== 'string' || !userIds.has(data.activeUserId))
  ) {
    return false;
  }

  return true;
}

export function loadStore(customStorage) {
  const storage = resolveStorage(customStorage);
  if (!storage) {
    return {
      ok: false,
      unavailable: true,
      error: STORAGE_MESSAGES.UNAVAILABLE,
      state: null,
    };
  }

  let raw;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch {
    return {
      ok: false,
      unavailable: true,
      error: STORAGE_MESSAGES.UNAVAILABLE,
      state: null,
    };
  }

  if (raw !== null) {
    try {
      const parsed = JSON.parse(raw);
      if (isValidStoreShape(parsed)) {
        return {
          ok: true,
          unavailable: false,
          error: null,
          state: parsed,
        };
      }
    } catch {
      // Fall through to seed repair write
    }
  }

  const seed = createSeedState();
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return {
      ok: true,
      unavailable: false,
      error: null,
      state: seed,
    };
  } catch {
    return {
      ok: false,
      unavailable: true,
      error: STORAGE_MESSAGES.UNAVAILABLE,
      state: null,
    };
  }
}

export function saveStore(nextState, failureMessage, customStorage) {
  const storage = resolveStorage(customStorage);
  if (!storage) {
    return {
      ok: false,
      unavailable: true,
      error: STORAGE_MESSAGES.UNAVAILABLE,
    };
  }

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    return {
      ok: true,
      unavailable: false,
      error: null,
    };
  } catch {
    try {
      storage.getItem(STORAGE_KEY);
      return {
        ok: false,
        unavailable: false,
        error: failureMessage,
      };
    } catch {
      return {
        ok: false,
        unavailable: true,
        error: STORAGE_MESSAGES.UNAVAILABLE,
      };
    }
  }
}
