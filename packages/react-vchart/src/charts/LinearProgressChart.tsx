import React from 'react';
import { ILinearProgressChartSpec, IVChartConstructor } from '@visactor/vchart';
import {
  VChart,
  registerLinearProgressChart,
  registerCartesianLinearAxis,
  registerCartesianBandAxis,
  registerCartesianTimeAxis, // 非必选
  registerCartesianLogAxis, // 非必选
  registerCartesianCrossHair,
  registerLabel
} from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

export interface LinearProgressChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data'>,
    Omit<ILinearProgressChartSpec, 'type'> {}

export const LinearProgressChart = createChart<
  React.PropsWithChildren<LinearProgressChartProps> & { type: 'linearProgress' }
>(
  'LinearProgressChart',
  {
    type: 'linearProgress',
    vchartConstrouctor: VChart as IVChartConstructor
  },
  [
    registerLinearProgressChart,
    registerCartesianLinearAxis,
    registerCartesianBandAxis,
    registerCartesianTimeAxis, // 非必选
    registerCartesianLogAxis, // 非必选
    registerCartesianCrossHair,
    registerLabel
  ]
);
