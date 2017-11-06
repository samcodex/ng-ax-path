import * as d3 from 'd3';
import { Coordinate } from './coordinate';
import { SvgElement } from './svg-element';
import { Path } from './path';

export enum AXIS_TYPE {
  X = 'x',
  Y = 'y'
}

export type AxisOptions = {
  name?: string,
  title?: string,
  unit?: string
};

export class Axis extends SvgElement {
  type: AXIS_TYPE;
  name: string;
  title: string;
  unit: string;

  domain: [number, number];
  range: [number, number];
  tickValues: number[];
  yAxisExtra: number;

  scale: d3.ScaleLinear<number, number>;
  axis: d3.Axis<number | {valueOf(): number}>;

  parent: Coordinate;

  constructor(
    options: AxisOptions,
    public tickInterval?: number,
    domain: [number, number] = [0, 0]
  ) {
    super();

    this.name = options.name || '';
    this.title = options.title || '';
    this.unit = options.unit || '';
    if (!this.title) {
      this.title = `${this.name} (${this.unit})`;
    }

    this.domain = domain || [0, 0];

    this._adjustData();
  }

  private _adjustData() {
    const domain = this.domain;
    const tickInterval = this.tickInterval;

    if (domain) {
      if (domain[0] > domain[1]) {
        [domain[0], domain[1]] = [domain[1], domain[0]];
      }

      if (tickInterval && tickInterval > 0) {
        this.tickValues = new Array<number>();

        let i = domain[0];
        for (; i <= domain[1]; i = i + tickInterval) {
          this.tickValues.push(i);
        }
        if (i > domain[1]) {
          this.tickValues.push(domain[1]);
        }
      }
    }
  }

  adjustDomain(path: Path) {
    const last = path.points.length - 1;
    const min = this.type === AXIS_TYPE.X ? path.points[0].x : path.points[0].y;
    let max = this.type === AXIS_TYPE.X ? path.points[last].x : (path.points[last].y + this.yAxisExtra || 0);
    max = Math.floor(max + 0.5);

    this.domain[0] = Math.min(this.domain[0], min);
    this.domain[1] = Math.max(this.domain[1], max);

    this._adjustData();
  }

  appendTo(host: d3.Selection<d3.BaseType, {}, Element, {}>): SvgElement {

    this.scale = d3.scaleLinear()
      .domain(this.domain)
      .range(this.range);

    if (this.type === AXIS_TYPE.X) {
      this.axis = d3.axisBottom(this.scale);
    } else {
      this.axis = d3.axisLeft(this.scale);
    }

    if (this.tickValues && this.tickValues.length > 0) {
      this.axis.tickValues(this.tickValues);
    }

    this.group = host.append("g").attr("class", "axis axis--" + this.type);
    this.group.call(this.axis);

    if (this.type === AXIS_TYPE.X) {
      this.group
        .attr("transform", "translate(0," + this.parent.size.height + ")")
        .append("text")
          .attr("x", this.parent.size.width)
          .attr("y", -3)
          .attr("dy", "-.35em")
          .attr("fill", "#000")
          .style("text-anchor", "end")
          .text(this.title);

      this.group.selectAll(".tick:not(:first-of-type)")
        .append("line")
        .attr("y2", -this.parent.size.height)
        .attr("stroke", "#777")
        .attr("stroke-dasharray", "2,2");

    } else {
      this.group
        .append("text")
        .attr("dx", 8)
        .attr("dy", ".8em")
        .attr("fill", "#000")
        .style("text-anchor", "start")
        .text(this.title);

      this.group.selectAll(".tick:not(:first-of-type)")
        .append("line")
        .attr("x2", this.parent.size.width)
        .attr("stroke", "#777")
        .attr("stroke-dasharray", "2,2");
    }

    return this;
  }
}
