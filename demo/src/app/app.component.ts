import { SVG_ELEMENT_TYPE } from './../../../src/models/svg-element';
import { Component, OnInit } from '@angular/core';
import { Canvas, Axis, Path, Point, LegendStyle, LegendShape, PathType, PointShape } from '../../../src';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

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
    const canvas = this.canvas = new Canvas('Demo', {width: 600, height: 400});
    canvas.legendShape = LegendShape.CIRCLE;
    canvas.legend = LegendStyle.BOTTOM_CENTER_OUT_LINE;
    canvas.hasLegend = false;
    canvas.hasTitle = false;

    canvas.createX('Time', 'months', {tickInterval: 3, extraSpace: 3});
    canvas.yAxis = new Axis(SVG_ELEMENT_TYPE.AXIS_Y, 'Weight', 'kg', {extraSpace: 10});

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
