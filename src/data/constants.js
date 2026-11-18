export const STORAGE_KEY = 'support-ticket-demo-v1';

export const DEMO_NOTICE =
  'Demonstration only. Role selection is not real authentication.';

export const USERS = [
  { id: 'user-ravi', name: 'Ravi', role: 'Employee' },
  { id: 'user-priya', name: 'Priya', role: 'Employee' },
  { id: 'user-alex', name: 'Alex', role: 'Support Staff' },
];

export const POSITIONS = [
  {
    value: 'employee',
    label: 'Employee',
    role: 'Employee',
    description: 'Submit and track your support tickets.',
  },
  {
    value: 'support',
    label: 'Support Team',
    role: 'Support Staff',
    description: 'Manage employee tickets and resolve support requests.',
  },
];

export const CATEGORIES = ['Hardware', 'Software', 'Network', 'Access', 'Other'];

export const PRIORITIES = ['Low', 'Medium', 'High'];

export const STATUSES = ['Open', 'In Progress', 'Resolved', 'Closed'];

export const EDITABLE_STATUSES = ['Open', 'In Progress', 'Resolved'];

export const STORAGE_MESSAGES = {
  UNAVAILABLE: 'Browser storage is unavailable. Changes cannot be saved.',
  TICKET_SAVE_FAILED:
    'The ticket could not be saved. Your entries are still in the form.',
  COMMENT_SAVE_FAILED:
    'The comment could not be saved. Your text is still in the form.',
  STATUS_SAVE_FAILED:
    'The status could not be saved. The ticket still shows the previous status.',
  USER_SAVE_FAILED: (name) =>
    `The selected user could not be saved. This demonstration is still using ${name}.`,
  PROFILE_SAVE_FAILED:
    'Your profile could not be saved. Please check browser storage and try again.',
  RESET_FAILED:
    'Demonstration data could not be reset. The current tickets are unchanged.',
};

export const VALIDATION_MESSAGES = {
  NAME_REQUIRED: 'Name is required.',
  POSITION_REQUIRED: 'Select a position.',
  TITLE_REQUIRED: 'Title is required.',
  TITLE_TOO_LONG: 'Title must be 100 characters or fewer.',
  DESCRIPTION_REQUIRED: 'Description is required.',
  DESCRIPTION_TOO_LONG: 'Description must be 2000 characters or fewer.',
  CATEGORY_REQUIRED: 'Select a category.',
  PRIORITY_REQUIRED: 'Select a priority.',
  COMMENT_REQUIRED: 'Comment is required.',
  COMMENT_TOO_LONG: 'Comment must be 1000 characters or fewer.',
};
