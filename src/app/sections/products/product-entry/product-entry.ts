import { Component, computed, input } from '@angular/core';
import { Product } from '../../../content/products';
import { UiStatusChip } from '../../../ui/status-chip/status-chip';

@Component({
  selector: 'article[appProductEntry]',
  imports: [UiStatusChip],
  templateUrl: './product-entry.html',
  styleUrl: './product-entry.css',
})
export class ProductEntry {
  readonly product = input.required<Product>();

  protected readonly appHost = computed(() => new URL(this.product().appUrl).host);
}
