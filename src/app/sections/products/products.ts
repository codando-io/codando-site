import { Component } from '@angular/core';
import { LIVE_PRODUCTS } from '../../content/products';
import { UiCard } from '../../ui/card/card';
import { ProductEntry } from './product-entry/product-entry';

@Component({
  selector: 'section[appProducts]',
  imports: [UiCard, ProductEntry],
  templateUrl: './products.html',
  styleUrl: './products.css',
  host: { id: 'products', class: 'section', 'aria-labelledby': 'products-title' },
})
export class Products {
  protected readonly products = LIVE_PRODUCTS;
}
