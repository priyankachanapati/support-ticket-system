import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  Check,
  Headset,
  LifeBuoy,
  User,
} from 'lucide-react';
import { POSITIONS } from '../data/constants.js';
import { useAppState } from '../context/AppState.jsx';
import { validateProfileFields } from '../utils/validate.js';
import DemoNotice from '../components/DemoNotice.jsx';

const POSITION_ICONS = {
  employee: User,
  support: Headset,
};

export default function WelcomePage() {
  const navigate = useNavigate();
  const { storageUnavailable, bannerError, registerProfile } = useAppState();
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [saveError, setSaveError] = useState(null);

  const activeError = saveError || bannerError;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaveError(null);

    const validation = validateProfileFields({ name, position });
    if (!validation.valid) {
      setFieldErrors(validation.errors);
      return;
    }

    setFieldErrors({});
    const result = registerProfile(validation.values);
    if (result.ok) {
      navigate('/dashboard');
    } else if (result.error) {
      setSaveError(result.error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-slate-50 px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-lg">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-700">
              <LifeBuoy className="h-6 w-6" aria-hidden="true" />
            </div>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">
              Employee Support Portal
            </h1>
            <p className="mt-1.5 text-sm text-slate-600">
              Welcome! Let&apos;s get you started.
            </p>
          </div>

          {activeError && (
            <div
              role="alert"
              className="mt-5 flex items-start gap-2.5 rounded-md border border-red-300 bg-red-50 p-3.5 text-sm text-red-900"
            >
              <AlertCircle
                className="mt-0.5 h-4 w-4 shrink-0 text-red-700"
                aria-hidden="true"
              />
              <span>{activeError}</span>
            </div>
          )}

          {storageUnavailable ? (
            <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <p className="font-medium text-slate-900">Storage unavailable</p>
              <p className="mt-1">
                This demonstration requires browser storage to save your profile
                and tickets. Enable browser storage and reload the page.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="profile-name"
                  className="block text-sm font-medium text-slate-900"
                >
                  Your Name
                </label>
                <input
                  id="profile-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                {fieldErrors.name && (
                  <p
                    role="alert"
                    className="mt-1.5 text-xs font-medium text-red-700"
                  >
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              <fieldset>
                <legend className="block text-sm font-medium text-slate-900">
                  Select Your Position
                </legend>
                <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {POSITIONS.map((item) => {
                    const Icon = POSITION_ICONS[item.value];
                    const isSelected = position === item.value;
                    return (
                      <label
                        key={item.value}
                        className={`relative flex cursor-pointer flex-col rounded-lg border p-4 transition-colors focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-1 ${
                          isSelected
                            ? 'border-blue-700 bg-blue-50/70 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="position"
                          value={item.value}
                          aria-label={item.label}
                          checked={isSelected}
                          onChange={() => setPosition(item.value)}
                          className="sr-only"
                        />
                        <div className="flex items-start justify-between gap-2">
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-md border ${
                              isSelected
                                ? 'border-blue-200 bg-white text-blue-700'
                                : 'border-slate-200 bg-slate-50 text-slate-600'
                            }`}
                          >
                            <Icon className="h-5 w-5" aria-hidden="true" />
                          </div>
                          {isSelected && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-700 text-white">
                              <Check className="h-3 w-3" aria-hidden="true" />
                            </span>
                          )}
                        </div>
                        <span className="mt-3 text-sm font-semibold text-slate-900">
                          {item.label}
                        </span>
                        <span className="mt-1 text-xs leading-relaxed text-slate-600">
                          {item.description}
                        </span>
                      </label>
                    );
                  })}
                </div>
                {fieldErrors.position && (
                  <p
                    role="alert"
                    className="mt-1.5 text-xs font-medium text-red-700"
                  >
                    {fieldErrors.position}
                  </p>
                )}
              </fieldset>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-blue-700 px-4 py-2.5 text-sm font-medium text-white shadow-xs transition-colors hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              >
                <span>Continue to Dashboard</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
          )}

          <div className="mt-6 space-y-2 border-t border-slate-200 pt-4 text-center">
            <div className="flex justify-center">
              <DemoNotice />
            </div>
            <p className="text-xs text-slate-500">
              Sample data note: Enter &ldquo;Ravi&rdquo; as an Employee to view
              the five preloaded sample tickets, or enter any new name to begin
              with a clean dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
