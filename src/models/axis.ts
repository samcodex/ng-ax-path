import * as d3 from 'd3';
import { SvgElement, Rect, SVG_ELEMENT_TYPE } from './svg-element';
import { d3_util } from './d3.util';
import { Point } from './point';

export interface AxisOptions {
  tickInterval?: number;
  extraSpace?: number;
  disableAxisTitle?: boolean;
  disableAxisLine?: boolean;
  disableTickLine?: boolean;
  disableTickMark?: boolean;
  disableTickNumber?: boolean;
}

export class Axis extends SvgElement {
  private unit: string;
  public defaultOptions: AxisOptions = {
    tickInterval: 0,
    extraSpace: 0,
    disableAxisTitle: false,
    disableAxisLine: false,
    disableTickLine: false,
    disableTickMark: false,
    disableTickNumber: false
  };
  public options: AxisOptions = {};

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
    Object.assign(this.options, options);
  }

  setRange(r: [number, number]) {
    this.range = r;
  }

  setDomain(domain: [number, number]) {
    this.domain[0] = Math.min(this.domain[0], domain[0]);
    this.domain[1] = Math.max(this.domain[1], domain[1]);

    this.validDomain();
    this.calculateTickValues();
  }

  resetDomainWithPoint(first: Point, last: Point) {
    let min, max;
    if (this.type === SVG_ELEMENT_TYPE.AXIS_X) {
      min = first.x;
      max = last.x + (this.options.extraSpace || 0);
    } else {
      min = first.y;
      max = last.y + (this.options.extraSpace || 0);
    }
    max = Math.floor(max + 0.5);

    this.setDomain([min, max]);
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

  applyAxisOptions(options: AxisOptions) {
    this.options = Object.assign({}, options, this.options);
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

  private appendAxisTitle() {
    const parentSize = this.parent.size;
    const className = `${this.type.substr(-1).toLocaleLowerCase()}-axis-title`;

    const text = this.group
        .append('text')
        .attr('class', `axis-title ${className}`)
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

  private appendTickLine(noZeroTick: boolean = true, hasLastTick: boolean = true) {
    const parentSize = this.parent.size;
    const tickClass = noZeroTick ? '.tick:not(:first-of-type)' : '.tick';

    const lines = this.group.selectAll(tickClass)
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
    const className = `${this.type.substr(-1).toLocaleLowerCase()}-axis`;
    let noZeroTick = true;

    this.group
      .attr('class', `axis ${className}`)
      .call(this.axis);

    if (this.type === SVG_ELEMENT_TYPE.AXIS_X) {
      this.group.attr('transform', 'translate(0,' + parentSize.height + ')');
    }

    if (!this.options.disableAxisTitle) {
      this.appendAxisTitle();
    }

    if (this.options.disableAxisLine) {
      this.disableAxisLine();
      this.disableTickMark();

      noZeroTick = false;
    }

    if (this.options.disableTickMark) {
      this.disableTickMark();
    }

    if (!!this.options.disableTickNumber) {
      this.disableTickNumber();
    }

    if (!this.options.disableTickLine) {
      this.appendTickLine(noZeroTick);
    }
  }

  getSize(): ClientRect {
    return d3_util.getRect(this.group);
  }

  private disableAxisLine() {
    this.group.select('path').attr('stroke', 'none');
  }

  private disableTickMark() {
    this.group.selectAll('.tick').select('line').attr('stroke', 'none');
  }

  private disableTickNumber() {
    this.group.selectAll('.tick').select('text').attr('fill', 'none');
  }
}
