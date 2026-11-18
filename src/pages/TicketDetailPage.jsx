import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil } from 'lucide-react';
import { useAppState } from '../context/AppState.jsx';
import { formatUtcDate } from '../utils/dates.js';
import { canEditTicket, canViewTicket } from '../utils/tickets.js';
import CommentForm from '../components/CommentForm.jsx';
import CommentList from '../components/CommentList.jsx';
import StatusSelect from '../components/StatusSelect.jsx';
import { PriorityBadge, StatusBadge } from '../components/StatusBadge.jsx';

export default function TicketDetailPage() {
  const { id } = useParams();
  const {
    tickets,
    comments,
    users,
    activeUser,
    updateTicketStatus,
    addComment,
  } = useAppState();

  const ticket = tickets.find((t) => t.id === id);

  if (!ticket || !canViewTicket(activeUser, ticket)) {
    return <Navigate to="/dashboard" replace />;
  }

  const creator = users.find((u) => u.id === ticket.createdBy);
  const creatorName = creator ? creator.name : ticket.createdBy;
  const ticketComments = comments.filter((c) => c.ticketId === ticket.id);
  const editable = canEditTicket(activeUser, ticket);
  const isSupportStaff = activeUser.role === 'Support Staff';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Back to dashboard</span>
        </Link>

        {editable && (
          <Link
            to={`/tickets/${ticket.id}/edit`}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
            <span>Edit ticket</span>
          </Link>
        )}
      </div>

      <article className="rounded-lg border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-3 border-b border-slate-200 pb-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-mono">{ticket.id}</span>
          </div>
          <h1 className="break-words text-xl font-semibold text-slate-900">
            {ticket.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
            <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700">
              {ticket.category}
            </span>
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-1 gap-4 border-b border-slate-200 pb-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Created by
            </dt>
            <dd className="mt-1 font-medium text-slate-900">{creatorName}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Created date
            </dt>
            <dd className="mt-1 text-slate-800">
              {formatUtcDate(ticket.createdAt)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Last updated
            </dt>
            <dd className="mt-1 text-slate-800">
              {formatUtcDate(ticket.updatedAt)}
            </dd>
          </div>
        </dl>

        <div className="mt-4">
          <h2 className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Description
          </h2>
          <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-800">
            {ticket.description}
          </p>
        </div>

        {isSupportStaff && (
          <div className="mt-6 border-t border-slate-200 pt-4">
            <StatusSelect
              currentStatus={ticket.status}
              onChangeStatus={(nextStatus) =>
                updateTicketStatus(ticket.id, nextStatus)
              }
            />
          </div>
        )}
      </article>

      <section
        aria-labelledby="comments-heading"
        className="space-y-4 rounded-lg border border-slate-200 bg-white p-5 sm:p-6"
      >
        <h2
          id="comments-heading"
          className="text-base font-semibold text-slate-900"
        >
          Comments ({ticketComments.length})
        </h2>

        <CommentList comments={ticketComments} users={users} />

        <div className="border-t border-slate-200 pt-4">
          <CommentForm onSubmit={(body) => addComment(ticket.id, body)} />
        </div>
      </section>
    </div>
  );
}
