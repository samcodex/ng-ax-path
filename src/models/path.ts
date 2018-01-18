import * as d3 from 'd3';
import { CSPL } from './cspl';
import { Canvas } from './canvas';
import { SvgElement, SVG_ELEMENT_TYPE } from './svg-element';
import { d3_util } from './d3.util';
import { Point, PointShape } from './point';

export enum PathType {
  CURVED_LINE = 'CurvedLine',
  STRAIGHT_LINE = 'StraightLine'
}

export class Path extends SvgElement {
  parent: Canvas;
  axisStep = 1;
  public hasDot = true;
  public pathType: PathType = PathType.CURVED_LINE;
  public pointShape: PointShape = PointShape.CIRCLE;
  public points: Point[];

  constructor(
    points: Point[],
    name: string = ''
  ) {
    super(SVG_ELEMENT_TYPE.PATH, name);

    this.points = points;
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
    let path: [number, number][];

    if (this.pathType === PathType.CURVED_LINE) {
      path = this._buildCurvedPath();
    } else {
      path = this.points.map(p => this._toXY(p.x, p.y));
    }

    this.group.append('path').attr('d', path.reduce((s, p) => s += p.join(',') + ' ', 'M').trim());

    if (this.hasDot) {
      this.points.forEach(
        (p: Point) => this.group.append(() => p.createElement(this.parent, this.color, this.pointShape).node())
      );
    }
  }

  private _buildCurvedPath(): [number, number][] {
    const path: [number, number][] = [];
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

    path.push(this._toXY(minx, CSPL.evalSpline(minx, xs, ys, ks)));
    for (let i = minx + step; i <= maxx; i += step) {
      path.push(this._toXY(i, CSPL.evalSpline(i, xs, ys, ks)));
    }

    return path;
  }

  private _toXY(x: number, y: number): [number, number] {
    return [this.parent.xScale(x), this.parent.yScale(y)];
  }
}
