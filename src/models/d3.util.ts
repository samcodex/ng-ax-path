import * as d3 from 'd3';

export namespace d3_util {
  export function getRect(selector: d3.Selection<d3.BaseType, {}, null, undefined>): ClientRect {
    return (<Element>selector.node()).getBoundingClientRect();
  }

  export function createGroup(tag: string = 'g'): d3.Selection<d3.BaseType, {}, null, undefined> {
    return d3.select(document.createElementNS(d3.namespaces.svg, tag));
  }

  export function createEqTriangle(sideLength: number, centerPosition: [number, number]):
    [[number, number], [number, number], [number, number]] {
      const pi = 3.141592653589793238462643383;
      const halfSide = sideLength / 2;
      const innerHypotenuse = halfSide * (1 / Math.cos(30 * pi / 180));
      const innerOpposite = halfSide * (1 / Math.tan(60 * pi / 180));
      const left: [number, number] = [centerPosition[0] - halfSide, centerPosition[1] + innerOpposite];
      const right: [number, number] = [centerPosition[0] + halfSide, centerPosition[1] + innerOpposite];
      const top: [number, number] = [centerPosition[0], centerPosition[1] - innerHypotenuse];

      return [top, left, right];
    }
}

