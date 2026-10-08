import { Component } from '@angular/core';

@Component({
  selector: 'section[appAbout]',
  templateUrl: './about.html',
  styleUrl: './about.css',
  host: { id: 'about', class: 'section', 'aria-labelledby': 'about-title' },
})
export class About {}
