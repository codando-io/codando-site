import { Component } from '@angular/core';
import { PRODUCTS } from '../../../content/products';
import { ProductStatus, STATUS_LABELS, UiStatusChip } from '../../../ui/status-chip/status-chip';

const STATUS_ORDER: readonly ProductStatus[] = ['live', 'in-development'];

/** The hero's product-UI card: every product with its status, each linking to its section. */
@Component({
  selector: 'div[appStatusBoard]',
  imports: [UiStatusChip],
  templateUrl: './status-board.html',
  styleUrl: './status-board.css',
})
export class StatusBoard {
  protected readonly products = PRODUCTS;

  protected readonly summary = STATUS_ORDER.map(
    (status) =>
      `${PRODUCTS.filter((product) => product.status === status).length} ${STATUS_LABELS[status].toLowerCase()}`,
  ).join(', ');
}
