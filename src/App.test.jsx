import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App.jsx';
import { DEMO_NOTICE } from './data/constants.js';

describe('App', () => {
  it('opens on welcome screen, registers user, and supports Change Profile', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText('Employee Support Portal')).toBeInTheDocument();
    expect(
      screen.getByText("Welcome! Let's get you started.")
    ).toBeInTheDocument();
    expect(screen.getByText(DEMO_NOTICE)).toBeInTheDocument();

    await user.type(screen.getByLabelText('Your Name'), 'Ravi');
    await user.click(screen.getByRole('radio', { name: /Employee/i }));
    await user.click(
      screen.getByRole('button', { name: /Continue to Dashboard/i })
    );

    expect(screen.getByText('Welcome, Ravi')).toBeInTheDocument();
    expect(screen.getByText('Laptop not charging')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Change Profile/i }));
    expect(
      screen.getByText("Welcome! Let's get you started.")
    ).toBeInTheDocument();

    await user.type(screen.getByLabelText('Your Name'), 'Alex');
    await user.click(screen.getByRole('radio', { name: /Support Team/i }));
    await user.click(
      screen.getByRole('button', { name: /Continue to Dashboard/i })
    );

    expect(screen.getByText('Welcome, Alex')).toBeInTheDocument();
    expect(screen.getByText('Laptop not charging')).toBeInTheDocument();
  });
});
