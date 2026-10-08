import { Component } from '@angular/core';
import { STACK, TECH_CONCEPTS } from '../../content/technology';

@Component({
  selector: 'section[appTechnology]',
  templateUrl: './technology.html',
  styleUrl: './technology.css',
  host: { id: 'technology', class: 'section', 'aria-labelledby': 'technology-title' },
})
export class Technology {
  protected readonly concepts = TECH_CONCEPTS;
  protected readonly stack = STACK;
}
