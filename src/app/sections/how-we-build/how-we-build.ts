import { Component } from '@angular/core';
import { CAPABILITIES, STACK } from '../../content/how-we-build';
import { FeatureList } from '../feature-list/feature-list';

@Component({
  selector: 'section[appHowWeBuild]',
  imports: [FeatureList],
  templateUrl: './how-we-build.html',
  styleUrl: './how-we-build.css',
  host: {
    id: 'how-we-build',
    class: 'section section-well',
    'aria-labelledby': 'how-we-build-title',
  },
})
export class HowWeBuild {
  protected readonly capabilities = CAPABILITIES;
  protected readonly stack = STACK;
}
