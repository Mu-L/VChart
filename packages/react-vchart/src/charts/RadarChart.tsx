import React from 'react';
import type { IRadarChartSpec, IVChartConstructor } from '@visactor/vchart';
import { VChart, registerRadarChart, registerLabel } from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';
import { polarComponentsRegisters } from './register';

export interface RadarChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data'>,
    Omit<IRadarChartSpec, 'type'> {}

export const RadarChart = createChart<React.PropsWithChildren<RadarChartProps> & { type: 'radar' }>(
  'RadarChart',
  {
    type: 'radar',
    vchartConstrouctor: VChart as IVChartConstructor
  },
  [registerRadarChart, registerLabel, ...polarComponentsRegisters]
);
