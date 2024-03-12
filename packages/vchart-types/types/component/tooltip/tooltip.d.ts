import { ComponentTypeEnum } from '../interface/type';
import type { IModelLayoutOption, IModelRenderOption, IModelSpecInfo } from '../../model/interface';
import type { IRegion } from '../../region/interface';
import { BaseComponent } from '../base/base-component';
import type { BaseEventParams, EventCallback, EventQuery, EventType } from '../../event/interface';
import type { ITooltipHandler, ITooltipLineActual, TooltipActiveType } from '../../typings/tooltip';
import type { Datum, IShowTooltipOption } from '../../typings';
import type { ITooltip, ITooltipActiveTypeAsKeys, ITooltipSpec, TooltipHandlerParams, TotalMouseEventData } from './interface';
import { TooltipResult } from './interface/common';
import { DimensionTooltipProcessor } from './processor/dimension-tooltip';
import { MarkTooltipProcessor } from './processor/mark-tooltip';
import type { Maybe } from '@visactor/vutils';
import type { IGraphic } from '@visactor/vrender-core';
import { TooltipSpecTransformer } from './tooltip-transformer';
export type TooltipActualTitleContent = {
    title?: ITooltipLineActual;
    content?: ITooltipLineActual[];
};
export declare class Tooltip extends BaseComponent<any> implements ITooltip {
    protected layoutZIndex: number;
    static type: ComponentTypeEnum;
    static readonly transformerConstructor: typeof TooltipSpecTransformer;
    type: ComponentTypeEnum;
    name: string;
    readonly transformerConstructor: typeof TooltipSpecTransformer;
    static specKey: string;
    specKey: string;
    layoutType: 'none';
    protected _spec: ITooltipSpec;
    static getSpecInfo(chartSpec: any): Maybe<IModelSpecInfo[]>;
    tooltipHandler?: ITooltipHandler;
    private _alwaysShow;
    private _cacheInfo;
    private _cacheParams;
    private _eventList;
    protected _processor: ITooltipActiveTypeAsKeys<MarkTooltipProcessor, DimensionTooltipProcessor>;
    protected _isTooltipShown: boolean;
    protected _clickLock: boolean;
    isTooltipShown(): boolean;
    changeRegions(regions: IRegion[]): void;
    protected _getNeedClearVRenderComponents(): IGraphic[];
    protected _registerEvent(): void;
    protected _releaseEvent(): void;
    onLayout(ctx: IModelLayoutOption): void;
    onLayoutEnd(ctx: IModelLayoutOption): void;
    onRender(ctx: IModelRenderOption): void;
    created(): void;
    release(): void;
    beforeRelease(): void;
    protected _initHandler(): void;
    protected _initProcessor(): void;
    protected _initEvent(): void;
    protected _mountEvent: (eType: EventType, query: EventQuery, callback: EventCallback<any>) => void;
    protected _getMouseOutHandler: (needPointerDetection?: boolean) => (params: BaseEventParams) => void;
    protected _handleChartMouseOut: (params: BaseEventParams) => void;
    protected _getMouseMoveHandler: (isClick: boolean) => (params: BaseEventParams) => void;
    protected _showTooltipByMouseEvent: (activeType: TooltipActiveType, mouseEventData: TotalMouseEventData, params: BaseEventParams, isClick: boolean, useCache?: boolean) => boolean;
    protected _getMouseEventData: (params: BaseEventParams) => TotalMouseEventData;
    protected _hideTooltipByHandler: (params: TooltipHandlerParams) => TooltipResult;
    reInit(spec?: any): void;
    showTooltip(datum: Datum, options: IShowTooltipOption): false | "none" | TooltipActiveType;
    hideTooltip(): boolean;
    private _isSameAsCache;
    private _isPointerInChart;
    private _isPointerOnTooltip;
    getVisible(): boolean;
}
export declare const registerTooltip: () => void;
