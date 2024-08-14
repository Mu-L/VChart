import type React from 'react';
import type { IWaterfallChartSpec, IVChartConstructor } from '@visactor/vchart';
import { VChart, registerWaterfallChart, registerLabel, registerTotalLabel } from '@visactor/vchart';
import type { BaseChartProps } from './BaseChart';
import { createChart } from './BaseChart';
import { cartesianComponentsRegisters } from './register';

export interface WaterfallChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data'>,
    Omit<Partial<IWaterfallChartSpec>, 'type'> {
  //
}

export const WaterfallChart = createChart<React.PropsWithChildren<WaterfallChartProps> & { type?: 'waterfall' }>(
  'WaterfallChart',
  {
    type: 'waterfall',
    vchartConstrouctor: VChart as IVChartConstructor
  },
  [registerWaterfallChart, registerLabel, registerTotalLabel, ...cartesianComponentsRegisters]
);
