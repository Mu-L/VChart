/* eslint-disable no-duplicate-imports */
/**
 * @description export all mark modules
 */
import { WaterfallSeries, registerWaterfallSeries } from './waterfall/waterfall';
import type { IWaterfallSeriesSpec } from './waterfall/interface';
import { BoxPlotSeries, registerBoxplotSeries } from './box-plot/box-plot';
import type { IBoxPlotSeriesSpec } from './box-plot/interface';
import { LineSeries, registerLineSeries } from './line/line';
import type { ILineSeriesSpec } from './line/interface';
import { BarSeries, registerBarSeries } from './bar/bar';
import { Bar3dSeries, registerBar3dSeries } from './bar/bar-3d';
import type { IBar3dSeriesSpec, IBarSeriesSpec } from './bar/interface';
import { RangeColumnSeries, registerRangeColumnSeries } from './range-column/range-column';
import { RangeColumn3dSeries, registerRangeColumn3dSeries } from './range-column/3d/range-column-3d';
import type { IRangeColumn3dSeriesSpec, IRangeColumnSeriesSpec } from './range-column/interface';
import { RangeAreaSeries, registerRangeAreaSeries } from './range-area/range-area';
import type { IRangeAreaSeriesSpec } from './range-area/interface';
import { MapSeries, registerMapSeries } from './map/map';
import type { IMapSeriesSpec } from './map/interface';
import { PieSeries, registerPieSeries } from './pie/pie';
import { Pie3dSeries, registerPie3dSeries } from './pie/3d/pie-3d';
import type { IPie3dSeriesSpec } from './pie/interface';
import type { IPieSeriesSpec } from './pie/interface';
import { ScatterSeries, registerScatterSeries } from './scatter/scatter';
import type { IScatterSeriesSpec } from './scatter/interface';
import { RoseSeries, registerRoseSeries } from './rose/rose';
import type { IRoseSeriesSpec } from './rose/interface';
import { RadarSeries, registerRadarSeries } from './radar/radar';
import type { IRadarSeriesSpec } from './radar/interface';
import { AreaSeries, registerAreaSeries } from './area/area';
import type { IAreaSeriesSpec } from './area/interface';
import { DotSeries, registerDotSeries } from './dot/dot';
import type { IDotSeriesSpec } from './dot/interface';
import { LinkSeries, registerLinkSeries } from './link/link';
import type { ILinkSeriesSpec } from './link/interface';
import { CircularProgressSeries, registerCircularProgressSeries } from './progress/circular/circular';
import type { ICircularProgressSeriesSpec } from './progress/circular/interface';
import { LinearProgressSeries, registerLinearProgressSeries } from './progress/linear/linear';
import type { ILinearProgressSeriesSpec } from './progress/linear/interface';
import { WordCloudSeries, registerWordCloudSeries } from './word-cloud/word-cloud';
import { WordCloud3dSeries, registerWordCloud3dSeries } from './word-cloud/word-cloud-3d';
import type { IWordCloud3dSeriesSpec, IWordCloudSeriesSpec } from './word-cloud/interface';
import { FunnelSeries, registerFunnelSeries } from './funnel/funnel';
import { Funnel3dSeries, registerFunnel3dSeries } from './funnel/3d/funnel-3d';
import type { IFunnel3dSeriesSpec, IFunnelSeriesSpec } from './funnel/interface';
import { SunburstSeries, registerSunBurstSeries } from './sunburst/sunburst';
import type { ISunburstSeriesSpec } from './sunburst/interface';
import { CirclePackingSeries, registerCirclePackingSeries } from './circle-packing/circle-packing';
import type { ICirclePackingSeriesSpec } from './circle-packing/interface';
import { SankeySeries, registerSankeySeries } from './sankey/sankey';
import type { ISankeySeriesSpec } from './sankey/interface';
import { TreemapSeries, registerTreemapSeries } from './treemap/treemap';
import type { ITreemapSeriesSpec } from './treemap/interface';
import type { IGaugePointerSeriesSpec, IGaugeSeriesSpec } from './gauge';
import { GaugePointerSeries, GaugeSeries, registerGaugePointerSeries, registerGaugeSeries } from './gauge';
import { HeatmapSeries, registerHeatmapSeries } from './heatmap/heatmap';
import type { IHeatmapSeriesSpec } from './heatmap/interface';
import { CorrelationSeries } from './correlation/correlation';
import type { ICorrelationSeriesSpec } from './correlation/interface';
import { BaseSeries } from './base/base-series';
import type { ICartesianSeriesSpec } from './cartesian';
import { CartesianSeries } from './cartesian';
import { PolarSeries } from './polar/polar';
import type { IPolarSeriesSpec } from './polar/interface';
import type { IProgressLikeSeriesSpec } from './polar/progress-like';
import { ProgressLikeSeries } from './polar/progress-like';
import type { IRoseLikeSeriesSpec } from './polar/rose-like';
import { RoseLikeSeries } from './polar/rose-like';

