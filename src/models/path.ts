import * as d3 from 'd3';
import { CSPL } from './cspl';
import { Coordinate } from './coordinate';
import { SvgElement } from './svg-element';
import { d3_util } from './d3.util';

export class Path extends SvgElement {
  parent: Coordinate;
  axisStep = 1;
  public hasDot = true;

  constructor(
    public points: Point[],
    public name: string = ''
  ) {
    super(name);

    this.setDefaultStyle();
    this.sort();
  }

  private sort() {
    this.points.sort((a, b) => a.x - b.x);
  }

  set color(color: string) {
    this.setStyle('stroke', color);
  }

  get color(): string {
    return this.getStyle('stroke');
  }

  private setDefaultStyle() {
    this.setAttr('class', 'line')
      .setStyle('stroke', '#000')
      .setAttr('fill', 'transparent')
      .setAttr('stroke-width', '1.5px');
  }

  buildGroup() {
    this.applyStyle();
    const d = this._buildSvgPath();

    this.group.append('path').attr('d', d);

    if (this.hasDot) {
      this.points.forEach((p) => this.buildPoint(p, this.color));
    }

  }

  private buildPoint(p: Point, color: string) {
    this.group.append('circle')
      .attr('cx', this.parent.xScale(p.x))
      .attr('cy', this.parent.yScale(p.y))
      .attr('r', 2)
      .attr('fill', color)
      .attr('stroke', 'transparent');
  }

  private _buildSvgPath() {
    let path;
    const step = 2 / this.parent.xScale(this.axisStep);
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

    path = 'M' + this._toXY(minx, CSPL.evalSpline(minx, xs, ys, ks)).join(',');
    for (let i = minx + step; i <= maxx; i += step) {
      path += (' ' + this._toXY(i, CSPL.evalSpline(i, xs, ys, ks)).join(','));
    }

    return path;
  }

  private _toXY(x: number, y: number): [number, number] {
    return [this.parent.xScale(x), this.parent.yScale(y)];
  }
}

export class Point {
  constructor(
    public x: number,
    public y: number
  ) {
  }
}
