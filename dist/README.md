# ng-ax-path
**Angular curved line chart component for web and Ionic application**

## Description
ng-ax-path creates a curved line chart with two dimensions base on the passing individual data points. 
Compatible with __Ionic 2__, __Angular2__ and __Angular4__ versions.

<p>Display legend inside the chart</p>
<img src="https://github.com/samcodex/ng-ax-path/blob/master/assets/chart_legend_in_block.png" alt="Legend_In_Block" width="500px"/>

<br>
<p>Display legend outside the chart</p>
<img src="https://github.com/samcodex/ng-ax-path/blob/master/assets/chart_legend_out_block.png" alt="Legend_Out_Block" width="500px"/>

<br>
<p>Display legend on top of the chart</p>
<img src="https://github.com/samcodex/ng-ax-path/blob/master/assets/chart_title_legend_out_center.png" alt="Legend_Out_Center" width="500px"/>

## Installation
npm install ng-ax-path --save

## Usage
import NgCanvasModule inside your module to be able to use ng-ax-path component.

```ts
import { NgCanvasModule } from 'ng-ax-path';

@NgModule({
  imports: [
    ...
    NgCanvasModule
  ],
  ...
})
export class YourModule {}
```

### Code Examples
1. add ng-ax-path component into html template - app.component.html
<ng-ax-path [coordinate]="coordinate"></ng-ax-path>

2. set ng-ax-path data in component class - app.component.ts
```ts
import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Canvas, Axis, Path, Point, LegendStyle, LegendShape, PathType, PointShape, CanvasStyle, SVG_ELEMENT_TYPE } from '../../../src';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  canvas: Canvas;

  constructor(private http: Http) {}

  ngOnInit() {
    const canvas = this.canvas = new Canvas('Demo', {width: 600, height: 400}, CanvasStyle.Coordinate, [30, 130]);
    canvas.legendShape = LegendShape.CIRCLE;
    canvas.legend = LegendStyle.BOTTOM_CENTER_OUT_LINE;
    // canvas.defaultMargin = {left:0, top: 0, right: 1, bottom: 1};

    // xAxis.options.disableAxisLine = true;
    canvas.createX('Time', 'months', {tickInterval: 3, extraSpace: 3});
    canvas.yAxis = new Axis(SVG_ELEMENT_TYPE.AXIS_Y, 'Weight', 'kg', {extraSpace: 10});
    const xAxis = canvas.getX();
    xAxis.options.tickInterval = 3;

    const yAxis = canvas.getY();

    // add path from Path instance
    const data = [[0,0],[3,10],[6,18],[9,16],[12,22],[13,26],[15,30],[18,40],[20,60],[22,62],[24,50]];
    const points: Point[] = data.map(d=>new Point( d[0], d[1] ));
    const path = new Path(points, 'Data Set 1 - 2014');
    canvas.addPath(path);

    // add path from tuple[number, number]
    const data2: [number, number][] = [[2,10],[4,18],[7,26],[9,60],[10,40],[12,60],[16,80], [18,90], [20,120]];
    const path2 = canvas.addPath(data2, 'Data 2');
    path2.color = 'red';
    path2.pointShape = PointShape.SQUARE;

    // add path from Points[]
    const data3 = [[2,53],[4,57],[7,64],[9,73],[10,84],[12,100],[16,97], [18,102], [20,78], [22,68]];
    const points3: Point[] = data3.map(d=>new Point( d[0], d[1] ));
    const path3 = canvas.addPath(points3, 'Data 3');
    path3.color = 'blue';
    path3.hasDot = false;

    // add path with Observable
    // this.http.get('assets/data/data1.json').subscribe(d=> {
    //   canvas.addPath(d.json(), 'Data from Json').color = 'purple';
    //   canvas.buildGroup();
    // });

    // Observable, data format [[number, number]]
    const path4 = canvas.addPath(
      this.http.get('assets/data/data1.json')
        .map(d => <[number, number][]>d.json()),
      'Data from Json'
    );
    path4.color = 'purple';
    path4.pathType = PathType.STRAIGHT_LINE;
    path4.pointShape = PointShape.TRIANGLE;

    // Observable, data format [{x,y}]
    canvas.addPath(
      this.http.get('assets/data/data2.json')
        .map( d => <{x: number, y: number}[]>d.json().map(c => ({ x: c[0], y: c[1] }))),
      'Data Set 5 Json'
    ).color = 'green';
  }
}
```

## Canvas Style
CanvasStyle.Coordinate      // with canvas title, legend, axis line, tick line
CanvasStyle.CanvasBoard     // with tick line, no title, legend and axis line

## Legend Shape
```
LegendShape.LINE
LegendShape.CIRCLE
LegendShape.RECTANGLE
LegendShape.ELLIPSE
```

## Legend Style
```
LegendStyle.UP_LEFT_IN_BLOCK
LegendStyle.UP_LEFT_IN_LINE
LegendStyle.UP_RIGHT_IN_BLOCK
LegendStyle.UP_RIGHT_IN_LINE
LegendStyle.BOTTOM_LEFT_IN_BLOCK
LegendStyle.BOTTOM_LEFT_IN_LINE
LegendStyle.BOTTOM_RIGHT_IN_BLOCK
LegendStyle.BOTTOM_RIGHT_IN_LINE
LegendStyle.UP_CENTER_IN_LINE
LegendStyle.BOTTOM_CENTER_IN_LINE
LegendStyle.UP_CENTER_OUT_LINE
LegendStyle.UP_LEFT_OUT_LINE
LegendStyle.UP_RIGHT_OUT_LINE
LegendStyle.BOTTOM_CENTER_OUT_LINE
LegendStyle.UP_LEFT_SIDE_BLOCK
LegendStyle.UP_RIGHT_SIDE_BLOCK
LegendStyle.BOTTOM_LEFT_SIDE_BLOCK
LegendStyle.BOTTOM_RIGHT_SIDE_BLOCK
```

# Built With
- d3
- [cspl](https://github.com/kuckir/CSPL.js).

# Authors
[Samuel Xie](mailto:xie.samuel@gmail.com)
