import { Component } from '@angular/core';
import { About } from './sections/about/about';
import { Contact } from './sections/contact/contact';
import { Hero } from './sections/hero/hero';
import { HowWeBuild } from './sections/how-we-build/how-we-build';
import { Products } from './sections/products/products';
import { PrumoFeature } from './sections/prumo-feature/prumo-feature';
import { SiteFooter } from './sections/site-footer/site-footer';
import { SiteHeader } from './sections/site-header/site-header';

@Component({
  selector: 'app-root',
  imports: [SiteHeader, Hero, PrumoFeature, Products, HowWeBuild, About, Contact, SiteFooter],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
