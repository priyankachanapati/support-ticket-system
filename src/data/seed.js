import { USERS } from './constants.js';

export const SEED_TICKETS = [
  {
    id: 'tkt-1001',
    title: 'Laptop not charging',
    description: 'My laptop shows 0% even when plugged in.',
    category: 'Hardware',
    priority: 'High',
    status: 'Open',
    createdBy: 'user-ravi',
    createdAt: '2026-11-18T09:15:00.000Z',
    updatedAt: '2026-11-18T09:15:00.000Z',
  },
  {
    id: 'tkt-1002',
    title: 'Cannot log in to VPN',
    description:
      'The VPN client rejects my sign-in and then times out after about 30 seconds. Other websites work on the office Wi-Fi.',
    category: 'Network',
    priority: 'High',
    status: 'In Progress',
    createdBy: 'user-ravi',
    createdAt: '2026-11-16T11:00:00.000Z',
    updatedAt: '2026-11-17T16:30:00.000Z',
  },
  {
    id: 'tkt-1003',
    title: 'Need access to the shared project folder',
    description:
      'I need read access to the shared project folder that holds the onboarding documents. The folder returns an access-denied message for my account.',
    category: 'Access',
    priority: 'Medium',
    status: 'Open',
    createdBy: 'user-ravi',
    createdAt: '2026-11-15T14:20:00.000Z',
    updatedAt: '2026-11-15T14:20:00.000Z',
  },
  {
    id: 'tkt-1004',
    title: 'Excel keeps crashing on startup',
    description:
      'Excel closes immediately after the splash screen. The other Office apps on this laptop open normally.',
    category: 'Software',
    priority: 'Medium',
    status: 'Resolved',
    createdBy: 'user-ravi',
    createdAt: '2026-11-10T08:40:00.000Z',
    updatedAt: '2026-11-12T13:10:00.000Z',
  },
  {
    id: 'tkt-1005',
    title: 'Request a second monitor',
    description:
      'I need a second monitor at my desk so I can compare spreadsheets side by side.',
    category: 'Hardware',
    priority: 'Low',
    status: 'Closed',
    createdBy: 'user-ravi',
    createdAt: '2026-11-02T10:05:00.000Z',
    updatedAt: '2026-11-06T09:45:00.000Z',
  },
];

export const SEED_COMMENTS = [
  {
    id: 'cmt-2001',
    ticketId: 'tkt-1002',
    authorId: 'user-alex',
    body: 'I am checking the VPN profile assigned to your account.',
    createdAt: '2026-11-17T16:30:00.000Z',
  },
  {
    id: 'cmt-2002',
    ticketId: 'tkt-1004',
    authorId: 'user-alex',
    body: 'A repair build was applied. Please reopen this ticket if Excel still closes at startup.',
    createdAt: '2026-11-12T13:10:00.000Z',
  },
  {
    id: 'cmt-2003',
    ticketId: 'tkt-1005',
    authorId: 'user-ravi',
    body: 'One external display is enough. HDMI is fine.',
    createdAt: '2026-11-04T09:00:00.000Z',
  },
  {
    id: 'cmt-2004',
    ticketId: 'tkt-1005',
    authorId: 'user-alex',
    body: 'A second monitor has been issued and this request is closed.',
    createdAt: '2026-11-06T09:45:00.000Z',
  },
];

export function createSeedState() {
  return {
    users: USERS.map((user) => ({ ...user })),
    tickets: SEED_TICKETS.map((ticket) => ({ ...ticket })),
    comments: SEED_COMMENTS.map((comment) => ({ ...comment })),
    activeUserId: null,
    profile: null,
  };
}
