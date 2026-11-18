import { SEED_TICKETS } from '../data/seed.js';
import { USERS } from '../data/constants.js';
import {
  canEditTicket,
  canViewTicket,
  createTicketRecord,
  getNextCommentId,
  getNextTicketId,
  sortTickets,
  updateTicketStatusRecord,
} from './tickets.js';

describe('ticket utilities', () => {
  const [ravi, priya, alex] = USERS;

  it('generates sequential tkt- and cmt- IDs from highest suffix', () => {
    expect(getNextTicketId(SEED_TICKETS)).toBe('tkt-1006');
    expect(getNextTicketId([])).toBe('tkt-1001');
    expect(getNextCommentId([{ id: 'cmt-2004' }])).toBe('cmt-2005');
    expect(getNextCommentId([])).toBe('cmt-2001');
  });

  it('sorts tickets newest createdAt first with higher id tiebreaker', () => {
    const sorted = sortTickets([
      { id: 'tkt-1001', createdAt: '2026-11-18T09:15:00.000Z' },
      { id: 'tkt-1002', createdAt: '2026-11-18T09:15:00.000Z' },
      { id: 'tkt-1003', createdAt: '2026-11-19T09:15:00.000Z' },
    ]);
    expect(sorted.map((t) => t.id)).toEqual(['tkt-1003', 'tkt-1002', 'tkt-1001']);
  });

  it('enforces view and edit permissions including Closed lock', () => {
    const openRavi = SEED_TICKETS[0];
    const resolvedRavi = SEED_TICKETS[3];
    const closedRavi = SEED_TICKETS[4];

    expect(canViewTicket(ravi, openRavi)).toBe(true);
    expect(canViewTicket(priya, openRavi)).toBe(false);
    expect(canViewTicket(alex, openRavi)).toBe(true);

    expect(canEditTicket(ravi, openRavi)).toBe(true);
    expect(canEditTicket(ravi, resolvedRavi)).toBe(true);
    expect(canEditTicket(ravi, closedRavi)).toBe(false);
    expect(canEditTicket(priya, openRavi)).toBe(false);
    expect(canEditTicket(alex, openRavi)).toBe(false);
  });

  it('creates Open tickets and lets support staff transition to any status', () => {
    const created = createTicketRecord({
      tickets: SEED_TICKETS,
      title: 'Test',
      description: 'Details',
      category: 'Other',
      priority: 'Low',
      createdBy: 'user-priya',
      now: '2026-11-19T12:00:00.000Z',
    });

    expect(created.id).toBe('tkt-1006');
    expect(created.status).toBe('Open');
    expect(created.createdAt).toBe(created.updatedAt);

    const closed = updateTicketStatusRecord({
      ticket: created,
      status: 'Closed',
      now: '2026-11-19T13:00:00.000Z',
    });
    expect(closed.status).toBe('Closed');
    expect(closed.updatedAt).toBe('2026-11-19T13:00:00.000Z');

    const reopened = updateTicketStatusRecord({
      ticket: closed,
      status: 'In Progress',
      now: '2026-11-19T14:00:00.000Z',
    });
    expect(reopened.status).toBe('In Progress');
  });
});
