import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  LifeBuoy,
  RotateCcw,
  UserCheck,
  UserCog,
} from 'lucide-react';
import { useAppState } from '../context/AppState.jsx';
import DemoNotice from './DemoNotice.jsx';

export default function AppShell({ children }) {
  const navigate = useNavigate();
  const {
    activeUser,
    storageUnavailable,
    bannerError,
    clearActiveProfile,
    resetDemoData,
  } = useAppState();
  const [confirmingReset, setConfirmingReset] = useState(false);

  const roleLabel =
    activeUser?.role === 'Support Staff' ? 'Support Team' : 'Employee';

  const handleChangeProfile = () => {
    const result = clearActiveProfile();
    if (result.ok) {
      navigate('/welcome');
    }
  };

  const handleConfirmReset = () => {
    const result = resetDemoData();
    setConfirmingReset(false);
    if (result.ok) {
      navigate('/welcome');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-2">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 text-lg font-semibold text-slate-900 hover:text-blue-700 sm:text-xl"
              >
                <LifeBuoy
                  className="h-5 w-5 shrink-0 text-blue-700"
                  aria-hidden="true"
                />
                <span>Employee Support Portal</span>
              </Link>

              {activeUser && (
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700">
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 font-medium text-slate-800">
                    <UserCheck
                      className="h-3.5 w-3.5 text-blue-700"
                      aria-hidden="true"
                    />
                    <span>{activeUser.name}</span>
                    <span className="text-slate-500">({roleLabel})</span>
                  </span>
                </div>
              )}

              <DemoNotice />
            </div>

            <div className="flex flex-col items-start gap-2 sm:items-end">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleChangeProfile}
                  className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1"
                >
                  <UserCog className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Change Profile</span>
                </button>

                {!confirmingReset && (
                  <button
                    type="button"
                    onClick={() => setConfirmingReset(true)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Reset demonstration data</span>
                  </button>
                )}
              </div>

              {confirmingReset && (
                <div
                  role="dialog"
                  aria-label="Confirm reset demonstration data"
                  className="w-full max-w-xs rounded-md border border-amber-300 bg-amber-50 p-3 text-xs text-slate-800"
                >
                  <p className="font-medium text-slate-900">
                    Restore the original sample tickets and comments? This
                    returns to the welcome screen.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleConfirmReset}
                      className="rounded-md bg-amber-700 px-2.5 py-1 font-medium text-white hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-600"
                    >
                      Confirm reset
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmingReset(false)}
                      className="rounded-md border border-slate-300 bg-white px-2.5 py-1 font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        {bannerError && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-2.5 rounded-md border border-red-300 bg-red-50 p-3.5 text-sm text-red-900"
          >
            <AlertCircle
              className="mt-0.5 h-4 w-4 shrink-0 text-red-700"
              aria-hidden="true"
            />
            <span>{bannerError}</span>
          </div>
        )}

        {storageUnavailable ? (
          <section className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-700">
            <h1 className="text-base font-semibold text-slate-900">
              Storage unavailable
            </h1>
            <p className="mt-2">
              This demonstration requires browser storage to save and display
              tickets. Enable browser storage and reload the page.
            </p>
          </section>
        ) : (
          children
        )}
      </main>
    </div>
  );
}
