import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App.jsx';
import {
  DEMO_NOTICE,
  STORAGE_KEY,
  STORAGE_MESSAGES,
  VALIDATION_MESSAGES,
} from '../data/constants.js';
import { createSeedState } from '../data/seed.js';

describe('WelcomePage', () => {
  it('validates required name and position without navigating', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText(DEMO_NOTICE)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Enter your full name')
    ).toBeInTheDocument();

    await user.type(screen.getByLabelText('Your Name'), '   ');
    await user.click(
      screen.getByRole('button', { name: /Continue to Dashboard/i })
    );

    expect(
      screen.getByText(VALIDATION_MESSAGES.NAME_REQUIRED)
    ).toBeInTheDocument();
    expect(
      screen.getByText(VALIDATION_MESSAGES.POSITION_REQUIRED)
    ).toBeInTheDocument();
    expect(
      screen.getByText("Welcome! Let's get you started.")
    ).toBeInTheDocument();
  });

  it('registers a new employee with an empty dashboard and isolates Ravi sample tickets', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText('Your Name'), '  Maya Chen  ');
    await user.click(screen.getByRole('radio', { name: /Employee/i }));
    await user.click(
      screen.getByRole('button', { name: /Continue to Dashboard/i })
    );

    expect(screen.getByText('Welcome, Maya Chen')).toBeInTheDocument();
    expect(screen.getByText('No tickets submitted yet')).toBeInTheDocument();
    expect(screen.queryByText('Laptop not charging')).not.toBeInTheDocument();
  });

  it('registers a support team member and displays all tickets', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText('Your Name'), 'Jordan');
    await user.click(screen.getByRole('radio', { name: /Support Team/i }));
    await user.click(
      screen.getByRole('button', { name: /Continue to Dashboard/i })
    );

    expect(screen.getByText('Welcome, Jordan')).toBeInTheDocument();
    expect(screen.getByText('Laptop not charging')).toBeInTheDocument();
    expect(screen.getByText('Request a second monitor')).toBeInTheDocument();
  });

  it('navigates returning users directly to their dashboard without re-registering', () => {
    const seed = createSeedState();
    seed.users.push({ id: 'user-sam', name: 'Sam', role: 'Employee' });
    seed.activeUserId = 'user-sam';
    seed.profile = { id: 'user-sam', name: 'Sam', position: 'employee' };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));

    render(<App />);

    expect(screen.getByText('Welcome, Sam')).toBeInTheDocument();
    expect(
      screen.queryByText("Welcome! Let's get you started.")
    ).not.toBeInTheDocument();
  });

  it('preserves entered values and shows error when saving profile fails', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText('Your Name'), 'Taylor');
    await user.click(screen.getByRole('radio', { name: /Employee/i }));

    vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
      throw new Error('QuotaExceededError');
    });

    await user.click(
      screen.getByRole('button', { name: /Continue to Dashboard/i })
    );

    expect(
      screen.getByText(STORAGE_MESSAGES.PROFILE_SAVE_FAILED)
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Your Name')).toHaveValue('Taylor');
    expect(screen.getByRole('radio', { name: /Employee/i })).toBeChecked();
  });
});
