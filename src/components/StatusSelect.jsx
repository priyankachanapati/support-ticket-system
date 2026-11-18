import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { STATUSES } from '../data/constants.js';

export default function StatusSelect({ currentStatus, onChangeStatus }) {
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const nextStatus = e.target.value;
    setError(null);
    const result = onChangeStatus(nextStatus);
    if (result && !result.ok) {
      setError(result.error);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <label
          htmlFor="ticket-status-select"
          className="text-sm font-medium text-slate-900"
        >
          Update status
        </label>
        <select
          id="ticket-status-select"
          value={currentStatus}
          onChange={handleChange}
          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
        >
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-900"
        >
          <AlertCircle
            className="mt-0.5 h-4 w-4 shrink-0 text-red-700"
            aria-hidden="true"
          />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
