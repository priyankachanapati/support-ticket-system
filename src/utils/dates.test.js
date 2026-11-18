import { formatUtcDate, formatUtcDateTime } from './dates.js';

describe('dates utilities', () => {
  it('formats UTC dates as D MMM YYYY without leading zero', () => {
    expect(formatUtcDate('2026-11-18T09:15:00.000Z')).toBe('18 Nov 2026');
    expect(formatUtcDate('2026-11-02T10:05:00.000Z')).toBe('2 Nov 2026');
    expect(formatUtcDate('2026-11-10T23:59:59.000Z')).toBe('10 Nov 2026');
  });

  it('formats UTC timestamps as D MMM YYYY, HH:mm', () => {
    expect(formatUtcDateTime('2026-11-17T16:30:00.000Z')).toBe(
      '17 Nov 2026, 16:30'
    );
    expect(formatUtcDateTime('2026-11-04T09:00:00.000Z')).toBe(
      '4 Nov 2026, 09:00'
    );
    expect(formatUtcDateTime('2026-11-06T09:45:00.000Z')).toBe(
      '6 Nov 2026, 09:45'
    );
  });
});
