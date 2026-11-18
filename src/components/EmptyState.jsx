export default function EmptyState({ title, message, action }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 text-center sm:p-8">
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm text-slate-600">{message}</p>
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}
