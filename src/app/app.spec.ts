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
      'We design and build software products, end to end.',
    ]);
  });

  it('links in-page only to ids that exist: the main content, the sections, and the top', async () => {
    const page = await render();
    const targets = [...page.querySelectorAll('a[href^="#"]')].map((link) =>
      link.getAttribute('href')!.slice(1),
    );

    expect([...new Set(targets)].sort()).toEqual([
      'about',
      'contact',
      'how-we-build',
      'main',
      'products',
      'prumo',
      'top',
    ]);
    // `top` is the body's id, outside the app (src/index.html).
    for (const id of ['main', 'prumo', 'products', 'how-we-build', 'about', 'contact']) {
      expect(page.querySelector(`#${id}`), id).not.toBeNull();
    }
  });

  it('names the founder only by handle and never claims "AI-powered"', async () => {
    const text = (await render()).textContent!;

    expect(text).toContain('johnp');
    expect(text).toContain('Founder & Software Engineer');
    expect(text).not.toContain('AI-powered');
  });

  it('never shows the owner’s legal name', async () => {
    const page = await render();
    // Word by word within each text node: adjacent elements have no whitespace between them.
    const walker = document.createTreeWalker(page, NodeFilter.SHOW_TEXT);
    const words: string[] = [];
    while (walker.nextNode()) {
      words.push(...(walker.currentNode.textContent!.toLowerCase().match(/\p{L}+/gu) ?? []));
    }
    const digests = await Promise.all(
      [...new Set(words)].map(async (word) => {
        const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(word));
        return [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
      }),
    );

    expect(words).toContain('johnp');
    // SHA-256 of the two names the page must not show, so the names stay out of the repository.
    expect(digests).not.toContain(
      '7cadab457ad8d811f134612436daaa5e5914b20dc2502865f714035b0f267680',
    );
    expect(digests).not.toContain(
      'ccf54874c87e3cfc372151f91c7c679d14a199fd96f064824e56be06355a6256',
    );
  });

  it('shows the company CNPJ in the footer', async () => {
    const footer = (await render()).querySelector('footer')!;

    expect(footer.textContent!.replace(/\s+/g, ' ')).toContain('CNPJ 65.805.437/0001-48');
  });
});
