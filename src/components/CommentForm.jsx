import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { validateCommentBody } from '../utils/validate.js';

export default function CommentForm({ onSubmit }) {
  const [body, setBody] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateCommentBody(body);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setError(null);
    const result = onSubmit(validation.value);
    if (result && result.ok) {
      setBody('');
    } else if (result && !result.ok) {
      setError(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      <div>
        <label
          htmlFor="comment-body"
          className="block text-sm font-medium text-slate-900"
        >
          Add a comment
        </label>
        <textarea
          id="comment-body"
          name="comment"
          rows={3}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write a comment..."
          className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
        />
        {error && (
          <div
            role="alert"
            className="mt-1.5 flex items-start gap-2 rounded-md border border-red-300 bg-red-50 p-2.5 text-xs font-medium text-red-900"
          >
            <AlertCircle
              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-700"
              aria-hidden="true"
            />
            <span>{error}</span>
          </div>
        )}
      </div>

      <button
        type="submit"
        className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1"
      >
        Post comment
      </button>
    </form>
  );
}
