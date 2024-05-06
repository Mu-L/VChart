import type { IEvent } from '../../event/interface';
import type { LayoutCallBack } from '../../layout/interface';
import type { IView } from '@visactor/vgrammar-core';
import type { IParserOptions } from '@visactor/vdataset';
import type { IComponent, IComponentConstructor } from '../../component/interface';
import type { IMark } from '../../mark/interface';
import type { IModel, IModelConstructor, IModelSpecInfo, IUpdateSpecResult } from '../../model/interface';
import type { IRegion, IRegionConstructor } from '../../region/interface';
import type { ISeries, ISeriesConstructor } from '../../series/interface';
import type { IChartEvaluateOption, IChartLayoutOption, IChartOption, IChartRenderOption, IChartSpecInfo, IChartSpecTransformerOption, ILayoutParams } from './common';
import type { IBoundsLike, IPadding } from '@visactor/vutils';
import type { ICompilable } from '../../compile/interface';
import type { IRegionQuerier, MaybeArray, Datum, IMarkStateSpec, StringOrNumber, IShowTooltipOption, IDataValues, ILayoutRect, IData } from '../../typings';
import type { DataView } from '@visactor/vdataset';
import type { IGlobalScale } from '../../scale/interface';
import type { IMorphConfig } from '../../animation/spec';
export type DimensionIndexOption = {
    filter?: (cmp: IComponent) => boolean;
    tooltip?: boolean;
    showTooltipOption?: IShowTooltipOption;
    crosshair?: boolean;
};
export interface IChartData {
    parseData: (dataSpec: IData) => void;
    updateData: (dataSpec: IData, fullUp?: boolean, forceMerge?: boolean) => boolean;
    getSeriesData: (id: StringOrNumber | undefined, index: number | undefined) => DataView | undefined;
}
export interface IChart extends ICompilable {
    padding: IPadding;
    readonly type: string;
    readonly chartData: IChartData;
    readonly transformerConstructor: new (option: IChartSpecTransformerOption) => IChartSpecTransformer;
    getSpec: () => any;
    setSpec: (s: any) => void;
    reDataFlow: () => void;
    setCanvasRect: (width: number, height: number) => void;
    getCanvasRect: () => ILayoutRect;
    getViewRect: () => ILayoutRect;
    getOption: () => IChartOption;
    getEvent: () => IEvent;
    getGlobalScale: () => IGlobalScale;
    setLayout: (layout: LayoutCallBack) => void;
    layout: (context: ILayoutParams) => void;
    getLayoutTag: () => boolean;
    setLayoutTag: (tag: boolean, morphConfig?: IMorphConfig, renderNextTick?: boolean) => boolean;
    updateData: (id: StringOrNumber, data: unknown, updateGlobalScale?: boolean, options?: IParserOptions) => void;
    updateFullData: (data: IDataValues | IDataValues[]) => void;
    updateGlobalScaleDomain: () => void;
    created: () => void;
    init: () => void;
    onLayoutStart: (ctx: IChartLayoutOption) => void;
    onLayoutEnd: (ctx: IChartLayoutOption) => void;
    onEvaluateEnd: (ctx: IChartEvaluateOption) => void;
    onRender: (ctx: IChartRenderOption) => void;
    onResize: (width: number, height: number, reRender: boolean) => void;
    onLayout: (view: IView) => void;
    getAllSeries: () => ISeries[];
    getRegionsInIndex: (index?: number[]) => IRegion[];
    getRegionsInIds: (ids: number[]) => IRegion[];
    getAllRegions: () => IRegion[];
    getRegionsInUserIdOrIndex: (user_ids?: StringOrNumber[], index?: number[]) => IRegion[];
    getRegionsInQuerier: (query: MaybeArray<IRegionQuerier>) => IRegion[];
    getSeriesInIndex: (index?: number[]) => ISeries[];
    getSeriesInIds: (ids?: number[]) => ISeries[];
    getSeriesInUserIdOrIndex: (user_ids?: StringOrNumber[], index?: number[]) => ISeries[];
    getSeriesInUserId: (userId: StringOrNumber) => ISeries | undefined;
    getComponentByIndex: (key: string, index: number) => IComponent | undefined;
    getComponentByUserId: (userId: StringOrNumber) => IComponent | undefined;
    getComponentsByKey: (key: string) => IComponent[];
    getComponentsByType: (type: string) => IComponent[];
    getAllComponents: () => IComponent[];
    getModelById: (id: number) => IModel | undefined;
    getModelByUserId: (userId: StringOrNumber) => IModel | undefined;
    getModelInFilter: (filter: string | {
        type: string;
        index: number;
    } | ((model: IModel) => boolean)) => IModel | undefined;
    getAllModels: () => IModel[];
    getMarkById: (id: number) => IMark | undefined;
    getAllMarks: () => IMark[];
    updateSpec: (spec: any) => IUpdateSpecResult;
    updateState: (state: Record<string, Omit<IMarkStateSpec<unknown>, 'style'>>, filter?: (series: ISeries, mark: IMark, stateKey: string) => boolean) => void;
    setSelected: (datum: MaybeArray<any> | null, filter?: (series: ISeries, mark: IMark) => boolean, region?: IRegionQuerier) => void;
    setHovered: (datum: MaybeArray<Datum> | null, filter?: (series: ISeries, mark: IMark) => boolean, region?: IRegionQuerier) => void;
    updateViewBox: (viewBox: IBoundsLike, reLayout: boolean) => void;
    getCanvas: () => HTMLCanvasElement | undefined;
    setCurrentTheme: () => void;
    getSeriesData: (id: StringOrNumber | undefined, index: number | undefined) => DataView | undefined;
    setDimensionIndex: (value: StringOrNumber, opt: DimensionIndexOption) => void;
}
export interface IChartSpecTransformer {
    readonly type: string;
    readonly seriesType: string;
    initChartSpec: (spec: any) => IChartSpecInfo;
    transformSpec: (spec: any) => void;
    transformModelSpec: (spec: any) => IChartSpecInfo;
    createSpecInfo: (chartSpec: any, transform?: (constructor: IModelConstructor, specInfo: IModelSpecInfo, chartSpecInfo?: IChartSpecInfo) => void) => IChartSpecInfo;
    forEachRegionInSpec: <K>(spec: any, callbackfn: (constructor: IRegionConstructor, specInfo: IModelSpecInfo, chartSpecInfo?: IChartSpecInfo) => K, chartSpecInfo?: IChartSpecInfo) => K[];
    forEachSeriesInSpec: <K>(spec: any, callbackfn: (constructor: ISeriesConstructor, specInfo: IModelSpecInfo, chartSpecInfo?: IChartSpecInfo) => K, chartSpecInfo?: IChartSpecInfo) => K[];
    forEachComponentInSpec: <K>(spec: any, callbackfn: (constructor: IComponentConstructor, specInfo: IModelSpecInfo, chartSpecInfo?: IChartSpecInfo) => K, chartSpecInfo?: IChartSpecInfo) => K[];
}
export interface IChartConstructor {
    readonly type: string;
    readonly seriesType?: string;
    readonly series?: string | string[];
    readonly view: string;
    readonly transformerConstructor: new (option: IChartSpecTransformerOption) => IChartSpecTransformer;
    new (spec: any, options: IChartOption): IChart;
}
