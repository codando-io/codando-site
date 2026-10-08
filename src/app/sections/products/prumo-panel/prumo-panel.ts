import { Component } from '@angular/core';
import { UiStatusChip } from '../../../ui/status-chip/status-chip';

@Component({
  selector: 'article[appPrumoPanel]',
  imports: [UiStatusChip],
  templateUrl: './prumo-panel.html',
  styleUrl: './prumo-panel.css',
})
export class PrumoPanel {}
