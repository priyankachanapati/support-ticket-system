import { formatUtcDateTime } from '../utils/dates.js';
import { sortComments } from '../utils/tickets.js';

export default function CommentList({ comments, users }) {
  const userNameById = new Map(users.map((u) => [u.id, u.name]));
  const ordered = sortComments(comments);

  if (ordered.length === 0) {
    return (
      <p className="rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        There are no comments yet.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {ordered.map((comment) => {
        const authorName =
          userNameById.get(comment.authorId) ?? comment.authorId;
        return (
          <li
            key={comment.id}
            className="rounded-md border border-slate-200 bg-slate-50 p-4"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs text-slate-600">
              <span className="font-semibold text-slate-900">{authorName}</span>
              <span>{formatUtcDateTime(comment.createdAt)}</span>
            </div>
            <p className="mt-2 whitespace-pre-wrap break-words text-sm text-slate-800">
              {comment.body}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
