import React from 'react';
import type { ILineChartSpec, IVChartConstructor } from '@visactor/vchart';
import {
  VChart,
  registerLineChart,
  registerCartesianLinearAxis,
  registerCartesianBandAxis,
  registerCartesianTimeAxis, // 非必选
  registerCartesianLogAxis, // 非必选
  registerCartesianCrossHair,
  registerLabel,
  registerTotalLabel
} from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

VChart.useRegisters([
  registerLineChart,
  registerCartesianLinearAxis,
  registerCartesianBandAxis,
  registerCartesianTimeAxis, // 非必选
  registerCartesianLogAxis, // 非必选
  registerCartesianCrossHair,
  registerLabel,
  registerTotalLabel
]);

export interface LineChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data'>,
    Omit<ILineChartSpec, 'type'> {}

export const LineChart = createChart<React.PropsWithChildren<LineChartProps> & { type: 'line' }>('LineChart', {
  type: 'line',
  vchartConstrouctor: VChart as IVChartConstructor
});
