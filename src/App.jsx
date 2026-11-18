import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppStateProvider, useAppState } from './context/AppState.jsx';
import AppShell from './components/AppShell.jsx';
import EmployeeDashboardPage from './pages/EmployeeDashboardPage.jsx';
import SupportDashboardPage from './pages/SupportDashboardPage.jsx';
import TicketDetailPage from './pages/TicketDetailPage.jsx';
import TicketFormPage from './pages/TicketFormPage.jsx';
import WelcomePage from './pages/WelcomePage.jsx';

export function AppRoutes() {
  const { activeUser } = useAppState();

  if (!activeUser) {
    return (
      <Routes>
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="*" element={<Navigate to="/welcome" replace />} />
      </Routes>
    );
  }

  const isSupportStaff = activeUser.role === 'Support Staff';

  return (
    <AppShell>
      <Routes>
        <Route
          path="/dashboard"
          element={
            isSupportStaff ? (
              <SupportDashboardPage />
            ) : (
              <EmployeeDashboardPage />
            )
          }
        />
        <Route path="/tickets/new" element={<TicketFormPage mode="create" />} />
        <Route path="/tickets/:id" element={<TicketDetailPage />} />
        <Route
          path="/tickets/:id/edit"
          element={<TicketFormPage mode="edit" />}
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppShell>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AppStateProvider>
  );
}
