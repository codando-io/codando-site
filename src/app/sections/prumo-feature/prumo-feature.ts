import { Component } from '@angular/core';
import { PRUMO } from '../../content/products';
import { PRUMO_FEATURES } from '../../content/prumo';
import { UiCard } from '../../ui/card/card';
import { UiStatusChip } from '../../ui/status-chip/status-chip';
import { FeatureList } from '../feature-list/feature-list';
import { RelationshipDiagram } from './relationship-diagram/relationship-diagram';

@Component({
  selector: 'section[appPrumoFeature]',
  imports: [UiCard, UiStatusChip, FeatureList, RelationshipDiagram],
  templateUrl: './prumo-feature.html',
  styleUrl: './prumo-feature.css',
  host: { id: 'prumo', class: 'section section-well', 'aria-labelledby': 'prumo-title' },
})
export class PrumoFeature {
  protected readonly status = PRUMO.status;
  protected readonly features = PRUMO_FEATURES;
}
