import * as d3 from 'd3';
import { CSPL } from './cspl';
import { Coordinate } from './coordinate';
import { SvgElement } from './svg-element';

export class Path extends SvgElement {
  parent: Coordinate;
  axisStep = 1;

  constructor(
    public points: Point[]
  ) {
    super();

    this.sort();
  }

  private sort() {
    this.points.sort((a, b) => a.x - b.x);
  }

  appendTo(host: d3.Selection<d3.BaseType, {}, Element, {}>): SvgElement {
    const d = this._buildSvgPath();

    host.append('path')
      .attr('class', 'line')
      .style('stroke', '#000')
      .style('fill', 'transparent')
      .style('stroke-width', '1.5px')
      .attr('d', d);

    return this;

  }

  private _buildSvgPath() {
    let path;
    const step = 2/this.parent.xScale(this.axisStep);
    const points: Point[] = this.points;
    const xs: number[] = [],
      ys: number[] = [],
      ks: number[] = [];

    points.forEach((p, i) => {
      xs[i] = p.x;
      ys[i] = p.y;
      ks[i] = 1;
    });

    CSPL.getNaturalKs(xs, ys, ks);

    const minx = points[0].x;
    const maxx = points[points.length - 1].x;

    path = 'M' + this._toXY(minx, CSPL.evalSpline(minx, xs, ys, ks));
    for (let i = minx + step; i <= maxx; i += step) {
      path += (' ' + this._toXY(i, CSPL.evalSpline(i, xs, ys, ks)));
    }

    return path;
  }

  private _toXY(x: number, y: number) {
    return this.parent.xScale(x) + ',' + this.parent.yScale(y);
  }
}

export class Point {
  constructor(
    public x: number,
    public y: number
  ) {
  }
}
