import { Component, computed, input } from '@angular/core';

export type CardVariant = 'solid' | 'dashed';

/**
 * A rounded surface for a block of content. Dashed marks something not built yet.
 *
 * `<li uiCard><h3>Follow the money</h3><p>…</p></li>`
 */
@Component({
  selector: '[uiCard]',
  template: '<ng-content />',
  host: { '[class]': 'classes()' },
  styleUrl: './card.css',
})
export class UiCard {
  readonly variant = input<CardVariant>('solid');

  protected readonly classes = computed(() => `ui-card ui-card--${this.variant()}`);
}
