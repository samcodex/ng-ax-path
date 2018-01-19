import { Component, OnInit, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

import { Canvas } from './models/canvas';

@Component({
  selector: 'ng-ax-path',
  encapsulation: ViewEncapsulation.None,
  template: '<div class="ng-ax-path-svg"></div>',
  // styleUrls: ['./ng-canvas.component.scss']
})
export class NgCanvasComponent implements OnInit {

  @Input() private canvas: Canvas;

  private htmlElement: HTMLElement;
  private host: d3.Selection<Element, {}, Element | any, {} | any>;

  constructor(
    private elementRef: ElementRef
  ) {
    this.htmlElement = this.elementRef.nativeElement;
    this.host = d3.select(this.htmlElement);
  }

  ngOnInit() {
    this.canvas.appendTo(this.host.select('div'));

    if (!this.canvas.hasObservable) {
      this.canvas.buildGroup();
    }
  }
}
