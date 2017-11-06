import { Component, OnInit, ElementRef, Input } from '@angular/core';
import * as d3 from 'd3';

import { Coordinate } from './models/index';

@Component({
  selector: 'ng-ax-path',
  template: ""
})
export class NgCoordinateComponent implements OnInit {

  @Input() private coordinate: Coordinate;

  private htmlElement: HTMLElement;
  private host: d3.Selection<Element, {}, Element | any, {} | any>;

  constructor(
    private elementRef: ElementRef
  ) {
    this.htmlElement = this.elementRef.nativeElement;
    this.host = d3.select(this.htmlElement);
  }

  ngOnInit() {
    this.coordinate.appendTo(this.host);
  }
}
