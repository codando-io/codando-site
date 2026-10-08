import { Component } from '@angular/core';
import { SECTION_LINKS } from '../../content/navigation';
import { UiButton } from '../../ui/button/button';
import { UiWordmark } from '../../ui/wordmark/wordmark';

@Component({
  selector: 'header[appSiteHeader]',
  imports: [UiButton, UiWordmark],
  templateUrl: './site-header.html',
  styleUrl: './site-header.css',
})
export class SiteHeader {
  protected readonly sectionLinks = SECTION_LINKS;
}
