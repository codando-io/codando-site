import { Component } from '@angular/core';
import { PRODUCTS } from '../../content/products';
import { ProductEntry } from './product-entry/product-entry';
import { PrumoPanel } from './prumo-panel/prumo-panel';

@Component({
  selector: 'section[appProducts]',
  imports: [PrumoPanel, ProductEntry],
  templateUrl: './products.html',
  styleUrl: './products.css',
  host: { id: 'products', class: 'section', 'aria-labelledby': 'products-title' },
})
export class Products {
  protected readonly products = PRODUCTS;
}
