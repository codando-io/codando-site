import { Component } from '@angular/core';
import { About } from './sections/about/about';
import { Hero } from './sections/hero/hero';
import { Products } from './sections/products/products';
import { PrumoFeature } from './sections/prumo-feature/prumo-feature';
import { SiteFooter } from './sections/site-footer/site-footer';
import { SiteHeader } from './sections/site-header/site-header';
import { Technology } from './sections/technology/technology';

@Component({
  selector: 'app-root',
  imports: [SiteHeader, Hero, Products, PrumoFeature, Technology, About, SiteFooter],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
