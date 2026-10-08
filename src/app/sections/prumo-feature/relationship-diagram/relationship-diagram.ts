import { Component } from '@angular/core';

@Component({
  selector: 'figure[appRelationshipDiagram]',
  templateUrl: './relationship-diagram.html',
  styleUrl: './relationship-diagram.css',
  host: { 'aria-labelledby': 'graph-caption' },
})
export class RelationshipDiagram {}
