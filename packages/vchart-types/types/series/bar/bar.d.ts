import type { IBaseScale } from '@visactor/vscale';
import { CartesianSeries } from '../cartesian/cartesian';
import type { IMark } from '../../mark/interface';
import { MarkTypeEnum } from '../../mark/interface/type';
import type { Datum, DirectionType } from '../../typings';
import type { IBarSeriesSpec } from './interface';
import type { IAxisHelper } from '../../component/axis/cartesian/interface';
import type { IRectMark } from '../../mark/rect';
import type { IModelInitOption } from '../../model/interface';
import type { ITextMark } from '../../mark/text';
import type { SeriesMarkMap } from '../interface';
import { SeriesMarkNameEnum, SeriesTypeEnum } from '../interface/type';
import { SeriesData } from '../base/series-data';
import { DataView } from '@visactor/vdataset';
import { BarSeriesSpecTransformer } from './bar-transformer';
export declare const DefaultBandWidth = 6;
export declare class BarSeries<T extends IBarSeriesSpec = IBarSeriesSpec> extends CartesianSeries<T> {
    static readonly type: string;
    type: SeriesTypeEnum;
    protected _barMarkName: SeriesMarkNameEnum;
    protected _barMarkType: MarkTypeEnum;
    static readonly mark: SeriesMarkMap;
    static readonly transformerConstructor: any;
    readonly transformerConstructor: typeof BarSeriesSpecTransformer;
    protected _bandPosition: number;
    protected _barMark: IRectMark;
    protected _barBackgroundMark: IRectMark;
    protected _barBackgroundViewData: SeriesData;
    initMark(): void;
    protected _initBarBackgroundMark(): void;
    initMarkStyle(): void;
    initLabelMarkStyle(textMark: ITextMark): void;
    protected initTooltip(): void;
    protected _statisticViewData(): void;
    init(option: IModelInitOption): void;
    private _shouldDoPreCalculate;
    private _calculateStackRectPosition;
    private _calculateRectPosition;
    protected _dataToPosX(datum: Datum): number;
    protected _dataToPosX1(datum: Datum): number;
    protected _dataToPosY(datum: Datum): number;
    protected _dataToPosY1(datum: Datum): number;
    protected _getBarXStart: (datum: Datum, scale: IBaseScale) => any;
    protected _getBarXEnd: (datum: Datum, scale: IBaseScale) => any;
    protected _getBarYStart: (datum: Datum, scale: IBaseScale) => any;
    protected _getBarYEnd: (datum: Datum, scale: IBaseScale) => any;
    initBandRectMarkStyle(): void;
    protected _initStackBarMarkStyle(): void;
    initLinearRectMarkStyle(): void;
    protected _getBarBackgroundXStart: (scale: IBaseScale) => number;
    protected _getBarBackgroundXEnd: (scale: IBaseScale) => number;
    protected _getBarBackgroundYStart: (scale: IBaseScale) => number;
    protected _getBarBackgroundYEnd: (scale: IBaseScale) => number;
    protected _initBandBarBackgroundMarkStyle(): void;
    initAnimation(): void;
    protected _getBarWidth(axisHelper: IAxisHelper, scaleDepth?: number): number;
    protected _getPosition(direction: DirectionType, datum: Datum, scaleDepth?: number, mark?: SeriesMarkNameEnum): number;
    protected _barBackgroundPositionXEncoder?: (datum: Datum) => number;
    protected _getBarBackgroundPositionXEncoder: () => (datum: Datum) => number;
    protected _setBarBackgroundPositionXEncoder: (encoder: (datum: Datum) => number) => void;
    dataToBarBackgroundPositionX(datum: Datum, scaleDepth?: number): number;
    protected _barBackgroundPositionYEncoder?: (datum: Datum) => number;
    protected _getBarBackgroundPositionYEncoder: () => (datum: Datum) => number;
    protected _setBarBackgroundPositionYEncoder: (encoder: (datum: Datum) => number) => void;
    dataToBarBackgroundPositionY(datum: Datum, scaleDepth?: number): number;
    onLayoutEnd(ctx: any): void;
    compile(): void;
    getDefaultShapeType(): string;
    getActiveMarks(): IMark[];
    compileData(): void;
    fillData(): void;
    viewDataUpdate(d: DataView): void;
    release(): void;
}
export declare const registerBarSeries: () => void;
