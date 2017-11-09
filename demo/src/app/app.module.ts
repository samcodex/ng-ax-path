import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { NgCoordinateModule } from 'ng-ax-path';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpModule,
    BrowserModule,
    NgCoordinateModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
