import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App.jsx';

describe('TicketDetailPage', () => {
  it('hides status select from employees and renders markup comments as literal plain text', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText('Your Name'), 'Ravi');
    await user.click(screen.getByRole('radio', { name: /Employee/i }));
    await user.click(
      screen.getByRole('button', { name: /Continue to Dashboard/i })
    );

    await user.click(screen.getByRole('link', { name: /Laptop not charging/i }));

    expect(screen.queryByLabelText('Update status')).not.toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Edit ticket/i })
    ).toBeInTheDocument();
    expect(screen.getByText('There are no comments yet.')).toBeInTheDocument();

    const xssText = '<script>alert(1)</script><img src=x onerror=alert(1)>';
    await user.type(screen.getByLabelText('Add a comment'), xssText);
    await user.click(screen.getByRole('button', { name: /Post comment/i }));

    expect(screen.getByText(xssText)).toBeInTheDocument();
    expect(document.querySelector('script')).toBeNull();
  });

  it('allows support staff to update ticket status including Closed tickets', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText('Your Name'), 'Alex');
    await user.click(screen.getByRole('radio', { name: /Support Team/i }));
    await user.click(
      screen.getByRole('button', { name: /Continue to Dashboard/i })
    );

    await user.click(
      screen.getByRole('link', { name: /Request a second monitor/i })
    );

    expect(
      screen.queryByRole('link', { name: /Edit ticket/i })
    ).not.toBeInTheDocument();

    const select = screen.getByLabelText('Update status');
    expect(select).toHaveValue('Closed');

    await user.selectOptions(select, 'In Progress');
    expect(select).toHaveValue('In Progress');
  });
});
