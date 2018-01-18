import { SvgElement, RectangleSize, Rect, SVG_ELEMENT_TYPE } from './svg-element';
import { d3_util } from './d3.util';

enum PositionH {
  LEFT = 'Left',
  RIGHT = 'Right',
  CENTER = 'Center'
}

enum PositionV {
  UP = 'Up',
  BOTTOM = 'Bottom',
  MIDDLE = 'Middle'
}

export enum LegendLayout {
  BLOCK = 'Block',
  LINE = 'Line'
}

export enum LegendPosition {
  UP_LEFT = 'UpLeft',
  UP_RIGHT = 'UpRight',
  BOTTOM_LEFT = 'BottomLeft',
  BOTTOM_RIGHT = 'BottomRight',
  UP_CENTER = 'UpCenter',
  BOTTOM_CENTER = 'BottomCenter'
}

export enum LegendRange {
  IN = 'In',
  OUT = 'Out',
  SIDE = 'Side'
}

export enum LegendShape {
  LINE = 'Line',
  CIRCLE = 'Circle',
  RECTANGLE = 'Rectangle',
  ELLIPSE = 'Ellipse'
}

const yAxisWidth = 20;

export class Legend extends SvgElement {
  private positionH: PositionH;
  private positionV: PositionV;
  private legendSize: ClientRect;
  public legendShape: LegendShape = LegendShape.LINE;

  /**
   * Legend margin, can be changed
   */
  private insideRect: RectangleSize = {top: 30, right: 25, bottom: 20, left: 30};

  constructor(
    public layout: LegendLayout,
    public position: LegendPosition,
    public range: LegendRange
  ) {
    super(SVG_ELEMENT_TYPE.LEGEND);

    const ps: string[] = position.split(/(?=[A-Z])/);
    this.positionV = <PositionV>PositionV[<any>ps[0].toUpperCase()];
    this.positionH = <PositionH>PositionH[<any>ps[1].toUpperCase()];
  }

  get $legendSize(): ClientRect {
    return this.legendSize;
  }

  buildGroup() {
    this.group
      .attr('class', 'legend')
      .style('fill', 'transparent')
      .style('stroke-width', '1px');
  }

  private itemX(i: number, offset: number): number {
    switch (this.layout) {
      case LegendLayout.LINE:
        return 15 * i + offset;
      case LegendLayout.BLOCK:
      default:
        return 0;
    }
  }

  private itemY(i: number): number {
    switch (this.layout) {
      case LegendLayout.LINE:
        return 0;
      case LegendLayout.BLOCK:
      default:
        return 15 * i;
    }
  }

  private x(size: RectangleSize, fullSize: RectangleSize, titleSize: RectangleSize): number {
    if (this.range === LegendRange.IN || this.range === LegendRange.OUT) {
      switch (this.positionH) {
        case PositionH.RIGHT:
          return Rect.width(fullSize) - this.legendSize.width - Rect.right(this.insideRect);
        case PositionH.CENTER:
          return (Rect.width(size) - this.legendSize.width) / 2 + Rect.left(this.insideRect) + yAxisWidth;
        case PositionH.LEFT:
        default:
          return Rect.left(this.insideRect) + yAxisWidth;
      }
    } else {
      // LegendRange.SIDE
      switch (this.positionH) {
        case PositionH.RIGHT:
          return Rect.width(size) + this.legendSize.width / 2;
        case PositionH.LEFT:
        default:
          return yAxisWidth;
      }
    }
  }

  private y(size: RectangleSize, fullSize: RectangleSize, titleSize: RectangleSize) {
    if (this.range === LegendRange.IN || this.range === LegendRange.SIDE) {
      switch (this.positionV) {
        case PositionV.BOTTOM:
          return Rect.height(size) - this.legendSize.height;
        case PositionV.UP:
        default:
          return this.insideRect.top + Rect.height(titleSize);
      }
    } else {
      // LegendRange.OUT
      switch (this.positionV) {
        case PositionV.BOTTOM:
          return Rect.height(fullSize) - this.legendSize.height - 10;
        case PositionV.UP:
        default:
          return Rect.height(titleSize) + Rect.top(this.insideRect) / 2;
      }
    }
  }

  getCoordinateMargin(coordinateMargin: RectangleSize): RectangleSize {
    const margin: RectangleSize = Object.assign({}, coordinateMargin);

    if (this.range === LegendRange.OUT) {
      switch (this.positionV) {
        case PositionV.BOTTOM:
          margin.bottom = margin.bottom || 0 + 30;
          break;
        case PositionV.UP:
        default:
          margin.top = margin.top || 0 + 30;
      }
    } else if (this.range === LegendRange.SIDE) {
      switch (this.positionH) {
        case PositionH.RIGHT:
          margin.right +=  this.legendSize.width + Rect.right(this.insideRect);
          break;
        case PositionH.LEFT:
        default:
          margin.left += this.legendSize.width + Rect.left(this.insideRect);
      }
    }

    return margin;
  }

