import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgCoordinateComponent } from './ng-coordinate.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    NgCoordinateComponent
  ],
  exports: [
    NgCoordinateComponent
  ]
})
export class NgCoordinateModule {}
