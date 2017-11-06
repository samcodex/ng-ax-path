import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { NgCoordinateModule } from 'ng-ax-path';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgCoordinateModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
