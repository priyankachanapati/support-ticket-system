import {
  AlertTriangle,
  Archive,
  ArrowDown,
  CheckCircle2,
  CircleDot,
  Clock,
  Minus,
} from 'lucide-react';

const STATUS_STYLES = {
  Open: {
    classes: 'border-blue-200 bg-blue-50 text-blue-800',
    Icon: CircleDot,
  },
  'In Progress': {
    classes: 'border-amber-200 bg-amber-50 text-amber-800',
    Icon: Clock,
  },
  Resolved: {
    classes: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    Icon: CheckCircle2,
  },
  Closed: {
    classes: 'border-slate-300 bg-slate-100 text-slate-700',
    Icon: Archive,
  },
};

const PRIORITY_STYLES = {
  High: {
    classes: 'border-red-200 bg-red-50 text-red-800',
    Icon: AlertTriangle,
  },
  Medium: {
    classes: 'border-amber-200 bg-amber-50 text-amber-800',
    Icon: Minus,
  },
  Low: {
    classes: 'border-slate-200 bg-slate-50 text-slate-700',
    Icon: ArrowDown,
  },
};

export function StatusBadge({ status }) {
  const config = STATUS_STYLES[status] ?? STATUS_STYLES.Open;
  const { classes, Icon } = config;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-xs font-medium whitespace-nowrap ${classes}`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{status}</span>
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const config = PRIORITY_STYLES[priority] ?? PRIORITY_STYLES.Medium;
  const { classes, Icon } = config;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-xs font-medium whitespace-nowrap ${classes}`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{priority}</span>
    </span>
  );
}
