import {
  CATEGORIES,
  POSITIONS,
  PRIORITIES,
  VALIDATION_MESSAGES,
} from '../data/constants.js';

export function validateProfileFields({ name, position }) {
  const trimmedName = typeof name === 'string' ? name.trim() : '';
  const errors = {};

  if (!trimmedName) {
    errors.name = VALIDATION_MESSAGES.NAME_REQUIRED;
  }

  if (!POSITIONS.some((p) => p.value === position)) {
    errors.position = VALIDATION_MESSAGES.POSITION_REQUIRED;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    values: {
      name: trimmedName,
      position,
    },
  };
}

export function validateTicketFields({
  title,
  description,
  category,
  priority,
}) {
  const trimmedTitle = typeof title === 'string' ? title.trim() : '';
  const trimmedDescription =
    typeof description === 'string' ? description.trim() : '';
  const errors = {};

  if (!trimmedTitle) {
    errors.title = VALIDATION_MESSAGES.TITLE_REQUIRED;
  } else if (trimmedTitle.length > 100) {
    errors.title = VALIDATION_MESSAGES.TITLE_TOO_LONG;
  }

  if (!trimmedDescription) {
    errors.description = VALIDATION_MESSAGES.DESCRIPTION_REQUIRED;
  } else if (trimmedDescription.length > 2000) {
    errors.description = VALIDATION_MESSAGES.DESCRIPTION_TOO_LONG;
  }

  if (!CATEGORIES.includes(category)) {
    errors.category = VALIDATION_MESSAGES.CATEGORY_REQUIRED;
  }

  if (!PRIORITIES.includes(priority)) {
    errors.priority = VALIDATION_MESSAGES.PRIORITY_REQUIRED;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    values: {
      title: trimmedTitle,
      description: trimmedDescription,
      category,
      priority,
    },
  };
}

export function validateCommentBody(body) {
  const trimmed = typeof body === 'string' ? body.trim() : '';
  let error = null;

  if (!trimmed) {
    error = VALIDATION_MESSAGES.COMMENT_REQUIRED;
  } else if (trimmed.length > 1000) {
    error = VALIDATION_MESSAGES.COMMENT_TOO_LONG;
  }

  return {
    valid: error === null,
    error,
    value: trimmed,
  };
}
