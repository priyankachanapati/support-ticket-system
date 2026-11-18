import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App.jsx';

async function registerUser(user, name, positionLabel) {
  await user.type(screen.getByLabelText('Your Name'), name);
  await user.click(screen.getByRole('radio', { name: positionLabel }));
  await user.click(
    screen.getByRole('button', { name: /Continue to Dashboard/i })
  );
}

describe('EmployeeDashboardPage', () => {
  it('renders Ravi five seed tickets in newest-first order and Priya empty state', async () => {
    const user = userEvent.setup();
    render(<App />);

    await registerUser(user, 'Ravi', /Employee/i);

    const items = screen.getAllByRole('link', {
      name: /Laptop not charging|Cannot log in to VPN|Need access to the shared project folder|Excel keeps crashing on startup|Request a second monitor/,
    });
    expect(items.map((el) => el.textContent)).toEqual([
      expect.stringContaining('Laptop not charging'),
      expect.stringContaining('Cannot log in to VPN'),
      expect.stringContaining('Need access to the shared project folder'),
      expect.stringContaining('Excel keeps crashing on startup'),
      expect.stringContaining('Request a second monitor'),
    ]);

    expect(screen.getByText('18 Nov 2026')).toBeInTheDocument();
    expect(screen.getByText('2 Nov 2026')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Change Profile/i }));
    await registerUser(user, 'Priya', /Employee/i);

    expect(screen.getByText('Welcome, Priya')).toBeInTheDocument();
    expect(screen.getByText('No tickets submitted yet')).toBeInTheDocument();
    expect(screen.queryByText('Laptop not charging')).not.toBeInTheDocument();
  });

  it('supports combined search and filters and clears them back', async () => {
    const user = userEvent.setup();
    render(<App />);

    await registerUser(user, 'Ravi', /Employee/i);

    await user.type(screen.getByLabelText('Search by title'), 'vpn');
    expect(screen.getByText('Cannot log in to VPN')).toBeInTheDocument();
    expect(screen.queryByText('Laptop not charging')).not.toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: /Clear search and filters/i })
    );
    expect(screen.getByText('Laptop not charging')).toBeInTheDocument();
  });
});
