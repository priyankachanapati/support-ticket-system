import { VALIDATION_MESSAGES } from '../data/constants.js';
import {
  validateCommentBody,
  validateProfileFields,
  validateTicketFields,
} from './validate.js';

describe('validation utilities', () => {
  it('validates and trims demonstration profile name and position', () => {
    const emptyResult = validateProfileFields({
      name: '   ',
      position: '',
    });
    expect(emptyResult.valid).toBe(false);
    expect(emptyResult.errors).toEqual({
      name: VALIDATION_MESSAGES.NAME_REQUIRED,
      position: VALIDATION_MESSAGES.POSITION_REQUIRED,
    });

    const validResult = validateProfileFields({
      name: '  Maya Chen  ',
      position: 'employee',
    });
    expect(validResult.valid).toBe(true);
    expect(validResult.values).toEqual({
      name: 'Maya Chen',
      position: 'employee',
    });
  });

  it('rejects empty or whitespace-only ticket fields with spec messages', () => {
    const result = validateTicketFields({
      title: '   ',
      description: '\n\t ',
      category: '',
      priority: 'Invalid',
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toEqual({
      title: VALIDATION_MESSAGES.TITLE_REQUIRED,
      description: VALIDATION_MESSAGES.DESCRIPTION_REQUIRED,
      category: VALIDATION_MESSAGES.CATEGORY_REQUIRED,
      priority: VALIDATION_MESSAGES.PRIORITY_REQUIRED,
    });
  });

  it('rejects overlong title and description after trim', () => {
    const result = validateTicketFields({
      title: 'a'.repeat(101),
      description: 'b'.repeat(2001),
      category: 'Hardware',
      priority: 'High',
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toEqual({
      title: VALIDATION_MESSAGES.TITLE_TOO_LONG,
      description: VALIDATION_MESSAGES.DESCRIPTION_TOO_LONG,
    });
  });

  it('trims valid ticket fields', () => {
    const result = validateTicketFields({
      title: '  Printer offline  ',
      description: '  Cannot print from floor 3.  ',
      category: 'Hardware',
      priority: 'Medium',
    });

    expect(result.valid).toBe(true);
    expect(result.values).toEqual({
      title: 'Printer offline',
      description: 'Cannot print from floor 3.',
      category: 'Hardware',
      priority: 'Medium',
    });
  });

  it('validates comment length and trims whitespace', () => {
    expect(validateCommentBody('   ')).toEqual({
      valid: false,
      error: VALIDATION_MESSAGES.COMMENT_REQUIRED,
      value: '',
    });

    expect(validateCommentBody('x'.repeat(1001))).toEqual({
      valid: false,
      error: VALIDATION_MESSAGES.COMMENT_TOO_LONG,
      value: 'x'.repeat(1001),
    });

    expect(validateCommentBody('  Checked cables.  ')).toEqual({
      valid: true,
      error: null,
      value: 'Checked cables.',
    });
  });
});
