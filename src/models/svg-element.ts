import * as d3 from 'd3';
import { d3_util } from './d3.util';

export abstract class SvgElement {
  protected parent: SvgElement;
  protected children: SvgElement[] = new Array<SvgElement>();
  protected attrs: {[key: string]: any} = {};
  protected styles: {[key: string]: any} = {};
  public group: d3.Selection<d3.BaseType, {}, null, undefined>;

  constructor(
    public name: string = ''
  ) {
    this.group = d3_util.createGroup();
  }

  setAttr(name: string, value: any) {
    this.attrs[name] = value;
    return this;
  }

  delAttr(name: string) {
    delete this.attrs[name];
  }

  setStyle(name: string, value: any) {
    this.styles[name] = value;
    return this;
  }

  getStyle(name: string): any {
    return this.styles[name];
  }

  delStyle(name: string) {
    delete this.styles[name];
  }

  protected addChild(child: SvgElement): SvgElement {
    if (child) {
      child.parent = this;
      this.children.push(child);
    }

    return this;
  }

  abstract buildGroup(): void;

  applyStyle() {
    Object.keys(this.styles).forEach(k => this.group.style(k, this.styles[k]));
    Object.keys(this.attrs).forEach(k => this.group.attr(k, this.attrs[k]));
  }

  clearAll() {
    this.group.selectAll('*').remove();
    this.group.remove();
  }

  clear() {
    this.group.selectAll('*').remove();
  }
}

export type RectangleSize = {
  left?: number,
  top?: number,
  right?: number,
  bottom?: number,
  width?: number,
  height?: number
};

export const Rect: {left: Function, top: Function, right: Function, bottom: Function, width: Function, height: Function} = {
  left: (o: RectangleSize) => o ? o.left || 0 : 0,
  top: (o: RectangleSize) => o ? o.top || 0 : 0,
  right: (o: RectangleSize) => o ? o.right || 0 : 0,
  bottom: (o: RectangleSize) => o ? o.bottom || 0 : 0,
  width: (o: RectangleSize) => o ? o.width || 0 : 0,
  height: (o: RectangleSize) => o ? o.height || 0 : 0
};