  createLegendItem(): {loop: Function, end: Function} {
    this.clear();
    let offset = 0;

    return {
      loop: (name: string, color: string, index: number): d3.Selection<d3.BaseType, {}, null, undefined> => {
        const legendItem = d3_util.createGroup().attr('class', 'legend-item');
        const figure = this.createItemFigure(color);

        this.group.append(() => legendItem.node());
        legendItem.append(() => figure.node());
        const figureRect = d3_util.getRect(figure);

        legendItem.append('text')
          .attr('x', this.getItemX(figureRect))
          .attr('y', figureRect.height === 0 ? 3 : figureRect.height / 2)
          .attr('fill', '#000')
          .style('font', '10px sans-serif')
          .text(name);

        const xItem = this.itemX(index, offset);
        const yItem = this.itemY(index);
        legendItem.attr('transform', `translate(${xItem},${yItem})`);

        offset += d3_util.getRect(legendItem).width;

        return legendItem;
      },
      end: () => {
        this.legendSize = d3_util.getRect(this.group);
      }
    };
  }

  transform(size: RectangleSize, fullSize: RectangleSize, titleSize: RectangleSize) {
    const xLegend = this.x(size, fullSize, titleSize);
    const yLegend = this.y(size, fullSize, titleSize);

    this.group.attr('transform', `translate(${xLegend},${yLegend})`);
    this.legendSize = d3_util.getRect(this.group);
  }

  private createItemFigure(color: string): d3.Selection<d3.BaseType, {}, null, undefined> {
    switch (this.legendShape) {
      case LegendShape.CIRCLE:
        return d3_util.createGroup('circle')
          .attr('cy', 1)
          .attr('r', 4)
          .style('stroke', 'transparent')
          .style('fill', color);
      case LegendShape.RECTANGLE:
        return d3_util.createGroup('rect')
          .attr('y', -3)
          .attr('width', 10)
          .attr('height', 5)
          .style('stroke', 'transparent')
          .style('fill', color);
      case LegendShape.ELLIPSE:
        return d3_util.createGroup('ellipse')
          .attr('y', -2)
          .attr('rx', 8)
          .attr('ry', 4)
          .style('stroke', 'transparent')
          .style('fill', color);
      case LegendShape.LINE:
      default:
        return d3_util.createGroup('line')
          .attr('x2', 10)
          .attr('y2', 0)
          .style('stroke', color)
          .style('fill', 'transparent')
          .style('stroke-width', '1px');
    }
  }

  private getItemX(figureRect: ClientRect): number {
    switch (this.legendShape) {
      case LegendShape.CIRCLE:
      case LegendShape.ELLIPSE:
        return figureRect.width / 2 + 3;
      case LegendShape.RECTANGLE:
      case LegendShape.LINE:
      default:
        return figureRect.width + 3;
    }
  }
}

export namespace LegendStyle {
  // in & up
  export const UP_LEFT_IN_BLOCK = new Legend(
    LegendLayout.BLOCK, LegendPosition.UP_LEFT, LegendRange.IN);

  export const UP_LEFT_IN_LINE = new Legend(
    LegendLayout.LINE, LegendPosition.UP_LEFT, LegendRange.IN);

  export const UP_RIGHT_IN_BLOCK = new Legend(
    LegendLayout.BLOCK, LegendPosition.UP_RIGHT, LegendRange.IN);

  export const UP_RIGHT_IN_LINE = new Legend(
    LegendLayout.LINE, LegendPosition.UP_RIGHT, LegendRange.IN);

  // in & bottom
  export const BOTTOM_LEFT_IN_BLOCK = new Legend(
    LegendLayout.BLOCK, LegendPosition.BOTTOM_LEFT, LegendRange.IN);

  export const BOTTOM_LEFT_IN_LINE = new Legend(
    LegendLayout.LINE, LegendPosition.BOTTOM_LEFT, LegendRange.IN);

  export const BOTTOM_RIGHT_IN_BLOCK = new Legend(
    LegendLayout.BLOCK, LegendPosition.BOTTOM_RIGHT, LegendRange.IN);

  export const BOTTOM_RIGHT_IN_LINE = new Legend(
    LegendLayout.LINE, LegendPosition.BOTTOM_RIGHT, LegendRange.IN);

  export const UP_CENTER_IN_LINE = new Legend(
    LegendLayout.LINE, LegendPosition.UP_CENTER, LegendRange.IN);

  export const BOTTOM_CENTER_IN_LINE = new Legend(
    LegendLayout.LINE, LegendPosition.BOTTOM_CENTER, LegendRange.IN);

  // out & line
  export const UP_CENTER_OUT_LINE = new Legend(
    LegendLayout.LINE, LegendPosition.UP_CENTER, LegendRange.OUT);

  export const UP_LEFT_OUT_LINE = new Legend(
    LegendLayout.LINE, LegendPosition.UP_LEFT, LegendRange.OUT);

  export const UP_RIGHT_OUT_LINE = new Legend(
    LegendLayout.LINE, LegendPosition.UP_RIGHT, LegendRange.OUT);

  export const BOTTOM_CENTER_OUT_LINE = new Legend(
    LegendLayout.LINE, LegendPosition.BOTTOM_CENTER, LegendRange.OUT);

  // side & block
  export const UP_LEFT_SIDE_BLOCK = new Legend(
    LegendLayout.BLOCK, LegendPosition.UP_LEFT, LegendRange.SIDE);

  export const BOTTOM_LEFT_SIDE_BLOCK = new Legend(
    LegendLayout.BLOCK, LegendPosition.BOTTOM_LEFT, LegendRange.SIDE);

  export const UP_RIGHT_SIDE_BLOCK = new Legend(
    LegendLayout.BLOCK, LegendPosition.UP_RIGHT, LegendRange.SIDE);

  export const BOTTOM_RIGHT_SIDE_BLOCK = new Legend(
    LegendLayout.BLOCK, LegendPosition.BOTTOM_RIGHT, LegendRange.SIDE);
}
