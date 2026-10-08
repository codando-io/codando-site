import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiWordmark } from './wordmark';

@Component({
  imports: [UiWordmark],
  template: '<a uiWordmark></a>',
})
class Host {}

describe('UiWordmark', () => {
  it('links to the top of the page, named "Codando" with the mark hidden from assistive tech', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const link = (fixture.nativeElement as HTMLElement).querySelector('a')!;

    expect(link.getAttribute('href')).toBe('#top');
    expect(link.textContent?.trim()).toBe('Codando');
    expect(link.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
  });
});
