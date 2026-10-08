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

  it('plays the motion when nothing is on screen yet, and settles once it ends', async () => {
    const figure = await render();

    expect([...figure.classList]).toEqual(['trace', 'is-drawn']);
    expect(classesWhenAnimationsRead).toContain('is-drawn');
    expect(figure.querySelectorAll('.trace-leaders path')).toHaveLength(3);

    endMotion();
    await vi.waitFor(() => expect(figure.classList).toContain('is-settled'));
  });

  it('draws the leaders without motion when the page was already painted', async () => {
    document.documentElement.setAttribute('data-painted', '');

    const figure = await render();

    expect([...figure.classList]).toEqual(['trace', 'is-drawn', 'is-settled']);
    expect(figure.querySelectorAll('.trace-leaders path')).toHaveLength(3);
  });
});
