import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAppState } from '../context/AppState.jsx';
import { canEditTicket } from '../utils/tickets.js';
import TicketForm from '../components/TicketForm.jsx';

export default function TicketFormPage({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tickets, activeUser, createTicket, updateTicket } = useAppState();

  if (mode === 'create') {
    if (activeUser.role !== 'Employee') {
      return <Navigate to="/dashboard" replace />;
    }

    const handleCreate = (values) => {
      const result = createTicket(values);
      if (result.ok) {
        navigate(`/tickets/${result.ticket.id}`);
      }
      return result;
    };

    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Back to dashboard</span>
          </Link>
          <h1 className="text-xl font-semibold text-slate-900">
            Submit Support Ticket
          </h1>
          <p className="text-sm text-slate-600">
            Submitting as {activeUser.name}. New tickets start with status Open.
          </p>
        </div>

        <TicketForm
          submitLabel="Submit ticket"
          cancelTo="/dashboard"
          onSubmit={handleCreate}
        />
      </div>
    );
  }

  const ticket = tickets.find((t) => t.id === id);
  if (!ticket || !canEditTicket(activeUser, ticket)) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleEdit = (values) => {
    const result = updateTicket(ticket.id, values);
    if (result.ok) {
      navigate(`/tickets/${ticket.id}`);
    }
    return result;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Link
          to={`/tickets/${ticket.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Back to ticket</span>
        </Link>
        <h1 className="text-xl font-semibold text-slate-900">Edit Ticket</h1>
        <p className="text-sm text-slate-600">
          Editing {ticket.id}. Status ({ticket.status}), creator, and created
          date remain unchanged.
        </p>
      </div>

      <TicketForm
        key={ticket.id}
        initialValues={{
          title: ticket.title,
          description: ticket.description,
          category: ticket.category,
          priority: ticket.priority,
        }}
        submitLabel="Save changes"
        cancelTo={`/tickets/${ticket.id}`}
        onSubmit={handleEdit}
      />
    </div>
  );
}
