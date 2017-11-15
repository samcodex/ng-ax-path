import * as d3 from 'd3';

export namespace d3_util {
  export function getRect(selector: d3.Selection<d3.BaseType, {}, null, undefined>): ClientRect {
    return (<Element>selector.node()).getBoundingClientRect();
  }

  export function createGroup(tag: string = 'g'): d3.Selection<d3.BaseType, {}, null, undefined> {
    return d3.select(document.createElementNS(d3.namespaces.svg, tag));
  }
}

