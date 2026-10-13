import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  async function render(): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    return fixture.nativeElement;
  }

  it('has one main heading', async () => {
    const page = await render();

    expect([...page.querySelectorAll('h1')].map((h1) => h1.textContent?.trim())).toEqual([
      'Building intelligent software for a more transparent and connected world.',
    ]);
  });

  it('links in-page only to the main content, the sections, and the top of the page', async () => {
    const page = await render();
    const targets = [...page.querySelectorAll('a[href^="#"]')].map((link) =>
      link.getAttribute('href')!.slice(1),
    );

    expect([...new Set(targets)].sort()).toEqual([
      'about',
      'main',
      'products',
      'prumo',
      'technology',
      'top',
    ]);
    // `top` is the body's id, outside the app (src/index.html).
    for (const id of ['main', 'products', 'prumo', 'technology', 'about']) {
      expect(page.querySelector(`#${id}`), id).not.toBeNull();
    }
  });
});
