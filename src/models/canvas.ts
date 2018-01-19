import { Observable } from 'rxjs/Observable';
import * as d3 from 'd3';

import { Axis, AxisOptions} from './axis';
import { Path } from './path';
import { Point } from './point';
import { SvgElement, RectangleSize, Rect, SVG_ELEMENT_TYPE } from './svg-element';
import { Legend, LegendStyle, LegendShape } from './legend';
import { d3_util } from './d3.util';
import { CanvasStyle, CanvasStyles, StyleOptions } from './canvas-style';

const DEFAULT_MARGIN: RectangleSize = {top: 5, left: 30, right: 15, bottom: 20};

const styles = [
  LegendStyle.UP_LEFT_IN_BLOCK,
  LegendStyle.UP_LEFT_IN_LINE,
  LegendStyle.UP_RIGHT_IN_BLOCK,
  LegendStyle.UP_RIGHT_IN_LINE,
  LegendStyle.BOTTOM_LEFT_IN_BLOCK,
  LegendStyle.BOTTOM_LEFT_IN_LINE,
  LegendStyle.BOTTOM_RIGHT_IN_BLOCK,
  LegendStyle.BOTTOM_RIGHT_IN_LINE,
  LegendStyle.UP_CENTER_IN_LINE,
  LegendStyle.BOTTOM_CENTER_IN_LINE,
  LegendStyle.UP_CENTER_OUT_LINE,       // 10
  LegendStyle.UP_LEFT_OUT_LINE,
  LegendStyle.UP_RIGHT_OUT_LINE,
  LegendStyle.BOTTOM_CENTER_OUT_LINE,
  LegendStyle.UP_LEFT_SIDE_BLOCK,
  LegendStyle.UP_RIGHT_SIDE_BLOCK,
  LegendStyle.BOTTOM_LEFT_SIDE_BLOCK,
  LegendStyle.BOTTOM_RIGHT_SIDE_BLOCK
];

export interface CanvasOptions {
  hasTitle?: boolean;
  hasLegend?: boolean;
}

export class Canvas extends SvgElement {
    /**
   * Canvas margin, can be changed
   */
  public margin: RectangleSize = {top: 0, left: 0, right: 0, bottom: 0};

  public defaultMargin: RectangleSize = DEFAULT_MARGIN;
  public fullSize: RectangleSize = {width: 0, height: 0};

  private canvasStyle: CanvasStyle;
  private styleOptions: StyleOptions;
  public canvasOptions: CanvasOptions = {};

  public legend: Legend;
  private canvasDomain: [number, number];

  private titleGroup: d3.Selection<d3.BaseType, {}, null, undefined>;
  private paths: Path[] = new Array<Path>();
  private xyAxis: {[key: string]: Axis} = {};

  private host: d3.Selection<d3.BaseType, {}, null, undefined>;

  private _hasObservable = false;
  // TODO
  private runningObservable = 0;

  constructor(
    name: string,
    fullSize: RectangleSize,
    canvasStyle: CanvasStyle = CanvasStyle.Coordinate,
    domain: [number, number] = [0, 0],
    legend: Legend = LegendStyle.UP_LEFT_IN_BLOCK
  ) {
    super(SVG_ELEMENT_TYPE.CANVAS, name);

    // this.legend = styles[10];

    this.size = {width: 0, height: 0};
    this.fullSize = fullSize;
    this.canvasStyle = canvasStyle || CanvasStyle.Coordinate;
    this.styleOptions = CanvasStyles[this.canvasStyle];

    this.legend = legend;
    this.canvasDomain = domain;

    this.titleGroup = d3_util.createGroup();
  }

  get hasObservable() {
    return this._hasObservable;
  }

  set xAxis(xAxis: Axis) {
    if (xAxis) {
      xAxis.type = SVG_ELEMENT_TYPE.AXIS_X;
      this.setXyAxis(xAxis);
    }
  }

  set yAxis(yAxis: Axis) {
    if (yAxis) {
      yAxis.type = SVG_ELEMENT_TYPE.AXIS_Y;
      this.setXyAxis(yAxis);
    }
  }

  get xAxis(): Axis{
    if (!this.xyAxis[SVG_ELEMENT_TYPE.AXIS_X]) {
      this.xAxis = this.createX('', '', {});
    }

    return this.xyAxis[SVG_ELEMENT_TYPE.AXIS_X];
  }

  get yAxis(): Axis{
    if (!this.xyAxis[SVG_ELEMENT_TYPE.AXIS_Y]) {
      this.yAxis = this.createY('', '', {});
    }

    return this.xyAxis[SVG_ELEMENT_TYPE.AXIS_Y];
  }

  /**
   * set legend shape
   * @memberof Canvas
   */
  set legendShape(legendShape: LegendShape) {
    this.legend.legendShape = legendShape;
  }

  getX(): Axis {
    return this.xAxis;
  }

  getY(): Axis {
    return this.yAxis;
  }

  createX(name: string, unit: string, options: AxisOptions): Axis {
    return this.xAxis = new Axis(SVG_ELEMENT_TYPE.AXIS_X, name, unit, options);
  }

  createY(name: string, unit: string, options: AxisOptions): Axis {
    return this.yAxis = new Axis(SVG_ELEMENT_TYPE.AXIS_Y, name, unit, options);
  }

  private setXyAxis(axis: Axis) {
    this.xyAxis[axis.type] = axis;
    this.addChild(axis);
  }

