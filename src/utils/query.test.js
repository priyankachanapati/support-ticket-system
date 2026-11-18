import { SEED_TICKETS } from '../data/seed.js';
import { filterTickets, hasActiveFilters } from './query.js';

describe('query utilities', () => {
  it('filters by trimmed case-insensitive title substring and combined dropdowns', () => {
    expect(
      filterTickets(SEED_TICKETS, { search: '  vpn  ' }).map((t) => t.id)
    ).toEqual(['tkt-1002']);

    expect(
      filterTickets(SEED_TICKETS, {
        status: 'Open',
        category: 'Hardware',
        priority: 'High',
      }).map((t) => t.id)
    ).toEqual(['tkt-1001']);

    expect(
      filterTickets(SEED_TICKETS, {
        search: 'monitor',
        status: 'Closed',
      }).map((t) => t.id)
    ).toEqual(['tkt-1005']);
  });

  it('detects active filters accurately', () => {
    expect(
      hasActiveFilters({
        search: '',
        status: 'All',
        category: 'All',
        priority: 'All',
      })
    ).toBe(false);

    expect(
      hasActiveFilters({
        search: 'laptop',
        status: 'All',
        category: 'All',
        priority: 'All',
      })
    ).toBe(true);

    expect(
      hasActiveFilters({
        search: '',
        status: 'Open',
        category: 'All',
        priority: 'All',
      })
    ).toBe(true);
  });
});
