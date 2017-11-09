import { Component, OnInit } from '@angular/core';
import { Coordinate, Axis, Path, Point } from 'ng-ax-path';
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
    this.coordinate = new Coordinate({width: 600, height: 400});

    this.coordinate.xAxis = new Axis({name: 'Time', unit: 'months'}, 3);
    const yAxis = this.coordinate.yAxis = new Axis({name: 'Weight', unit: 'kg'});
    yAxis.yAxisExtra = 10;

    // add path from Path instance
    const data = [[3,10],[6,18],[9,26],[10,60],[12,40],[15,60],[18,80]];
    const points: Point[] = data.map(d=>new Point( d[0], d[1] ));
    const path = new Path(points);
    this.coordinate.addPath(path);

    // add path from tuple[number, number]
    const data2: [number, number][] = [[2,10],[4,18],[7,26],[9,60],[10,40],[12,60],[16,80], [18,90], [20,120]];
    this.coordinate.addPath(data2);

    // add path from Points[]
    const data3 = [[2,53],[4,57],[7,64],[9,73],[10,84],[12,100],[16,97], [18,102], [20,78]];
    const points3: Point[] = data3.map(d=>new Point( d[0], d[1] ));
    this.coordinate.addPath(points3);

    // add path with Observable
    this.http.get('assets/data/data1.json').subscribe(d=> {
      this.coordinate.addPath(d.json());
      this.coordinate.redrawPath();
    });
  }
}
