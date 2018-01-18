import * as d3 from 'd3';
import { SvgElement, Rect, SVG_ELEMENT_TYPE } from './svg-element';
import { Path } from './path';
import { d3_util } from './d3.util';

export interface AxisOptions {
  tickInterval?: number;
  extraSpace?: number;
}

export class Axis extends SvgElement {
  private unit: string;
  private options: AxisOptions = {tickInterval: 0, extraSpace: 0};

  private tickValues: number[];
  private domain: [number, number] = [0, 0];
  private range: [number, number];

  private scale: d3.ScaleLinear<number, number>;
  private axis: d3.Axis<number | {valueOf(): number}>;

  constructor(
    type: SVG_ELEMENT_TYPE,
    name: string,
    unit: string,
    options: AxisOptions = {}
  ) {
    super(type, name);

    this.unit = unit;
    this.options = options;
  }

  setRange(r: [number, number]) {
    this.range = r;
  }

  setDataDomain(domain: [number, number]) {
    this.domain = domain;

    this.validDomain();
    this.calculateTickValues();
  }

  get title() {
    let title = this.name;

    if (this.unit && this.unit !== '') {
      title = `${title} (${this.unit})`;
    }

    return title;
  }

  getScale(): d3.ScaleLinear<number, number> {
    return this.scale;
  }

  private calculateTickValues() {
    const domain = this.domain;
    const tickInterval = this.options.tickInterval;

    if (domain) {
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

  private validDomain() {
    const domain = this.domain;

    if (domain && domain[0] > domain[1]) {
      this.domain = [domain[0], domain[1]] = [domain[1], domain[0]];
    }
  }

  resetDomainWithPath(path: Path) {
    const last = path.points.length - 1;
    let min, max;
    if (this.type === SVG_ELEMENT_TYPE.AXIS_X) {
      min = path.points[0].x;
      max = path.points[last].x + (this.options.extraSpace || 0);
    } else {
      min = path.points[0].y;
      max = path.points[last].y + (this.options.extraSpace || 0);
    }
    max = Math.floor(max + 0.5);

    this.domain[0] = Math.min(this.domain[0], min);
    this.domain[1] = Math.max(this.domain[1], max);

    this.calculateTickValues();
  }

  private createAxisAndScale() {
    // scale
    this.scale = d3.scaleLinear()
      .domain(this.domain)
      .range(this.range);

    // axis
    this.axis = this.type === SVG_ELEMENT_TYPE.AXIS_X
      ? d3.axisBottom(this.scale)
      : d3.axisLeft(this.scale);

    // tick
    if (this.tickValues && this.tickValues.length > 0) {
      this.axis.tickValues(this.tickValues);
    }
  }

  private appendAxisText() {
    const parentSize = this.parent.size;
    const text = this.group
        .append('text')
        .text(this.title);

    if (this.type === SVG_ELEMENT_TYPE.AXIS_X) {
      text
        .attr('x', Rect.width(parentSize))
        .attr('y', -3)
        .attr('dy', '-.35em')
        .attr('fill', '#000')
        .style('text-anchor', 'end');
    } else {
      text
        .attr('dx', 8)
        .attr('dy', '.8em')
        .attr('fill', '#000')
        .style('text-anchor', 'start');
    }
  }

  private appendTickLine() {
    const parentSize = this.parent.size;
    const lines = this.group.selectAll('.tick:not(:first-of-type)')
      .append('line')
      .attr('stroke', '#777')
      .attr('stroke-dasharray', '2,2');

    if (this.type === SVG_ELEMENT_TYPE.AXIS_X) {
      lines.attr('y2', -Rect.height(parentSize));
    } else {
      lines.attr('x2', Rect.width(parentSize));
    }
  }

  buildGroup() {
    this.createAxisAndScale();

    const parentSize = this.parent.size;

    this.group
      .attr('class', 'axis axis--' + this.type)
      .call(this.axis);

    if (this.type === SVG_ELEMENT_TYPE.AXIS_X) {
      this.group.attr('transform', 'translate(0,' + parentSize.height + ')');
    }

    this.appendAxisText();

    this.appendTickLine();
  }

  getSize(): ClientRect {
    return d3_util.getRect(this.group);
  }
}
