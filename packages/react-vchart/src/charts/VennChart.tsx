import type React from 'react';
import type { IVennChartSpec, IVChartConstructor } from '@visactor/vchart';
import { VChart, registerVennChart } from '@visactor/vchart';
import type { BaseChartProps } from './BaseChart';
import { createChart } from './BaseChart';
import { simpleComponentsRegisters } from './register';

export interface VennChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data'>,
    Omit<IVennChartSpec, 'type'> {}

export const VennChart = createChart<React.PropsWithChildren<VennChartProps> & { type: 'venn' }>(
  'VennChart',
  {
    type: 'venn',
    vchartConstrouctor: VChart as IVChartConstructor
  },
  [registerVennChart, ...simpleComponentsRegisters]
);
