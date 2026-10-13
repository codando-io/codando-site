import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiButton } from './button';

@Component({
  imports: [UiButton],
  template: `
    <a uiButton href="#prumo">See what we’re building</a>
    <a uiButton variant="secondary" size="sm" class="header-cta" href="#contact">Get in touch</a>
  `,
})
class Host {}

describe('UiButton', () => {
  const classesOf = (element: Element) => [...element.classList].sort();

  async function render(): Promise<HTMLAnchorElement[]> {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    return [...(fixture.nativeElement as HTMLElement).querySelectorAll('a')];
  }

  it('defaults to the primary, medium button and stays a link with its href', async () => {
    const [link] = await render();
    expect(classesOf(link)).toEqual(['ui-button', 'ui-button--md', 'ui-button--primary']);
    expect(link.getAttribute('href')).toBe('#prumo');
    expect(link.textContent?.trim()).toBe('See what we’re building');
  });

  it('maps variant and size to classes and keeps the classes set by the caller', async () => {
    const [, link] = await render();
    expect(classesOf(link)).toEqual([
      'header-cta',
      'ui-button',
      'ui-button--secondary',
      'ui-button--sm',
    ]);
    expect(link.getAttribute('href')).toBe('#contact');
  });
});
