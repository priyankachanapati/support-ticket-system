import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
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

export default function EmployeeDashboardPage() {
  const { tickets, activeUser } = useAppState();
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const employeeTickets = sortTickets(
    tickets.filter((ticket) => ticket.createdBy === activeUser.id)
  );
  const filteredTickets = filterTickets(employeeTickets, filters);
  const filtersActive = hasActiveFilters(filters);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            Welcome, {activeUser.name}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Employee Dashboard &mdash; Submit and track your support tickets.
          </p>
        </div>

        <Link
          to="/tickets/new"
          className="inline-flex items-center justify-center gap-1.5 rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>Submit a ticket</span>
        </Link>
      </div>

      {employeeTickets.length === 0 ? (
        <EmptyState
          title="No tickets submitted yet"
          message="You have not submitted any support tickets yet. Submit a new ticket to get help from support staff."
          action={
            <Link
              to="/tickets/new"
              className="inline-flex items-center gap-1.5 rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span>Submit a ticket</span>
            </Link>
          }
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
            <TicketList tickets={filteredTickets} />
          )}
        </>
      )}
    </div>
  );
}
