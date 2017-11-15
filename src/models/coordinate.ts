import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as d3 from 'd3';
import { Axis, AXIS_TYPE} from './axis';
import { Path, Point } from './path';
import { SvgElement, RectangleSize, Rect } from './svg-element';
import { Legend, LegendStyle, LegendShape } from './legend';
import { d3_util } from './d3.util';

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

export type CoordinateOptions = {
  hasTitle: boolean,
  hasLegend: boolean
};

export class Coordinate extends SvgElement {

  private defaultMargin: RectangleSize = DEFAULT_MARGIN;
  private size: RectangleSize = {width: 0, height: 0};

  /**
   * Coordinate margin, can be changed
   */
  public margin: RectangleSize = {top: 0, left: 0, right: 0, bottom: 0};

  private titleGroup: d3.Selection<d3.BaseType, {}, null, undefined>;
  private paths: Path[] = new Array<Path>();
  private _xAxis: Axis;
  private _yAxis: Axis;

  private host: d3.Selection<d3.BaseType, {}, null, undefined>;

  constructor(
    name: string,
    private fullSize: RectangleSize,
    private options: CoordinateOptions = {hasTitle: true, hasLegend: true},
    public legend: Legend = LegendStyle.UP_LEFT_IN_BLOCK,
    xAxis?: Axis,
    yAxis?: Axis
  ) {
    super(name);

    // this.legend = styles[10];

    this.titleGroup = d3_util.createGroup();

    if (xAxis) {
      this.xAxis = xAxis;
    }

    if (yAxis) {
      this.yAxis = yAxis;
    }
  }

  set hasTitle(hasTitle: boolean) {
    this.options.hasTitle = hasTitle;
  }

  set hasLegend(hasLegend: boolean) {
    this.options.hasLegend = hasLegend;
  }

  set xAxis(xAxis: Axis) {
    if (xAxis) {
      this._xAxis = xAxis;
      this._xAxis.type = AXIS_TYPE.X;

      this.addChild(xAxis);
    }
  }

  get xAxis(): Axis{
    return this._xAxis;
  }

  set yAxis(yAxis: Axis) {
    if (yAxis) {
      this._yAxis = yAxis;
      this._yAxis.type = AXIS_TYPE.Y;

      this.addChild(yAxis);
    }
  }

  get yAxis(): Axis{
    return this._yAxis;
  }

  get $size(): RectangleSize {
    return this.size;
  }

  /**
   * set legend shape
   * @memberof Coordinate
   */
  set legendShape(legendShape: LegendShape) {
    this.legend.legendShape = legendShape;
  }

  /**
   * @public
   * @param {(Path | Point[] | [number, number][])} data
   * @returns {Path | null}
   * @memberof Coordinate
   * @see Path, Point
   */
  addPath(data: Path | Point[] | [number, number][], name?: string): Path | null {
    // Observable<Response> | Observable<[number, number][]>
    if (data instanceof Path) {
      return this.addPathFromPath(data);
    } else if (data instanceof Array && data.length > 0 ) {
      if (data[0] instanceof Point) {
        return this.addPathFromPoints(<Point[]>data, name);
      } else if (data[0] instanceof Array) {
        return this.addPathFromArray(<[number, number][]>data, name);
      }
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

    this._xAxis.adjustDomain(path);
    this._yAxis.adjustDomain(path);

    return path;
  }

  xScale(value: number): number {
    return this._xAxis.scale(value);
  }

  yScale(value: number): number {
    return this._yAxis.scale(value);
  }

  appendTo(host: d3.Selection<d3.BaseType, {}, null, undefined>) {
    this.host = host.select('div').insert('svg')
      .attr('width', Rect.width(this.fullSize))
      .attr('height', Rect.height(this.fullSize));

    this.host.append(() => this.group.node());

    if (this.options.hasLegend) {
      this.host.append(() => this.legend.group.node());
    }

    if (this.options.hasTitle) {
      this.host.append(() => this.titleGroup.node());
    }
  }

  buildGroup() {
    // draw title
    if (this.options.hasTitle) {
      this.buildTitle();
    }

    // draw legend items
    if (this.options.hasLegend) {
      const legendItem = this.legend.createLegendItem();
      this.paths.forEach((p, i) => legendItem.loop(p.name, p.color, i));
      legendItem.end();
    }

    // calculate margin
    const margin = this.options.hasLegend ? this.legend.getCoordinateMargin(this.margin) : this.margin;
    const defMargin = this.defaultMargin;
    const titleRect = d3_util.getRect(this.titleGroup);
    const chartMargin = {
      left: Rect.left(defMargin) + Rect.left(margin),
      top: Rect.top(defMargin) + Rect.top(margin) + titleRect.height,
      right: Rect.right(defMargin) + Rect.right(margin),
      bottom: Rect.bottom(defMargin) + Rect.bottom(margin)
    };

    // calculate coordinate size
    this.size.width = Rect.width(this.fullSize) - chartMargin.left - chartMargin.right;
    this.size.height = Rect.height(this.fullSize) - chartMargin.top - chartMargin.bottom;

    // set x and y axis
    if (this._xAxis) {
      this._xAxis.range = [0, this.size.width];
    }

    if (this._yAxis) {
      this._yAxis.range = [this.size.height, 0];
    }

    // move coordinate
    this.group.attr('transform', `translate(${chartMargin.left},${chartMargin.top})`);

    // draw x-axis, y-axis and paths
    this.children.forEach(child => {
      child.clearAll();

      this.group.append( () => child.group.node());

      child.buildGroup();
    });

    // Title position
    if (this.options.hasTitle) {
      const xTitle = chartMargin.left + (Rect.width(this.size) - titleRect.width) / 2;
      this.titleGroup.attr('transform', `translate(${xTitle},${titleRect.height})`);
    }

    // Legend position
    if (this.options.hasLegend) {
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
