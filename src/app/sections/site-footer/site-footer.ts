import { Component } from '@angular/core';
import { SECTION_LINKS } from '../../content/navigation';
import { UiWordmark } from '../../ui/wordmark/wordmark';

@Component({
  selector: 'footer[appSiteFooter]',
  imports: [UiWordmark],
  templateUrl: './site-footer.html',
  styleUrl: './site-footer.css',
})
export class SiteFooter {
  protected readonly sectionLinks = SECTION_LINKS;
}
