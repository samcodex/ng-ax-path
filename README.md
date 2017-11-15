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

1. add ng-ax-path component into html template - app.component.html
<ng-ax-path [coordinate]="coordinate"></ng-ax-path>

2. set ng-ax-path data in component class - app.component.ts
```ts
import { Component, OnInit } from '@angular/core';
import { Coordinate, Axis, Path, Point, LegendStyle, LegendShape, Legend } from 'ng-ax-path';
import { Http } from '@angular/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  coordinate: Coordinate;

  constructor(private http: Http) {}

  ngOnInit() {
    this.coordinate = new Coordinate('Demo', {width: 600, height: 400});
    this.coordinate.legendShape = LegendShape.CIRCLE;
    this.coordinate.legend = LegendStyle.BOTTOM_CENTER_OUT_LINE;
    // this.coordinate.hasLegend = false;
    // this.coordinate.hasTitle = false;

    this.coordinate.xAxis = new Axis('Time', 'months', 3);
    this.coordinate.xAxis.extraSpace = 3;

    this.coordinate.yAxis = new Axis('Weight', 'kg');
    this.coordinate.yAxis.extraSpace = 10;

    // add path from Path instance
    const data = [[0,0], [3,10],[6,18],[9,26],[10,60],[12,40],[15,60],[18,80]];
    const points: Point[] = data.map(d=>new Point( d[0], d[1] ));
    const path = new Path(points, 'Data Set 1 - 2014');
    this.coordinate.addPath(path);

    // add path from tuple[number, number]
    const data2: [number, number][] = [[2,10],[4,18],[7,26],[9,60],[10,40],[12,60],[16,80], [18,90], [20,120]];
    this.coordinate.addPath(data2, 'Data 2').color = 'red';

    // add path from Points[]
    const data3 = [[2,53],[4,57],[7,64],[9,73],[10,84],[12,100],[16,97], [18,102], [20,78]];
    const points3: Point[] = data3.map(d=>new Point( d[0], d[1] ));
    this.coordinate.addPath(points3, 'Data 3').color = 'blue';

    // add path with Observable
    this.http.get('assets/data/data1.json').subscribe(d=> {
      this.coordinate.addPath(d.json(), 'Data from Json').color = 'purple';
      this.coordinate.buildGroup();
    });
  }
}
```

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
