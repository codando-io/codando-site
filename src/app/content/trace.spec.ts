import { TRACE_FIELDS, TRACE_RECORDS } from './trace';

describe('trace content', () => {
  it('pairs every marked field with exactly one record', () => {
    const fieldMarkers = TRACE_FIELDS.flatMap(({ marker }) => (marker ? [marker] : []));
    const recordMarkers = TRACE_RECORDS.map(({ marker }) => marker);

    expect([...fieldMarkers].sort()).toEqual([...recordMarkers].sort());
    expect(new Set(fieldMarkers).size).toBe(fieldMarkers.length);
  });
});
