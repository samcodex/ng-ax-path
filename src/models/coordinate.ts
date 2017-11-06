import * as d3 from 'd3';
import { CSPL } from './cspl';
import { Axis, AXIS_TYPE} from './axis';
import { Path } from './path';
import { SvgElement, PositionSize, RectangleSize } from './svg-element';


const DEFAULT_MARGIN: PositionSize = {top: 5, left: 30, right: 15, bottom: 20};

export class Coordinate extends SvgElement {

  margin: PositionSize;
  fullSize: RectangleSize;
  size: RectangleSize = {width: 0, height: 0};

  private paths: Path[] = new Array<Path>();
  private _xAxis: Axis;
  private _yAxis: Axis;

  constructor(
    fullSize: RectangleSize,
    margin: PositionSize = DEFAULT_MARGIN,
    xAxis?: Axis,
    yAxis?: Axis
  ) {
    super();

    this.fullSize = fullSize;
    this.margin = margin;
    this.size.width = (this.fullSize.width) - this.margin.left - this.margin.right;
    this.size.height = (this.fullSize.height) - this.margin.top - this.margin.bottom;

    if (xAxis) {
      this.xAxis = xAxis;
    }

    if (yAxis) {
      this.yAxis = yAxis;
    }
  }

  set xAxis(xAxis: Axis) {
    if (xAxis) {
      this._xAxis = xAxis;
      this._xAxis.type = AXIS_TYPE.X;
      this._xAxis.range = [0, this.size.width];

      this.addChild(xAxis);
    }
  }

  set yAxis(yAxis: Axis) {
    if (yAxis) {
      this._yAxis = yAxis;
      this._yAxis.type = AXIS_TYPE.Y;
      this._yAxis.range = [this.size.height, 0];

      this.addChild(yAxis);
    }
  }

  addPath(path: Path): Coordinate {
    this.paths.push(path);
    this.addChild(path);

    this._xAxis.adjustDomain(path);
    this._yAxis.adjustDomain(path);

    return this;
  }

  xScale(value: number): number {
    return this._xAxis.scale(value);
  }

  yScale(value: number): number {
    return this._yAxis.scale(value);
  }

  appendTo(host: d3.Selection<d3.BaseType, {}, Element, {}>): SvgElement {
    this.group = host.append('svg')
      .attr('width', this.fullSize.width)
      .attr('height', this.fullSize.height)
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');


    this.children.forEach(p => p.appendTo(this.group));

    return this;
  }
}
