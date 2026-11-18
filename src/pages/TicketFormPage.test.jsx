import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App.jsx';
import { STORAGE_MESSAGES, VALIDATION_MESSAGES } from '../data/constants.js';

describe('TicketFormPage', () => {
  it('validates required fields, keeps entered text, and navigates only after successful save', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText('Your Name'), 'Priya');
    await user.click(screen.getByRole('radio', { name: /Employee/i }));
    await user.click(
      screen.getByRole('button', { name: /Continue to Dashboard/i })
    );

    await user.click(
      screen.getAllByRole('link', { name: /Submit a ticket/i })[0]
    );

    await user.click(screen.getByRole('button', { name: /Submit ticket/i }));
    expect(
      screen.getByText(VALIDATION_MESSAGES.TITLE_REQUIRED)
    ).toBeInTheDocument();
    expect(
      screen.getByText(VALIDATION_MESSAGES.DESCRIPTION_REQUIRED)
    ).toBeInTheDocument();
    expect(
      screen.getByText(VALIDATION_MESSAGES.CATEGORY_REQUIRED)
    ).toBeInTheDocument();
    expect(
      screen.getByText(VALIDATION_MESSAGES.PRIORITY_REQUIRED)
    ).toBeInTheDocument();

    await user.type(screen.getByLabelText('Title'), 'Keyboard key stuck');
    await user.type(
      screen.getByLabelText('Description'),
      'Spacebar sticks on press.'
    );
    await user.selectOptions(screen.getByLabelText('Category'), 'Hardware');
    await user.selectOptions(screen.getByLabelText('Priority'), 'Medium');

    const setItemSpy = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementationOnce(() => {
        throw new Error('QuotaExceededError');
      });

    await user.click(screen.getByRole('button', { name: /Submit ticket/i }));
    expect(
      screen.getByText(STORAGE_MESSAGES.TICKET_SAVE_FAILED)
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toHaveValue('Keyboard key stuck');
    expect(screen.getByLabelText('Description')).toHaveValue(
      'Spacebar sticks on press.'
    );

    setItemSpy.mockRestore();
    await user.click(screen.getByRole('button', { name: /Submit ticket/i }));
    expect(
      screen.getByRole('heading', { name: 'Keyboard key stuck' })
    ).toBeInTheDocument();
    expect(screen.getByText('tkt-1006')).toBeInTheDocument();
  });
});
