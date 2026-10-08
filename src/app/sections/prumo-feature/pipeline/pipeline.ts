import { Component } from '@angular/core';
import { PIPELINE } from '../../../content/pipeline';

@Component({
  selector: 'ol[appPipeline]',
  templateUrl: './pipeline.html',
  styleUrl: './pipeline.css',
})
export class Pipeline {
  protected readonly stages = PIPELINE;
}
