import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiCard } from './card';

@Component({
  imports: [UiCard],
  template: `
    <ul>
      <li uiCard><h3>Follow the money</h3></li>
      <li uiCard variant="dashed" class="next"><h3>Next</h3></li>
    </ul>
  `,
})
class Host {}

describe('UiCard', () => {
  async function render(): Promise<HTMLElement[]> {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    return [...(fixture.nativeElement as HTMLElement).querySelectorAll('li')];
  }

  it('defaults to the solid card and keeps its element and content', async () => {
    const [card] = await render();
    expect([...card.classList].sort()).toEqual(['ui-card', 'ui-card--solid']);
    expect(card.querySelector('h3')?.textContent).toBe('Follow the money');
  });

  it('maps the dashed variant to its class and keeps the classes set by the caller', async () => {
    const [, card] = await render();
    expect([...card.classList].sort()).toEqual(['next', 'ui-card', 'ui-card--dashed']);
  });
});
