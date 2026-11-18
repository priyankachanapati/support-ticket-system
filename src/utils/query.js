export function filterTickets(
  tickets,
  { search = '', status = 'All', category = 'All', priority = 'All' } = {}
) {
  const normalizedQuery =
    typeof search === 'string' ? search.trim().toLowerCase() : '';

  return tickets.filter((ticket) => {
    if (normalizedQuery) {
      const titleLower = String(ticket.title || '').toLowerCase();
      if (!titleLower.includes(normalizedQuery)) {
        return false;
      }
    }
    if (status !== 'All' && ticket.status !== status) {
      return false;
    }
    if (category !== 'All' && ticket.category !== category) {
      return false;
    }
    if (priority !== 'All' && ticket.priority !== priority) {
      return false;
    }
    return true;
  });
}

export function hasActiveFilters({
  search = '',
  status = 'All',
  category = 'All',
  priority = 'All',
} = {}) {
  return (
    Boolean(search && search.length > 0) ||
    status !== 'All' ||
    category !== 'All' ||
    priority !== 'All'
  );
}
