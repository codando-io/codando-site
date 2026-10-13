import { Component } from '@angular/core';
import { UiButton } from '../../ui/button/button';
import { StatusBoard } from './status-board/status-board';

@Component({
  selector: 'section[appHero]',
  imports: [UiButton, StatusBoard],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
  host: { 'aria-labelledby': 'hero-title' },
})
export class Hero {}
