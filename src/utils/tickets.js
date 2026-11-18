import { EDITABLE_STATUSES, STATUSES } from '../data/constants.js';

function parseNumericSuffix(id, prefix) {
  if (typeof id !== 'string' || !id.startsWith(prefix)) {
    return 0;
  }
  const num = Number.parseInt(id.slice(prefix.length), 10);
  return Number.isNaN(num) ? 0 : num;
}

export function getNextTicketId(tickets) {
  let max = 1000;
  for (const ticket of tickets) {
    const num = parseNumericSuffix(ticket?.id, 'tkt-');
    if (num > max) {
      max = num;
    }
  }
  return `tkt-${max + 1}`;
}

export function getNextCommentId(comments) {
  let max = 2000;
  for (const comment of comments) {
    const num = parseNumericSuffix(comment?.id, 'cmt-');
    if (num > max) {
      max = num;
    }
  }
  return `cmt-${max + 1}`;
}

export function sortTickets(tickets) {
  return [...tickets].sort((a, b) => {
    const timeDiff = Date.parse(b.createdAt) - Date.parse(a.createdAt);
    if (timeDiff !== 0) {
      return timeDiff;
    }
    return (
      parseNumericSuffix(b.id, 'tkt-') - parseNumericSuffix(a.id, 'tkt-')
    );
  });
}

export function sortComments(comments) {
  return [...comments].sort((a, b) => {
    const timeDiff = Date.parse(a.createdAt) - Date.parse(b.createdAt);
    if (timeDiff !== 0) {
      return timeDiff;
    }
    return (
      parseNumericSuffix(a.id, 'cmt-') - parseNumericSuffix(b.id, 'cmt-')
    );
  });
}

export function canViewTicket(user, ticket) {
  if (!user || !ticket) {
    return false;
  }
  if (user.role === 'Support Staff') {
    return true;
  }
  return ticket.createdBy === user.id;
}

export function canEditTicket(user, ticket) {
  if (!user || !ticket) {
    return false;
  }
  return (
    user.role === 'Employee' &&
    ticket.createdBy === user.id &&
    EDITABLE_STATUSES.includes(ticket.status)
  );
}

export function createTicketRecord({
  tickets,
  title,
  description,
  category,
  priority,
  createdBy,
  now = new Date().toISOString(),
}) {
  return {
    id: getNextTicketId(tickets),
    title,
    description,
    category,
    priority,
    status: 'Open',
    createdBy,
    createdAt: now,
    updatedAt: now,
  };
}

export function updateTicketFieldsRecord({
  ticket,
  title,
  description,
  category,
  priority,
  now = new Date().toISOString(),
}) {
  return {
    ...ticket,
    title,
    description,
    category,
    priority,
    updatedAt: now,
  };
}

export function updateTicketStatusRecord({
  ticket,
  status,
  now = new Date().toISOString(),
}) {
  if (!STATUSES.includes(status)) {
    throw new Error(`Invalid status: ${status}`);
  }
  return {
    ...ticket,
    status,
    updatedAt: now,
  };
}

export function createCommentRecord({
  comments,
  ticketId,
  authorId,
  body,
  now = new Date().toISOString(),
}) {
  return {
    id: getNextCommentId(comments),
    ticketId,
    authorId,
    body,
    createdAt: now,
  };
}
