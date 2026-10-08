/** The parts of a `DOMRect` the leaders need, in viewport coordinates. */
export type DOMRectLike = Pick<DOMRectReadOnly, 'left' | 'top' | 'height'>;

export interface Point {
  readonly x: number;
  readonly y: number;
}

/** A line from a highlighted source value to the record built from it, in figure coordinates. */
export interface Leader<M> {
  readonly marker: M;
  readonly d: string;
  readonly start: Point;
  readonly end: Point;
}

const middle = (rect: DOMRectLike) => rect.top + rect.height / 2;

/**
 * One leader per marker, in the markers' order, each ending at the record with the same number.
 * Each leader is a cubic Bézier that leaves and arrives horizontally. Returns no leaders when any
 * record is not to the right of the source edge: stacked, a connector stands in for them.
 */
export function computeLeaders<M>(
  figure: DOMRectLike,
  sourceEdgeX: number,
  markers: ReadonlyMap<M, DOMRectLike>,
  records: ReadonlyMap<M, DOMRectLike>,
): Leader<M>[] {
  // Half a pixel in from each outer edge puts the dots on the center of the 1px borders.
  const x1 = sourceEdgeX - figure.left - 0.5;
  const pairs = [...markers].map(([marker, source]) => {
    const target = records.get(marker);
    if (!target) throw new Error(`No record for marker ${String(marker)}`);
    return { marker, source, target };
  });
  if (!pairs.every(({ target }) => target.left - figure.left > x1)) return [];

  return pairs.map(({ marker, source, target }) => {
    const y1 = middle(source) - figure.top;
    const x2 = target.left - figure.left + 0.5;
    const y2 = middle(target) - figure.top;
    const bend = (x1 + x2) / 2;
    return {
      marker,
      d: `M${x1} ${y1}C${bend} ${y1} ${bend} ${y2} ${x2} ${y2}`,
      start: { x: x1, y: y1 },
      end: { x: x2, y: y2 },
    };
  });
}
