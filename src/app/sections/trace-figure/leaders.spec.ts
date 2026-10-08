import { computeLeaders } from './leaders';

describe('computeLeaders', () => {
  // Measured on the reference page at 1440px: the figure, the source page's right edge, and the
  // "250000000001" marker with the Candidate record it leads to.
  const figure = { left: 160, top: 686, height: 481 };
  const pageRight = 664;
  const marker3 = { left: 600, top: 836, height: 12.03125 };
  const record3 = { left: 776, top: 706, height: 98.78125 };

  it('draws a horizontal-tangent curve from the page edge to the record, in figure coordinates', () => {
    const leaders = computeLeaders(
      figure,
      pageRight,
      new Map([[3, marker3]]),
      new Map([[3, record3]]),
    );

    expect(leaders).toEqual([
      {
        marker: 3,
        d: 'M503.5 156.015625C560 156.015625 560 69.390625 616.5 69.390625',
        start: { x: 503.5, y: 156.015625 },
        end: { x: 616.5, y: 69.390625 },
      },
    ]);
  });

  it('pairs markers and records by number and keeps the markers order', () => {
    const markers = new Map([
      [3, { left: 600, top: 700, height: 10 }],
      [1, { left: 600, top: 800, height: 10 }],
    ]);
    const records = new Map([
      [1, { left: 776, top: 900, height: 20 }],
      [3, { left: 776, top: 1000, height: 20 }],
    ]);

    const leaders = computeLeaders(figure, pageRight, markers, records);

    expect(leaders.map(({ marker, start, end }) => ({ marker, start, end }))).toEqual([
      { marker: 3, start: { x: 503.5, y: 19 }, end: { x: 616.5, y: 324 } },
      { marker: 1, start: { x: 503.5, y: 119 }, end: { x: 616.5, y: 224 } },
    ]);
  });

  it('draws nothing while a record is not to the right of the page (stacked layout)', () => {
    const below = { left: 180, top: 1200, height: 98 };
    const markers = new Map([
      [3, marker3],
      [1, marker3],
    ]);
    const records = new Map([
      [3, record3],
      [1, below],
    ]);

    expect(computeLeaders(figure, pageRight, markers, records)).toEqual([]);
    expect(
      computeLeaders(figure, pageRight, new Map([[3, marker3]]), new Map([[3, record3]])),
    ).toHaveLength(1);
  });
});
