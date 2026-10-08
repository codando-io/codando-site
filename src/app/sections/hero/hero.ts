import { Component } from '@angular/core';
import { UiButton } from '../../ui/button/button';
import { TraceFigure } from '../trace-figure/trace-figure';

@Component({
  selector: 'section[appHero]',
  imports: [UiButton, TraceFigure],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
  host: { 'aria-labelledby': 'hero-title' },
})
export class Hero {}
