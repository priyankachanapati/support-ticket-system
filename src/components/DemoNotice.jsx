import { Info } from 'lucide-react';
import { DEMO_NOTICE } from '../data/constants.js';

export default function DemoNotice() {
  return (
    <p className="inline-flex items-center gap-1.5 text-xs text-slate-600">
      <Info className="h-3.5 w-3.5 shrink-0 text-slate-500" aria-hidden="true" />
      <span>{DEMO_NOTICE}</span>
    </p>
  );
}
