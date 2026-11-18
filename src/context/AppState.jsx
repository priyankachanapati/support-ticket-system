import { createContext, useCallback, useContext, useState } from 'react';
import {
  POSITIONS,
  STORAGE_MESSAGES,
  USERS,
} from '../data/constants.js';
import { createSeedState } from '../data/seed.js';
import { loadStore, saveStore } from '../utils/storage.js';
import {
  canEditTicket,
  canViewTicket,
  createCommentRecord,
  createTicketRecord,
  updateTicketFieldsRecord,
  updateTicketStatusRecord,
} from '../utils/tickets.js';

const AppStateContext = createContext(null);

function createUniqueUserId(name, existingUsers) {
  const existingIds = new Set(existingUsers.map((u) => u.id));
  const slug =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'user';
  let candidate = `user-${slug}`;
  let counter = 2;
  while (existingIds.has(candidate)) {
    candidate = `user-${slug}-${counter}`;
    counter += 1;
  }
  return candidate;
}

export function AppStateProvider({ children }) {
  const [initialResult] = useState(() => loadStore());
  const [store, setStore] = useState(initialResult.state);
  const [bannerError, setBannerError] = useState(initialResult.error);

  const storageUnavailable = store === null;
  const users = store?.users ?? USERS;
  const tickets = store?.tickets ?? [];
  const comments = store?.comments ?? [];
  const activeUserId = store?.activeUserId ?? null;
  const activeUser = activeUserId
    ? (users.find((user) => user.id === activeUserId) ?? null)
    : null;

  const clearBannerError = useCallback(() => {
    if (!storageUnavailable) {
      setBannerError(null);
    }
  }, [storageUnavailable]);

  const registerProfile = useCallback(
    ({ name, position }) => {
      if (!store) {
        setBannerError(STORAGE_MESSAGES.UNAVAILABLE);
        return { ok: false, error: STORAGE_MESSAGES.UNAVAILABLE };
      }

      const positionConfig = POSITIONS.find((p) => p.value === position);
      if (!positionConfig) {
        return { ok: false, error: 'Select a position.' };
      }

      const trimmedName = name.trim();
      const targetRole = positionConfig.role;

      const matchedUser = store.users.find(
        (u) =>
          u.name.trim().toLowerCase() === trimmedName.toLowerCase() &&
          u.role === targetRole
      );

      let targetUser = matchedUser;
      let nextUsers = store.users;

      if (!targetUser) {
        targetUser = {
          id: createUniqueUserId(trimmedName, store.users),
          name: trimmedName,
          role: targetRole,
        };
        nextUsers = [...store.users, targetUser];
      }

      const nextState = {
        ...store,
        users: nextUsers,
        activeUserId: targetUser.id,
        profile: {
          id: targetUser.id,
          name: targetUser.name,
          position,
        },
      };

      const res = saveStore(nextState, STORAGE_MESSAGES.PROFILE_SAVE_FAILED);
      if (!res.ok) {
        if (res.unavailable) {
          setBannerError(res.error);
        }
        return { ok: false, error: res.error };
      }

      setStore(nextState);
      setBannerError(null);
      return { ok: true, user: targetUser };
    },
    [store]
  );

  const clearActiveProfile = useCallback(() => {
    if (!store) {
      setBannerError(STORAGE_MESSAGES.UNAVAILABLE);
      return { ok: false, error: STORAGE_MESSAGES.UNAVAILABLE };
    }

    const currentName = activeUser?.name ?? 'current user';
    const nextState = {
      ...store,
      activeUserId: null,
      profile: null,
    };

    const res = saveStore(
      nextState,
      STORAGE_MESSAGES.USER_SAVE_FAILED(currentName)
    );
    if (!res.ok) {
      setBannerError(res.error);
      return { ok: false, error: res.error };
    }

    setStore(nextState);
    setBannerError(null);
    return { ok: true };
  }, [store, activeUser]);

  const resetDemoData = useCallback(() => {
    const seed = createSeedState();
    const res = saveStore(seed, STORAGE_MESSAGES.RESET_FAILED);
    if (!res.ok) {
      setBannerError(res.error);
      return { ok: false, error: res.error };
    }

    setStore(seed);
    setBannerError(null);
    return { ok: true };
  }, []);

  const createTicket = useCallback(
    ({ title, description, category, priority }) => {
      if (!store || !activeUser) {
        return { ok: false, error: STORAGE_MESSAGES.UNAVAILABLE };
      }

      const newTicket = createTicketRecord({
        tickets: store.tickets,
        title,
        description,
        category,
        priority,
        createdBy: activeUser.id,
      });

      const nextState = {
        ...store,
        tickets: [...store.tickets, newTicket],
      };

      const res = saveStore(nextState, STORAGE_MESSAGES.TICKET_SAVE_FAILED);
      if (!res.ok) {
        return { ok: false, error: res.error };
      }

      setStore(nextState);
      setBannerError(null);
      return { ok: true, ticket: newTicket };
    },
    [store, activeUser]
  );

  const updateTicket = useCallback(
    (ticketId, { title, description, category, priority }) => {
      if (!store || !activeUser) {
        return { ok: false, error: STORAGE_MESSAGES.UNAVAILABLE };
      }

      const existing = store.tickets.find((t) => t.id === ticketId);
      if (!canEditTicket(activeUser, existing)) {
        return { ok: false, error: STORAGE_MESSAGES.TICKET_SAVE_FAILED };
      }

      const updated = updateTicketFieldsRecord({
        ticket: existing,
        title,
        description,
        category,
        priority,
      });

      const nextState = {
        ...store,
        tickets: store.tickets.map((t) => (t.id === ticketId ? updated : t)),
      };

      const res = saveStore(nextState, STORAGE_MESSAGES.TICKET_SAVE_FAILED);
      if (!res.ok) {
        return { ok: false, error: res.error };
      }

      setStore(nextState);
      setBannerError(null);
      return { ok: true, ticket: updated };
    },
    [store, activeUser]
  );

  const updateTicketStatus = useCallback(
    (ticketId, status) => {
      if (!store || !activeUser) {
        return { ok: false, error: STORAGE_MESSAGES.UNAVAILABLE };
      }

      const existing = store.tickets.find((t) => t.id === ticketId);
      if (!existing || activeUser.role !== 'Support Staff') {
        return { ok: false, error: STORAGE_MESSAGES.STATUS_SAVE_FAILED };
      }

      const updated = updateTicketStatusRecord({
        ticket: existing,
        status,
      });

      const nextState = {
        ...store,
        tickets: store.tickets.map((t) => (t.id === ticketId ? updated : t)),
      };

      const res = saveStore(nextState, STORAGE_MESSAGES.STATUS_SAVE_FAILED);
      if (!res.ok) {
        return { ok: false, error: res.error };
      }

      setStore(nextState);
      setBannerError(null);
      return { ok: true, ticket: updated };
    },
    [store, activeUser]
  );

  const addComment = useCallback(
    (ticketId, body) => {
      if (!store || !activeUser) {
        return { ok: false, error: STORAGE_MESSAGES.UNAVAILABLE };
      }

      const existing = store.tickets.find((t) => t.id === ticketId);
      if (!canViewTicket(activeUser, existing)) {
        return { ok: false, error: STORAGE_MESSAGES.COMMENT_SAVE_FAILED };
      }

      const now = new Date().toISOString();
      const newComment = createCommentRecord({
        comments: store.comments,
        ticketId,
        authorId: activeUser.id,
        body,
        now,
      });

      const nextState = {
        ...store,
        tickets: store.tickets.map((t) =>
          t.id === ticketId ? { ...t, updatedAt: now } : t
        ),
        comments: [...store.comments, newComment],
      };

      const res = saveStore(nextState, STORAGE_MESSAGES.COMMENT_SAVE_FAILED);
      if (!res.ok) {
        return { ok: false, error: res.error };
      }

      setStore(nextState);
      setBannerError(null);
      return { ok: true, comment: newComment };
    },
    [store, activeUser]
  );

  const value = {
    users,
    tickets,
    comments,
    activeUserId,
    activeUser,
    storageUnavailable,
    bannerError,
    clearBannerError,
    registerProfile,
    clearActiveProfile,
    resetDemoData,
    createTicket,
    updateTicket,
    updateTicketStatus,
    addComment,
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return ctx;
}
