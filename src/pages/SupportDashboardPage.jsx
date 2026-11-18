import { useState } from 'react';
import { useAppState } from '../context/AppState.jsx';
import { filterTickets, hasActiveFilters } from '../utils/query.js';
import { sortTickets } from '../utils/tickets.js';
import EmptyState from '../components/EmptyState.jsx';
import SearchFilters from '../components/SearchFilters.jsx';
import TicketList from '../components/TicketList.jsx';

const INITIAL_FILTERS = {
  search: '',
  status: 'All',
  category: 'All',
  priority: 'All',
};

export default function SupportDashboardPage() {
  const { tickets, users, activeUser } = useAppState();
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const allTickets = sortTickets(tickets);
  const filteredTickets = filterTickets(allTickets, filters);
  const filtersActive = hasActiveFilters(filters);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          Welcome, {activeUser.name}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Support Dashboard &mdash; Manage employee tickets and resolve support
          requests.
        </p>
      </div>

      {allTickets.length === 0 ? (
        <EmptyState
          title="No support tickets"
          message="There are currently no support tickets in the queue."
        />
      ) : (
        <>
          <SearchFilters
            filters={filters}
            onChange={setFilters}
            onClear={() => setFilters(INITIAL_FILTERS)}
          />

          {filteredTickets.length === 0 ? (
            <EmptyState
              title="No matching tickets"
              message="No tickets match your current search or filters."
              action={
                filtersActive ? (
                  <button
                    type="button"
                    onClick={() => setFilters(INITIAL_FILTERS)}
                    className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    Clear search and filters
                  </button>
                ) : null
              }
            />
          ) : (
            <TicketList
              tickets={filteredTickets}
              users={users}
              showCreator={true}
            />
          )}
        </>
      )}
    </div>
  );
}
