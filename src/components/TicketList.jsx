import { Link } from 'react-router-dom';
import { formatUtcDate } from '../utils/dates.js';
import { PriorityBadge, StatusBadge } from './StatusBadge.jsx';

export default function TicketList({
  tickets,
  users = [],
  showCreator = false,
}) {
  const userNameById = new Map(users.map((u) => [u.id, u.name]));

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div
        className={`hidden border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-600 md:grid md:items-center md:gap-4 ${
          showCreator
            ? 'md:grid-cols-[minmax(0,2.2fr)_1fr_1fr_1.1fr_1fr_1.1fr]'
            : 'md:grid-cols-[minmax(0,2.5fr)_1fr_1fr_1.1fr_1.1fr]'
        }`}
      >
        <span>Title</span>
        <span>Category</span>
        <span>Priority</span>
        <span>Status</span>
        {showCreator && <span>Created by</span>}
        <span>Created date</span>
      </div>

      <ul className="divide-y divide-slate-200">
        {tickets.map((ticket) => {
          const creatorName =
            userNameById.get(ticket.createdBy) ?? ticket.createdBy;
          return (
            <li key={ticket.id}>
              <Link
                to={`/tickets/${ticket.id}`}
                className={`block px-4 py-3.5 transition-colors hover:bg-slate-50 focus:bg-slate-50 focus:outline-none md:grid md:items-center md:gap-4 ${
                  showCreator
                    ? 'md:grid-cols-[minmax(0,2.2fr)_1fr_1fr_1.1fr_1fr_1.1fr]'
                    : 'md:grid-cols-[minmax(0,2.5fr)_1fr_1fr_1.1fr_1.1fr]'
                }`}
              >
                <div className="min-w-0">
                  <span className="block break-words text-sm font-medium text-slate-900">
                    {ticket.title}
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-700 md:mt-0 md:contents">
                  <div>
                    <span className="text-slate-500 md:hidden">Category: </span>
                    <span className="text-sm text-slate-700">
                      {ticket.category}
                    </span>
                  </div>

                  <div>
                    <PriorityBadge priority={ticket.priority} />
                  </div>

                  <div>
                    <StatusBadge status={ticket.status} />
                  </div>

                  {showCreator && (
                    <div className="text-sm text-slate-700">
                      <span className="text-xs text-slate-500 md:hidden">
                        Created by:{' '}
                      </span>
                      <span>{creatorName}</span>
                    </div>
                  )}

                  <div className="text-sm text-slate-600">
                    <span className="text-xs text-slate-500 md:hidden">
                      Created:{' '}
                    </span>
                    <span>{formatUtcDate(ticket.createdAt)}</span>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
