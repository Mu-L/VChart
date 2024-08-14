import type React from 'react';
import type { IRoseChartSpec, IVChartConstructor } from '@visactor/vchart';
import { VChart, registerRoseChart, registerLabel } from '@visactor/vchart';
import type { BaseChartProps } from './BaseChart';
import { createChart } from './BaseChart';
import { polarComponentsRegisters } from './register';

export interface RoseChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data'>,
    Omit<Partial<IRoseChartSpec>, 'type'> {}

export const RoseChart = createChart<React.PropsWithChildren<RoseChartProps> & { type?: 'rose' }>(
  'RoseChart',
  {
    type: 'rose',
    vchartConstrouctor: VChart as IVChartConstructor
  },
  [registerRoseChart, registerLabel, ...polarComponentsRegisters]
);
