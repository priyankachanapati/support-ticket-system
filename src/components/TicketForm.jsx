import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { CATEGORIES, PRIORITIES } from '../data/constants.js';
import { validateTicketFields } from '../utils/validate.js';

export default function TicketForm({
  initialValues = {
    title: '',
    description: '',
    category: '',
    priority: '',
  },
  submitLabel,
  cancelTo,
  onSubmit,
}) {
  const [title, setTitle] = useState(initialValues.title);
  const [description, setDescription] = useState(initialValues.description);
  const [category, setCategory] = useState(initialValues.category);
  const [priority, setPriority] = useState(initialValues.priority);
  const [fieldErrors, setFieldErrors] = useState({});
  const [saveError, setSaveError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaveError(null);

    const result = validateTicketFields({
      title,
      description,
      category,
      priority,
    });

    if (!result.valid) {
      setFieldErrors(result.errors);
      return;
    }

    setFieldErrors({});
    const saveResult = onSubmit(result.values);
    if (saveResult && !saveResult.ok) {
      setSaveError(saveResult.error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5 rounded-lg border border-slate-200 bg-white p-5 sm:p-6"
    >
      {saveError && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-900"
        >
          <AlertCircle
            className="mt-0.5 h-4 w-4 shrink-0 text-red-700"
            aria-hidden="true"
          />
          <span>{saveError}</span>
        </div>
      )}

      <div>
        <label
          htmlFor="ticket-title"
          className="block text-sm font-medium text-slate-900"
        >
          Title
        </label>
        <input
          id="ticket-title"
          name="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
        />
        {fieldErrors.title && (
          <p role="alert" className="mt-1 text-xs font-medium text-red-700">
            {fieldErrors.title}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="ticket-description"
          className="block text-sm font-medium text-slate-900"
        >
          Description
        </label>
        <textarea
          id="ticket-description"
          name="description"
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
        />
        {fieldErrors.description && (
          <p role="alert" className="mt-1 text-xs font-medium text-red-700">
            {fieldErrors.description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="ticket-category"
            className="block text-sm font-medium text-slate-900"
          >
            Category
          </label>
          <select
            id="ticket-category"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {fieldErrors.category && (
            <p role="alert" className="mt-1 text-xs font-medium text-red-700">
              {fieldErrors.category}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="ticket-priority"
            className="block text-sm font-medium text-slate-900"
          >
            Priority
          </label>
          <select
            id="ticket-priority"
            name="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="">Select a priority</option>
            {PRIORITIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {fieldErrors.priority && (
            <p role="alert" className="mt-1 text-xs font-medium text-red-700">
              {fieldErrors.priority}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="submit"
          className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1"
        >
          {submitLabel}
        </button>
        <Link
          to={cancelTo}
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
