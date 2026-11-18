import { STORAGE_KEY, STORAGE_MESSAGES } from '../data/constants.js';
import { createSeedState } from '../data/seed.js';
import { loadStore, saveStore } from './storage.js';

describe('storage utilities', () => {
  it('seeds localStorage on empty store and reuses valid state with dynamic profiles', () => {
    const initial = loadStore();
    expect(initial.ok).toBe(true);
    expect(initial.state.tickets).toHaveLength(5);
    expect(initial.state.activeUserId).toBeNull();
    expect(window.localStorage.getItem(STORAGE_KEY)).not.toBeNull();

    const modified = {
      ...initial.state,
      users: [
        ...initial.state.users,
        { id: 'user-maya', name: 'Maya', role: 'Employee' },
      ],
      activeUserId: 'user-maya',
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(modified));

    const reloaded = loadStore();
    expect(reloaded.ok).toBe(true);
    expect(reloaded.state.activeUserId).toBe('user-maya');
  });

  it('repairs malformed JSON only when write succeeds', () => {
    window.localStorage.setItem(STORAGE_KEY, '{');
    const repaired = loadStore();
    expect(repaired.ok).toBe(true);
    expect(repaired.state.activeUserId).toBeNull();

    window.localStorage.setItem(STORAGE_KEY, '{');
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    const failedRepair = loadStore();
    expect(failedRepair.ok).toBe(false);
    expect(failedRepair.state).toBeNull();
    expect(failedRepair.error).toBe(STORAGE_MESSAGES.UNAVAILABLE);
  });

  it('returns unavailable message when storage cannot be read', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });

    const result = loadStore();
    expect(result.ok).toBe(false);
    expect(result.state).toBeNull();
    expect(result.error).toBe(STORAGE_MESSAGES.UNAVAILABLE);
  });

  it('returns specific failure message when setItem rejects write', () => {
    const seed = createSeedState();
    saveStore(seed, STORAGE_MESSAGES.TICKET_SAVE_FAILED);

    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });

    const res = saveStore(seed, STORAGE_MESSAGES.TICKET_SAVE_FAILED);
    expect(res.ok).toBe(false);
    expect(res.error).toBe(STORAGE_MESSAGES.TICKET_SAVE_FAILED);
  });
});
