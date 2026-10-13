import { Component, input } from '@angular/core';
import { UiCard } from '../../ui/card/card';

/** A card's heading and the one sentence under it. */
export interface Feature {
  readonly title: string;
  readonly description: string;
}

/** A grid of cards, one per feature. The section that uses it sets the columns. */
@Component({
  selector: 'ul[appFeatureList]',
  imports: [UiCard],
  templateUrl: './feature-list.html',
  styleUrl: './feature-list.css',
})
export class FeatureList {
  readonly features = input.required<readonly Feature[]>();
}