import type { ISeries, ICartesianSeries, IPolarSeries, IGeoSeries } from './interface';

export {
  WaterfallSeries,
  Bar3dSeries,
  BarSeries,
  BoxPlotSeries,
  LineSeries,
  RadarSeries,
  RangeAreaSeries,
  RangeColumn3dSeries,
  RangeColumnSeries,
  MapSeries,
  Pie3dSeries,
  PieSeries,
  SankeySeries,
  ScatterSeries,
  SunburstSeries,
  RoseLikeSeries,
  RoseSeries,
  AreaSeries,
  DotSeries,
  LinearProgressSeries,
  LinkSeries,
  CirclePackingSeries,
  CircularProgressSeries,
  WordCloud3dSeries,
  WordCloudSeries,
  Funnel3dSeries,
  FunnelSeries,
  TreemapSeries,
  GaugePointerSeries,
  GaugeSeries,
  HeatmapSeries,
  BaseSeries,
  CartesianSeries,
  PolarSeries,
  ProgressLikeSeries,
  CorrelationSeries
};

export {
  registerAreaSeries,
  registerBar3dSeries,
  registerBarSeries,
  registerBoxplotSeries,
  registerCirclePackingSeries,
  registerCircularProgressSeries,
  registerDotSeries,
  registerFunnel3dSeries,
  registerFunnelSeries,
  registerGaugePointerSeries,
  registerGaugeSeries,
  registerHeatmapSeries,
  registerLineSeries,
  registerLinearProgressSeries,
  registerLinkSeries,
  registerMapSeries,
  registerPie3dSeries,
  registerPieSeries,
  registerRadarSeries,
  registerRangeAreaSeries,
  registerRangeColumn3dSeries,
  registerRangeColumnSeries,
  registerRoseSeries,
  registerSankeySeries,
  registerScatterSeries,
  registerSunBurstSeries,
  registerTreemapSeries,
  registerWaterfallSeries,
  registerWordCloud3dSeries,
  registerWordCloudSeries
};

export type {
  ISeries,
  ICartesianSeries,
  IPolarSeries,
  IGeoSeries,
  IRoseLikeSeriesSpec,
  IAreaSeriesSpec,
  IBar3dSeriesSpec,
  IBarSeriesSpec,
  IBoxPlotSeriesSpec,
  ICartesianSeriesSpec,
  ICirclePackingSeriesSpec,
  ICircularProgressSeriesSpec,
  IDotSeriesSpec,
  IFunnel3dSeriesSpec,
  IFunnelSeriesSpec,
  IGaugePointerSeriesSpec,
  IGaugeSeriesSpec,
  IHeatmapSeriesSpec,
  ILineSeriesSpec,
  ILinearProgressSeriesSpec,
  ILinkSeriesSpec,
  IMapSeriesSpec,
  IPie3dSeriesSpec,
  IPieSeriesSpec,
  IPolarSeriesSpec,
  IProgressLikeSeriesSpec,
  IRadarSeriesSpec,
  IRangeAreaSeriesSpec,
  IRangeColumn3dSeriesSpec,
  IRangeColumnSeriesSpec,
  IRoseSeriesSpec,
  ISankeySeriesSpec,
  IScatterSeriesSpec,
  ISunburstSeriesSpec,
  ITreemapSeriesSpec,
  IWaterfallSeriesSpec,
  IWordCloud3dSeriesSpec,
  IWordCloudSeriesSpec,
  ICorrelationSeriesSpec
};

export * from './interface';
