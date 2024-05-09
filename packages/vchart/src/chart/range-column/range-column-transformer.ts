import { Direction } from '../../typings';
import { CartesianChartSpecTransformer } from '../cartesian';
import { setDefaultCrosshairForCartesianChart } from '../util';
import type { IRangeColumnChartSpec } from './interface';

export class RangeColumnChartSpecTransformer<
  T extends IRangeColumnChartSpec = IRangeColumnChartSpec
> extends CartesianChartSpecTransformer<T> {
  protected _getDefaultSeriesSpec(spec: T): any {
    const series: any = {
      ...super._getDefaultSeriesSpec(spec),
      barWidth: (spec as IRangeColumnChartSpec).barWidth,
      barMaxWidth: (spec as IRangeColumnChartSpec).barMaxWidth,
      barMinWidth: (spec as IRangeColumnChartSpec).barMinWidth,
      barGapInGroup: (spec as IRangeColumnChartSpec).barGapInGroup,
      barBackground: (spec as IRangeColumnChartSpec).barBackground,
      barMinHeight: (spec as IRangeColumnChartSpec).barMinHeight,
      stackCornerRadius: (spec as IRangeColumnChartSpec).stackCornerRadius
    };
    series.bar = spec.bar;
    if (spec.direction === Direction.horizontal) {
      series.xField = spec.xField ?? [spec.minField, spec.maxField];
    } else {
      series.yField = spec.yField ?? [spec.minField, spec.maxField];
    }
    return series;
  }

  transformSpec(spec: T): void {
    super.transformSpec(spec);
    setDefaultCrosshairForCartesianChart(spec);
  }
}
