import React from 'react';
import { ICorrelationChartSpec, IVChartConstructor } from '@visactor/vchart';
import { VChart, registerCorrelationChart } from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

export interface CorrelationChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data'>,
    Omit<ICorrelationChartSpec, 'type'> {}

export const CorrelationChart = createChart<React.PropsWithChildren<CorrelationChartProps> & { type: 'correlation' }>(
  'CorrelationChart',
  {
    type: 'correlation',
    vchartConstrouctor: VChart as IVChartConstructor
  },
  [registerCorrelationChart]
);
