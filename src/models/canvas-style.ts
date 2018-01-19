import { AxisOptions } from './axis';
import { CanvasOptions } from './canvas';

export interface StyleOptions {
  CanvasOptions: CanvasOptions;
  AxisOptions: AxisOptions;
}

export enum CanvasStyle {
  Coordinate = 'Coordinate',
  CanvasBoard = 'CanvasBoard'
}

export const CanvasStyles: {
  Coordinate: StyleOptions,
  CanvasBoard: StyleOptions
} = {
  Coordinate: {
    CanvasOptions: {
      hasTitle: true,
      hasLegend: true
    },
    AxisOptions: {
      tickInterval: 0,
      extraSpace: 0,
      disableAxisTitle: false,
      disableAxisLine: false,
      disableTickLine: false,
      disableTickMark: false,
      disableTickNumber: false,
    }
  },
  CanvasBoard: {
    CanvasOptions: {
      hasTitle: false,
      hasLegend: false
    },
    AxisOptions: {
      tickInterval: 0,
      extraSpace: 0,
      disableAxisTitle: true,
      disableAxisLine: true,
      disableTickLine: false,
      disableTickMark: true,
      disableTickNumber: true,
    }
  }
};
