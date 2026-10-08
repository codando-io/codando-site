import { Component, computed, input } from '@angular/core';

export type ProductStatus = 'live' | 'in-development';

const LABELS: Record<ProductStatus, string> = {
  live: 'Live',
  'in-development': 'In development',
};

@Component({
  selector: 'ui-status-chip',
  template: '{{ label() }}',
  host: { '[class]': '"ui-status-chip--" + status()' },
  styleUrl: './status-chip.css',
})
export class UiStatusChip {
  readonly status = input.required<ProductStatus>();

  protected readonly label = computed(() => LABELS[this.status()]);
}