  /**
   * @public
   * @param {(Path | Point[] | [number, number][] | Observable<[number, number][] | {x: number, y: number}[])} data
   * @returns {Path | null}
   * @memberof Canvas
   * @see Path, Point
   */
  addPath(data: Path | Point[] | [number, number][] |
      Observable<[number, number][] | {x: number, y: number}[]>, name?: string): Path | null {
    if (data instanceof Path) {
      return this.addPathFromPath(data);
    } else if (data instanceof Array && data.length > 0 ) {
      if (data[0] instanceof Point) {
        return this.addPathFromPoints(<Point[]>data, name);
      } else if (data[0] instanceof Array) {
        return this.addPathFromArray(<[number, number][]>data, name);
      }
    } else if (data instanceof Observable) {
      return this._addPathFromObservable(data, name);
    }

    return null;
  }

  addPathFromArray(data: [number, number][], name?: string): Path {
    return this.addPathFromPoints(data.map(d => new Point(d[0], d[1] )), name);
  }

  addPathFromPoints(points: Point[], name?: string): Path {
    return this.addPathFromPath(new Path(points, name));
  }

  addPathFromPath(path: Path): Path {
    this.paths.push(path);
    this.addChild(path);
    return path;
  }

  private _addPathFromObservable(
    data: Observable<[number, number][] | {x: number, y: number}[]>,
    name?: string): Path {

    this._hasObservable = true;
    // TODO
    this.runningObservable++;

    const path = new Path([], name);

    data.subscribe((d: [number, number][] | {x: number, y: number}[]) => {
      let points: Point[];
      if (d[0] instanceof Array) {
        points = (<[number, number][]>d).map( (p: [number, number]) => new Point(p[0], p[1]));
      } else {
        points = (<{x: number, y: number}[]>d).map( (p: {x: number, y: number}) => new Point(p.x, p.y));
      }
      path.setPoints(points);

      this.addPathFromPath(path);

      // TODO
      this.runningObservable--;
      if (this.runningObservable === 0) {
        this.buildGroup();
      }
    });

    return path;
  }

  xScale(value: number): number {
    return this.xAxis.getScale()(value);
  }

  yScale(value: number): number {
    return this.yAxis.getScale()(value);
  }

  appendTo(host: d3.Selection<d3.BaseType, {}, null, undefined>) {
    this.host = host.insert('svg');

    this.setHostSize();

    this.appendGroup();
  }

  private setHostSize() {
    this.host.attr('width', Rect.width(this.fullSize))
      .attr('height', Rect.height(this.fullSize));
  }

  private applyCanvasStyle() {
    this.canvasOptions = Object.assign({}, this.styleOptions.CanvasOptions, this.canvasOptions);
  }

  private appendGroup() {
    this.applyCanvasStyle();

    this.host.append(() => this.group.node());

    if (this.canvasOptions.hasLegend) {
      this.host.append(() => this.legend.group.node());
    }

    if (this.canvasOptions.hasTitle) {
      this.host.append(() => this.titleGroup.node());
    }
  }

  buildGroup() {
    const xAxis = this.xAxis;
    const yAxis = this.yAxis;

    this.applyCanvasStyle();

    // draw title
    if (this.canvasOptions.hasTitle) {
      this.buildTitle();
    }

    // draw legend items
    if (this.canvasOptions.hasLegend) {
      const legendItem = this.legend.createLegendItem();
      this.paths.forEach((p, i) => legendItem.loop(p.name, p.color, i));
      legendItem.end();
    }

    // calculate margin
    const margin = this.canvasOptions.hasLegend ? this.legend.getCoordinateMargin(this.margin) : this.margin;
    const defMargin = this.defaultMargin;
    const titleRect = d3_util.getRect(this.titleGroup);
    const chartMargin = {
      left: Rect.left(defMargin) + Rect.left(margin),
      top: Rect.top(defMargin) + Rect.top(margin) + titleRect.height,
      right: Rect.right(defMargin) + Rect.right(margin),
      bottom: Rect.bottom(defMargin) + Rect.bottom(margin)
    };

    // move canvas
    this.group.attr('transform', `translate(${chartMargin.left},${chartMargin.top})`);

    // calculate canvas size
    this.size.width = Rect.width(this.fullSize) - chartMargin.left - chartMargin.right;
    this.size.height = Rect.height(this.fullSize) - chartMargin.top - chartMargin.bottom;

    xAxis.applyAxisOptions(this.styleOptions.AxisOptions);
    yAxis.applyAxisOptions(this.styleOptions.AxisOptions);

    // set x and y axis
    xAxis.setRange([0, this.size.width]);
    xAxis.setDomain([0, this.canvasDomain[0]]);

    yAxis.setRange([this.size.height, 0]);
    yAxis.setDomain([0, this.canvasDomain[1]]);

    this.paths.forEach( p => {
      xAxis.resetDomainWithPoint(p.xFirst, p.xLast);
      yAxis.resetDomainWithPoint(p.yFirst, p.yLast);
    });

    // draw x-axis, y-axis
    [xAxis, yAxis].forEach( axis => this.rebuild(axis));

    // draw paths
    this.paths.forEach( path => this.rebuild(path));

    // Title position
    if (this.canvasOptions.hasTitle) {
      const xTitle = chartMargin.left + (Rect.width(this.size) - titleRect.width) / 2;
      this.titleGroup.attr('transform', `translate(${xTitle},${titleRect.height})`);
    }

    // Legend position
    if (this.canvasOptions.hasLegend) {
      this.legend.transform(this.size, this.fullSize, titleRect);
    }
  }


  private buildTitle() {
    // build title
    this.titleGroup.selectAll('*').remove();

    this.titleGroup.append('text')
      .attr('fill', '#000')
      .style('font', '18px sans-serif')
      .text(this.name);
  }
}
