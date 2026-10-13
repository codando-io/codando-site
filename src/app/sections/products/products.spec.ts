import { TestBed } from '@angular/core/testing';
import { Products } from './products';

describe('Products', () => {
  async function render(): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(Products);
    await fixture.whenStable();
    return fixture.nativeElement;
  }

  const hrefs = (section: Element) =>
    [...section.querySelectorAll('a')].map((link) => link.getAttribute('href'));

  it('links each live product to its app and its source code', async () => {
    const section = await render();
    const [agora, cenaculum] = section.querySelectorAll('article[appProductEntry]');

    expect(hrefs(agora)).toEqual([
      'https://agora.capivaras.dev',
      'https://src.capivaras.dev/capivaras/agora',
    ]);
    expect(agora.textContent).toContain('Open Agora agora.capivaras.dev');
    expect(agora.textContent).toContain('Source code for Agora');
    expect(hrefs(cenaculum)).toEqual([
      'https://cenaculum.capivaras.dev',
      'https://src.capivaras.dev/capivaras/cenaculum',
    ]);
    expect(cenaculum.textContent).toContain('Open Cenaculum cenaculum.capivaras.dev');
    expect(cenaculum.textContent).toContain('Open source under the MIT License.');
  });

  it('opens every link in the same tab', async () => {
    const section = await render();

    expect(section.querySelectorAll('a')).toHaveLength(4);
    expect(section.querySelectorAll('a[target]')).toHaveLength(0);
  });
});
