import { Search, X } from 'lucide-react';
import { CATEGORIES, PRIORITIES, STATUSES } from '../data/constants.js';
import { hasActiveFilters } from '../utils/query.js';

export default function SearchFilters({ filters, onChange, onClear }) {
  const showClear = hasActiveFilters(filters);

  return (
    <section
      aria-label="Search and filter tickets"
      className="rounded-lg border border-slate-200 bg-white p-4"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label
            htmlFor="ticket-search"
            className="block text-xs font-medium text-slate-700"
          >
            Search by title
          </label>
          <div className="relative mt-1">
            <Search
              className="pointer-events-none absolute top-2.5 left-2.5 h-4 w-4 text-slate-400"
              aria-hidden="true"
            />
            <input
              id="ticket-search"
              type="search"
              value={filters.search}
              onChange={(e) =>
                onChange({ ...filters, search: e.target.value })
              }
              placeholder="Filter by title..."
              className="w-full rounded-md border border-slate-300 bg-white py-1.5 pr-3 pl-8 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="filter-status"
            className="block text-xs font-medium text-slate-700"
          >
            Status
          </label>
          <select
            id="filter-status"
            value={filters.status}
            onChange={(e) =>
              onChange({ ...filters, status: e.target.value })
            }
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="All">All</option>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="filter-category"
            className="block text-xs font-medium text-slate-700"
          >
            Category
          </label>
          <select
            id="filter-category"
            value={filters.category}
            onChange={(e) =>
              onChange({ ...filters, category: e.target.value })
            }
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="All">All</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="filter-priority"
            className="block text-xs font-medium text-slate-700"
          >
            Priority
          </label>
          <select
            id="filter-priority"
            value={filters.priority}
            onChange={(e) =>
              onChange({ ...filters, priority: e.target.value })
            }
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="All">All</option>
            {PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>
      </div>

      {showClear && (
        <div className="mt-3 flex justify-end border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Clear search and filters</span>
          </button>
        </div>
      )}
    </section>
  );
}
