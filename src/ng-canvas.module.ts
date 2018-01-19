import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgCanvasComponent } from './ng-canvas.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    NgCanvasComponent
  ],
  exports: [
    NgCanvasComponent
  ]
})
export class NgCanvasModule {}
