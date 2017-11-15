import * as d3 from 'd3';
import { Coordinate } from './coordinate';
import { SvgElement, Rect } from './svg-element';
import { Path } from './path';
import { d3_util } from './d3.util';

export enum AXIS_TYPE {
  X = 'x',
  Y = 'y'
}

export class Axis extends SvgElement {
  type: AXIS_TYPE;
  title: string;

  range: [number, number];
  tickValues: number[];
  extraSpace = 0;

  scale: d3.ScaleLinear<number, number>;
  axis: d3.Axis<number | {valueOf(): number}>;

  parent: Coordinate;

  constructor(
    name: string,
    private unit: string,
    public tickInterval?: number,
    private domain: [number, number] = [0, 0]
  ) {
    super(name);

    if (!this.title) {
      this.title = `${name} (${unit})`;
    }

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
    let min, max;
    if (this.type === AXIS_TYPE.X) {
      min = path.points[0].x;
      max = path.points[last].x + this.extraSpace;
    } else {
      min = path.points[0].y;
      max = path.points[last].y + this.extraSpace;
    }
    max = Math.floor(max + 0.5);

    this.domain[0] = Math.min(this.domain[0], min);
    this.domain[1] = Math.max(this.domain[1], max);

    this._adjustData();
  }

  buildGroup() {
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

    this.group.attr('class', 'axis axis--' + this.type)
      .call(this.axis);

    if (this.type === AXIS_TYPE.X) {
      this.group
        .attr('transform', 'translate(0,' + this.parent.$size.height + ')')
        .append('text')
          .attr('x', Rect.width(this.parent.$size))
          .attr('y', -3)
          .attr('dy', '-.35em')
          .attr('fill', '#000')
          .style('text-anchor', 'end')
          .text(this.title);

      this.group.selectAll('.tick:not(:first-of-type)')
        .append('line')
        .attr('y2', -Rect.height(this.parent.$size))
        .attr('stroke', '#777')
        .attr('stroke-dasharray', '2,2');

    } else {
      this.group
        .append('text')
        .attr('dx', 8)
        .attr('dy', '.8em')
        .attr('fill', '#000')
        .style('text-anchor', 'start')
        .text(this.title);

      this.group.selectAll('.tick:not(:first-of-type)')
        .append('line')
        .attr('x2', Rect.width(this.parent.$size))
        .attr('stroke', '#777')
        .attr('stroke-dasharray', '2,2');
    }
  }

  getSize(): ClientRect {
    return d3_util.getRect(this.group);
  }
}
