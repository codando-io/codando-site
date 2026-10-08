import { Component, computed, input } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary';
export type ButtonSize = 'sm' | 'md';

/**
 * A link styled as a button: the page's calls to action are all in-page links.
 *
 * `<a uiButton variant="secondary" href="#about">About Codando</a>`
 */
@Component({
  selector: 'a[uiButton]',
  template: '<ng-content />',
  host: { '[class]': 'classes()' },
  styleUrl: './button.css',
})
export class UiButton {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');

  protected readonly classes = computed(
    () => `ui-button ui-button--${this.variant()} ui-button--${this.size()}`,
  );
}
