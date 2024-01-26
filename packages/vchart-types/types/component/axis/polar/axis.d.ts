import type { IBaseScale } from '@visactor/vscale';
import type { IPolarAxis, IPolarAxisCommonSpec } from './interface';
import type { IComponentOption } from '../../interface';
import { ComponentTypeEnum } from '../../interface/type';
import type { IPolarTickDataOpt } from '@visactor/vutils-extension';
import type { IPolarSeries } from '../../../series/interface';
import type { IPoint, IPolarOrientType, IPolarPoint, StringOrNumber, ILayoutType } from '../../../typings';
import type { Maybe } from '@visactor/vutils';
import type { IEffect, IModelSpecInfo } from '../../../model/interface';
import { AxisComponent } from '../base-axis';
import type { ITick } from '../interface';
export declare abstract class PolarAxis<T extends IPolarAxisCommonSpec = IPolarAxisCommonSpec> extends AxisComponent<T> implements IPolarAxis {
    static type: ComponentTypeEnum;
    type: ComponentTypeEnum;
    name: string;
    static specKey: string;
    protected readonly _defaultBandPosition = 0;
    protected readonly _defaultBandInnerPadding = 0;
    protected readonly _defaultBandOuterPadding = 0;
    layoutType: ILayoutType;
    layoutZIndex: number;
    protected _tick: ITick | undefined;
    protected _center: IPoint | null;
    get center(): IPoint;
    protected _startAngle: number;
    get startAngle(): number;
    protected _endAngle: number;
    get endAngle(): number;
    protected _orient: IPolarOrientType;
    getOrient(): IPolarOrientType;
    protected _groupScales: IBaseScale[];
    getGroupScales(): IBaseScale[];
    private _axisStyle;
    private _gridStyle;
    static getSpecInfo(chartSpec: any): Maybe<IModelSpecInfo[]>;
    static createComponent(specInfo: IModelSpecInfo, options: IComponentOption): IPolarAxis;
    constructor(spec: T, options: IComponentOption);
    effect: IEffect;
    setAttrFromSpec(): void;
    _transformLayoutPosition: (pos: Partial<IPoint>) => Partial<IPoint>;
    onLayoutEnd(ctx: any): void;
    onRender(ctx: any): void;
    changeRegions(): void;
    protected _tickTransformOption(): IPolarTickDataOpt;
    afterCompile(): void;
    protected updateScaleRange(): boolean;
    protected collectData(depth: number, rawData?: boolean): {
        min: number;
        max: number;
        values: any[];
    }[];
    protected abstract computeDomain(data: {
        min: number;
        max: number;
        values: any[];
    }[]): StringOrNumber[];
    protected updateSeriesScale(): void;
    protected getSeriesStatisticsField(s: IPolarSeries): string[];
    protected initGroupScales(): void;
    protected axisHelper(): {
        isContinuous: boolean;
        dataToPosition: (values: any[]) => number;
        coordToPoint: (point: IPolarPoint) => IPoint;
        pointToCoord: (point: IPoint) => IPolarPoint;
        center: () => IPoint;
        getScale: (depth: number) => IBaseScale;
        getAxisId: () => number;
        getSpec: () => T;
    };
    positionToData(position: IPoint): number;
    coordToPoint(point: IPolarPoint): IPoint;
    pointToCoord(point: IPoint): IPolarPoint;
    getCenter(): IPoint;
    getOuterRadius(): number;
    getInnerRadius(): number;
    updateLayoutAttribute(): void;
    protected _getNormalizedValue(values: any[], length: number): number;
    protected getLabelItems(length: number): any[];
    protected _getStartValue(): number;
    private _layoutAngleAxis;
    private _layoutRadiusAxis;
    protected _getRelatedAngleAxis(): IPolarAxis | undefined;
    private computeLayoutOuterRadius;
    private computeLayoutInnerRadius;
    private getRefLayoutRect;
    private getRefSeriesRadius;
    private _update;
    invert(value: number): number;
}
