import type { VChart, IChartSpec, IMarkPointSpec, MarkPoint } from '@visactor/vchart';
import type { FlickerAction } from '../../types/Flicker';
import { CreateMarkPointAction } from '../../types/CreateComponent';
import { getComponentById } from '../../../util/vchart-api';
import { flickerEffect } from '../../utils/flicker';

export const createMarkPointProcessor = async (
  chartInstance: VChart,
  spec: IChartSpec,
  createMarkPointAction: CreateMarkPointAction
) => {
  const action = createMarkPointAction;
  const markPoint: IMarkPointSpec[] = (spec as any).markPoint ?? [];
  markPoint.push({
    id: action.elementId,
    coordinate: action.data,
    itemContent: action.payload.itemContent,
    itemLine: action.payload.itemLine
  });
  (spec as any).markPoint = markPoint;
  chartInstance.updateSpecSync(spec);
};

export const markPointFlickerProcessor = async (chartInstance: VChart, spec: any, markPointAction: FlickerAction) => {
  const { elementId } = markPointAction;
  const vchartMarkPoint = getComponentById(chartInstance, elementId) as MarkPoint;
  if (vchartMarkPoint && vchartMarkPoint._markerComponent) {
    const marker = vchartMarkPoint._markerComponent._item;
    if (marker) {
      flickerEffect(marker);
    }
  }
};
