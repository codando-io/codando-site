import { Component } from '@angular/core';
import { UiButton } from '../../ui/button/button';

@Component({
  selector: 'section[appHero]',
  imports: [UiButton],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
  host: { 'aria-labelledby': 'hero-title' },
})
export class Hero {}
