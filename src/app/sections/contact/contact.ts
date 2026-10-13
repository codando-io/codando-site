import { Component } from '@angular/core';
import { UiButton } from '../../ui/button/button';

@Component({
  selector: 'section[appContact]',
  imports: [UiButton],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
  host: { id: 'contact', class: 'surface-ink', 'aria-labelledby': 'contact-title' },
})
export class Contact {}
