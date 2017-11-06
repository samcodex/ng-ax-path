# ng-ax-path
Angular 4 base coordinate component.

# Installtion
npm install ng-ax-path --save


# Usage

## 1. component html - app.component.html
<ng-ax-path [coordinate]="coordinate"></ng-ax-path>

## 2. component typescript - app.component.ts

import { Component, OnInit } from '@angular/core';
import { Coordinate, Axis, Path, Point } from 'ng-ax-path';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  coordinate: Coordinate;

  ngOnInit() {
    this.coordinate = new Coordinate({width: 600, height: 400});

    this.coordinate.xAxis = new Axis({name: 'Age', unit: 'year'}, 3);
    const yAxis = this.coordinate.yAxis = new Axis({name: 'Weight', unit: 'kg'});
    yAxis.yAxisExtra = 10;

    const data = [[3,10],[6,18],[9,26],[10,60],[12,40],[15,60],[18,80]];
    const data2 = [[2,10],[4,18],[7,26],[9,60],[10,40],[12,60],[16,80], [18,90], [20,120]];
    const data3 = [[2,3],[4,7],[7,14],[9,23],[10,34],[12,16],[16,67], [18,16], [20,78]];

    const points: Point[] = data.map(d=>new Point( d[0], d[1] ));
    const points2: Point[] = data2.map(d=>new Point( d[0], d[1] ));
    const points3: Point[] = data3.map(d=>new Point( d[0], d[1] ));

    const path = new Path(points);
    const path2 = new Path(points2);
    const path3 = new Path(points3);

    this.coordinate.addPath(path);
    this.coordinate.addPath(path2);
    this.coordinate.addPath(path3);
  }
}
