import type { PanEventParam, ZoomEventParam } from '../../event/interface';
import type { IModel } from '../../model/interface';
import type { DataSet, DataView, ITransformOptions } from '@visactor/vdataset';
import type { IMark } from '../../mark/interface';
import type { CoordinateType, IPoint, IPolarPoint } from '../../typings/coordinate';
import type { IRegion } from '../../region/interface';
import type { IBaseScale } from '@visactor/vscale';
import type { IAxisHelper } from '../../component/axis/cartesian/interface';
import type { IPolarAxisHelper } from '../../component/axis/polar/interface';
import type { ISeriesSeriesInfo, ISeriesSpecInfo, ISeriesStackData } from './common';
import type { ISeriesTooltipHelper } from './tooltip-helper';
import type { IInvalidType, Datum, DirectionType, IGroup, StringOrNumber } from '../../typings';
import type { ISeriesMarkAttributeContext, StateValueType } from '../../compile/mark';
import type { StatisticOperations } from '../../data/transforms/dimension-statistics';
import type { IGroupMark } from '../../mark/group';
import type { IGeoCoordinateHelper } from '../../component/geo/interface';
import type { ILabelMark } from '../../mark/label';
export interface ISeries extends IModel {
    readonly type: string;
    readonly name?: string;
    tooltipHelper: ISeriesTooltipHelper;
    getSpec: () => any;
    readonly coordinate: CoordinateType;
    onLayoutEnd: (ctx: any) => void;
    getRawData: () => DataView | undefined;
    getViewDataFilter: () => DataView | undefined;
    getViewData: () => DataView | undefined;
    getViewDataProductId: () => string | undefined;
    getRawDataStatisticsByField: (field: string, isNumeric?: boolean) => {
        values?: any[];
        min?: number;
        max?: number;
    };
    getViewDataStatistics?: () => DataView | undefined;
    getDataSet?: () => DataSet;
    getFieldAlias: (field: string) => string;
    updateRawData: (d: any) => void;
    setData?: (dv: DataView) => void;
    rawDataUpdate: (d: DataView) => void;
    viewDataUpdate: (d: DataView) => void;
    viewDataStatisticsUpdate: (d: DataView) => void;
    addViewDataFilter: (option: ITransformOptions) => void;
    reFilterViewData: () => void;
    reTransformViewData: () => void;
    fillData: () => void;
    getRegion: () => IRegion;
    initMark: () => void;
    getMarks: () => IMark[];
    getMarksWithoutRoot: () => IMark[];
    getMarkNameMap: () => Record<string, IMark>;
    getMarksInType: (type: string | string[]) => IMark[];
    getMarkInName: (name: string) => IMark | undefined;
    getMarkInId: (id: number) => IMark | undefined;
    getRootMark: () => IGroupMark;
    getActiveMarks: () => IMark[];
    getStackData: () => ISeriesStackData;
    getStack: () => boolean;
    getStackValue: () => StringOrNumber | undefined;
    getPercent: () => boolean;
    getStackOffsetSilhouette: () => boolean;
    getStackValueField: () => string;
    setValueFieldToStack: () => void;
    setValueFieldToPercent: () => void;
    setValueFieldToStackOffsetSilhouette: () => void;
    getStackGroupFields: () => string[];
    getSeriesField: () => string | undefined;
    getSeriesKeys: () => string[];
    getSeriesStyle: (datum: Datum) => ISeriesSeriesInfo['style'];
    getSeriesInfoInField: (field: string) => ISeriesSeriesInfo[];
    getSeriesInfoList: () => ISeriesSeriesInfo[];
    getGroups: () => IGroup | undefined;
    getDimensionField: () => string[];
    getMeasureField: () => string[];
    getStatisticFields: () => {
        key: string;
        operations: StatisticOperations;
    }[];
    setSeriesField: (field: string) => void;
    handleZoom?: (e: ZoomEventParam) => void;
    handlePan?: (e: PanEventParam) => void;
    dataToPosition: (datum: Datum, checkInViewData?: boolean) => IPoint | null;
    dataToPositionX: (datum: Datum) => number | null;
    dataToPositionY: (datum: Datum) => number | null;
    dataToPositionZ?: (datum: Datum) => number | null;
    valueToPosition: (value1: any, value2?: any) => IPoint;
    getColorAttribute: () => {
        scale: IBaseScale;
        field: string;
    };
    getDefaultColorDomain: () => any[];
    getInvalidType: () => IInvalidType;
    getDefaultShapeType: () => string;
    initLabelMarkStyle?: (labelMark: ILabelMark) => void;
    getGroupFields: () => string[];
    getSpecInfo: () => ISeriesSpecInfo;
    getMarkAttributeContext: () => ISeriesMarkAttributeContext;
}
export interface ICartesianSeries extends ISeries {
    readonly coordinate: 'cartesian';
    readonly direction: DirectionType;
    scaleX: IBaseScale;
    setScaleX: (s: IBaseScale) => void;
    scaleY: IBaseScale;
    setScaleY: (s: IBaseScale) => void;
    scaleZ?: IBaseScale;
    setScaleZ: (s: IBaseScale) => void;
    fieldX: string[];
    setFieldX: (field: string | string[], level?: number) => void;
    fieldX2: string;
    setFieldX2: (field: string) => void;
    fieldY: string[];
    setFieldY: (field: string | string[], level?: number) => void;
    fieldY2: string;
    setFieldY2: (field: string) => void;
    fieldZ?: string[];
    setFieldZ: (field: string | string[], level?: number) => void;
    positionToData: (p: IPoint) => any | null;
    positionToDataX: (xPos: number) => any | null;
    positionToDataY: (yPos: number) => any | null;
    getXAxisHelper: () => IAxisHelper;
    setXAxisHelper: (h: IAxisHelper) => void;
    getYAxisHelper: () => IAxisHelper;
    setYAxisHelper: (h: IAxisHelper) => void;
    getZAxisHelper: () => IAxisHelper | undefined;
    setZAxisHelper: (h: IAxisHelper) => void;
    dataToPositionX1: (datum: Datum) => number | null;
    dataToPositionY1: (datum: Datum) => number | null;
    valueToPosition: (value1: any, value2: any) => IPoint;
    valueToPositionX: (value: StringOrNumber | StringOrNumber[], datum?: any) => any;
    valueToPositionY: (value: StringOrNumber | StringOrNumber[], datum?: any) => any;
}
export interface IPolarSeries extends ISeries {
    readonly coordinate: 'polar';
    outerRadius: number;
    innerRadius: number;
    getRadiusField: () => string[];
    setRadiusField: (field: string | string[], level?: number) => void;
    getAngleField: () => string[];
    setAngleField: (field: string | string[], level?: number) => void;
    radiusScale: IBaseScale;
    setRadiusScale: (s: IBaseScale) => void;
    angleScale: IBaseScale;
    setAngleScale: (s: IBaseScale) => void;
    positionToData: (point: IPolarPoint) => any;
    radiusToData: (radius: number) => any;
    angleToData: (angle: number) => any;
    radiusAxisHelper: IPolarAxisHelper;
    angleAxisHelper: IPolarAxisHelper;
    valueToPosition: (value1: any, value2: any) => IPoint;
}
export interface IGeoSeries extends ISeries {
    readonly coordinate: 'geo';
    nameField?: string;
    valueField?: string;
    getMapViewData: () => DataView;
    getNameProperty: () => string;
    dataToPosition: (datum: any, checkInViewData?: boolean) => IPoint | null;
    dataToLatitude: (latValue: any) => number | null;
    dataToLongitude: (lonValue: any) => number | null;
    positionToData: (p: IPoint) => any;
    latitudeToData: (lat: number) => any;
    longitudeToData: (lon: number) => any;
    getCoordinateHelper: () => IGeoCoordinateHelper;
    setCoordinateHelper: (helper: IGeoCoordinateHelper) => void;
    valueToPosition: (value1: any, value2: any) => IPoint;
    getDatumCenter: (datum: any) => [number, number];
}
export interface IArcSeries extends IPolarSeries {
    center: (() => IPoint) | IPoint;
    getRadius: (state?: StateValueType) => number;
    getInnerRadius: (state?: StateValueType) => number;
    computeRadius: (r: number, k?: number) => number;
    computeDatumRadius: (datum: any, state?: StateValueType) => number;
}
export interface IFunnelSeries extends ISeries {
    getPoints: (datum: any) => IPoint[];
    getCategoryField: () => string;
    valueToPosition: (value: any) => IPoint;
}
