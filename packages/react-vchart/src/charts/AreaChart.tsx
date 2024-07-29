import type React from 'react';
import type { IAreaChartSpec, IVChartConstructor } from '@visactor/vchart';
import { VChart, registerAreaChart, registerLabel, registerTotalLabel } from '@visactor/vchart';
import type { BaseChartProps } from './BaseChart';
import { createChart } from './BaseChart';
import { cartesianComponentsRegisters } from './register';

export interface AreaChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data'>,
    Omit<IAreaChartSpec, 'type'> {}

export const AreaChart = createChart<React.PropsWithChildren<AreaChartProps> & { type: 'area' }>(
  'AreaChart',
  {
    type: 'area',
    vchartConstrouctor: VChart as IVChartConstructor
  },
  [registerAreaChart, registerLabel, registerTotalLabel, ...cartesianComponentsRegisters]
);
