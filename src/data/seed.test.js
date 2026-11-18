import { createSeedState, SEED_COMMENTS, SEED_TICKETS } from './seed.js';
import { USERS } from './constants.js';

describe('seed data', () => {
  it('matches SPEC.md section 11 users, tickets, and comments with unregistered initial profile', () => {
    const seed = createSeedState();

    expect(seed.users).toEqual(USERS);
    expect(seed.activeUserId).toBeNull();
    expect(seed.profile).toBeNull();
    expect(seed.tickets).toHaveLength(5);
    expect(seed.tickets.map((t) => t.id)).toEqual([
      'tkt-1001',
      'tkt-1002',
      'tkt-1003',
      'tkt-1004',
      'tkt-1005',
    ]);
    expect(seed.tickets.every((t) => t.createdBy === 'user-ravi')).toBe(true);
    expect(seed.comments).toHaveLength(4);
    expect(seed.comments.map((c) => c.id)).toEqual([
      'cmt-2001',
      'cmt-2002',
      'cmt-2003',
      'cmt-2004',
    ]);
  });

  it('returns fresh cloned arrays and objects on each call', () => {
    const first = createSeedState();
    first.tickets[0].title = 'Changed';
    first.comments[0].body = 'Changed';

    const second = createSeedState();
    expect(second.tickets[0].title).toBe(SEED_TICKETS[0].title);
    expect(second.comments[0].body).toBe(SEED_COMMENTS[0].body);
  });
});
