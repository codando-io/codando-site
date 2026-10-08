import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TraceFigure } from './trace-figure';

@Component({
  imports: [TraceFigure],
  template: '<figure appTraceFigure></figure>',
})
class Host {}

describe('TraceFigure', () => {
  let classesWhenAnimationsRead: string[] = [];
  let endMotion: () => void;

  beforeEach(() => {
    // jsdom has no layout or animations; these stand in for the browser APIs the figure uses.
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        disconnect() {}
      },
    );
    Object.defineProperty(document, 'fonts', {
      configurable: true,
      value: { ready: Promise.resolve() },
    });
    const finished = new Promise<void>((resolve) => (endMotion = resolve));
    Element.prototype.getAnimations = function (this: Element) {
      classesWhenAnimationsRead = [...this.classList];
      return [{ finished }] as unknown as Animation[];
    };
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete (document as { fonts?: unknown }).fonts;
    delete (Element.prototype as { getAnimations?: unknown }).getAnimations;
    document.documentElement.removeAttribute('data-painted');
  });

  async function render(): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    return fixture.nativeElement.querySelector('figure');
  }

  const classesOf = (element: Element) => [...element.classList].sort();

  it('plays the full sequence when nothing is on screen yet, and settles once it ends', async () => {
    const figure = await render();

    expect(classesOf(figure)).toEqual(['is-drawn', 'is-full', 'trace']);
    expect(classesWhenAnimationsRead).toEqual(expect.arrayContaining(['is-drawn', 'is-full']));
    expect(figure.querySelectorAll('.trace-leaders path')).toHaveLength(3);

    endMotion();
    await vi.waitFor(() => expect(classesOf(figure)).toEqual(['is-drawn', 'is-settled', 'trace']));
  });

  it('animates only the leaders when the page was already painted, and settles once they end', async () => {
    document.documentElement.setAttribute('data-painted', '');

    const figure = await render();

    expect(classesOf(figure)).toEqual(['is-drawn', 'trace']);
    expect(classesWhenAnimationsRead).toContain('is-drawn');
    expect(figure.querySelectorAll('.trace-leaders path')).toHaveLength(3);

    endMotion();
    await vi.waitFor(() => expect(classesOf(figure)).toEqual(['is-drawn', 'is-settled', 'trace']));
  });
});
