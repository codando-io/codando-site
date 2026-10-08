import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  afterNextRender,
  inject,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { MarkerNumber, TRACE_FIELDS, TRACE_RECORDS } from '../../content/trace';
import { Leader, computeLeaders } from './leaders';

/** Markers top to bottom: the order the leaders are drawn and their motion is staggered in. */
const MARKERS: readonly MarkerNumber[] = TRACE_FIELDS.flatMap(({ marker }) =>
  marker ? [marker] : [],
);

/**
 * `pending`: the prerendered figure, no leaders yet. `playing`: leaders drawn, motion running.
 * `settled`: no motion from here on, so leaders redrawn after a resize appear without replaying it.
 */
type Motion = 'pending' | 'playing' | 'settled';

/** The figure reads fully without the leaders; they are drawn in the browser once layout is known. */
@Component({
  selector: 'figure[appTraceFigure]',
  templateUrl: './trace-figure.html',
  styleUrl: './trace-figure.css',
  host: {
    class: 'trace',
    'aria-labelledby': 'trace-caption',
    '[class.is-drawn]': 'motion() !== "pending"',
    '[class.is-settled]': 'motion() === "settled"',
  },
})
export class TraceFigure {
  protected readonly fields = TRACE_FIELDS;
  protected readonly records = TRACE_RECORDS;
  protected readonly leaders = signal<readonly Leader<MarkerNumber>[]>([]);
  protected readonly motion = signal<Motion>('pending');

  private readonly host: HTMLElement = inject(ElementRef).nativeElement;
  private readonly page = viewChild.required<ElementRef<HTMLElement>>('page');
  private readonly markerElements = viewChildren('markerElement', { read: ElementRef });
  private readonly recordElements = viewChildren('recordElement', { read: ElementRef });

  constructor() {
    const injector = inject(Injector);
    const changeDetector = inject(ChangeDetectorRef);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      this.draw();
      // Anything already on screen must not vanish to animate back in. Paint timing entries arrive
      // after the frame is shown, too late to tell; src/index.html marks the first frame instead.
      const painted = document.documentElement.hasAttribute('data-painted');
      this.motion.set(painted ? 'settled' : 'playing');
      // Runs once the motion classes are in the DOM, in the same frame.
      afterNextRender(() => this.settleWhenMotionEnds(), { injector });

      const observer = new ResizeObserver(() => {
        this.draw();
        // Resize callbacks run before paint; checking now keeps the leaders on their ends.
        changeDetector.detectChanges();
      });
      observer.observe(this.host);
      destroyRef.onDestroy(() => observer.disconnect());
      document.fonts.ready.then(() => this.draw());
    });
  }

  protected sequence(marker: MarkerNumber): number {
    return MARKERS.indexOf(marker);
  }

  private draw(): void {
    const rect = (element: ElementRef<HTMLElement>) =>
      element.nativeElement.getBoundingClientRect();
    const markers = new Map(this.markerElements().map((element, i) => [MARKERS[i], rect(element)]));
    const records = new Map(
      this.recordElements().map((element, i) => [this.records[i].marker, rect(element)]),
    );
    this.leaders.set(
      computeLeaders(this.host.getBoundingClientRect(), rect(this.page()).right, markers, records),
    );
  }

  private settleWhenMotionEnds(): void {
    const animations = this.host.getAnimations({ subtree: true }).map(({ finished }) => finished);
    Promise.allSettled(animations).then(() => this.motion.set('settled'));
  }
}
