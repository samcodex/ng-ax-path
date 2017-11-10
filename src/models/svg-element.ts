import * as d3 from 'd3';

export abstract class SvgElement {
  protected parent: SvgElement;
  protected children: SvgElement[] = new Array<SvgElement>();
  protected attrs: {[key: string]: any} = {};
  protected styles: {[key: string]: any} = {};
  protected group: d3.Selection<d3.BaseType, {}, Element, {}>;

  constructor(
    public name?: string
  ) {}

  attr(name: string, value: any) {
    this.attrs[name] = value;
    return this;
  }

  delAttr(name: string) {
    delete this.attrs[name];
  }

  style(name: string, value: any) {
    this.styles[name] = value;
    return this;
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

  abstract appendTo(host: d3.Selection<d3.BaseType, {}, Element, {}>): SvgElement;

  applyStyle() {
    if (this.group) {
      Object.keys(this.styles).forEach(k => this.group.style(k, this.styles[k]));
      Object.keys(this.attrs).forEach(k => this.group.attr(k, this.attrs[k]));
    }
  }

  remove() {
    if (this.group) {
      this.group.remove();
    }
  }
}

export type PositionSize = {
  left: number,
  top: number,
  right: number,
  bottom: number
};

export type RectangleSize = {
  width: number,
  height: number
};
