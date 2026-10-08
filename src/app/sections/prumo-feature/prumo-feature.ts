import { Component } from '@angular/core';
import { UiStatusChip } from '../../ui/status-chip/status-chip';
import { Pipeline } from './pipeline/pipeline';
import { RelationshipDiagram } from './relationship-diagram/relationship-diagram';

@Component({
  selector: 'section[appPrumoFeature]',
  imports: [UiStatusChip, Pipeline, RelationshipDiagram],
  templateUrl: './prumo-feature.html',
  styleUrl: './prumo-feature.css',
  host: { id: 'prumo', class: 'section surface-ink', 'aria-labelledby': 'prumo-title' },
})
export class PrumoFeature {}
