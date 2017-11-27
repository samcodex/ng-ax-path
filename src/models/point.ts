import { d3_util} from './d3.util';
import { Coordinate } from './coordinate';
import { SvgElement } from './svg-element';

export class Point {
  pointShape: PointShape | null = null;
  color: string | null = null;
  text: string | null = null;

  constructor(
    public x: number,
    public y: number,
    color?: string
  ) {
  }

  createElement(coordinate: Coordinate, color: string, pointShape?: PointShape): d3.Selection<d3.BaseType, {}, null, undefined> {
    let element: d3.Selection<d3.BaseType, {}, null, undefined>;
    const x = coordinate.xScale(this.x);
    const y = coordinate.yScale(this.y);

    pointShape = this.pointShape || pointShape;
    color = this.color || color;

    if (pointShape === PointShape.SQUARE) {
      const squareLength = 5;
      element = d3_util.createGroup('rect')
      .attr('x', x - squareLength / 2).attr('y', y - squareLength / 2)
      .attr('width', squareLength).attr('height', squareLength);

    } else if (pointShape === PointShape.TRIANGLE) {
      const sideLength = 8;
      const pts = d3_util.createEqTriangle(sideLength, [x, y]);

      element = d3_util.createGroup('polygon')
        .attr('points', pts.map(p => p.join(',')).join(' '));

    } else {
      const radius = 3;
      element = d3_util.createGroup('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', radius);
    }

    element.attr('fill', color).attr('stroke', 'transparent');

    return element;
  }
}

export enum PointShape {
  CIRCLE = 'Circle',
  TRIANGLE = 'Triangle',
  SQUARE = 'Square'
}
