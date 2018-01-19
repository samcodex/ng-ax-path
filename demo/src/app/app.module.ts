import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { NgCanvasModule } from '../../../src/';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpModule,
    BrowserModule,
    NgCanvasModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
