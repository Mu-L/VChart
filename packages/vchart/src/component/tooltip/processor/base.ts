import { isNil } from '@visactor/vutils';
import type { BaseEventParams } from '../../../event/interface';
import type { ITooltipActual, TooltipActiveType, TooltipData } from '../../../typings';
import type { TooltipHandlerParams } from '../interface';
// eslint-disable-next-line no-duplicate-imports
import { TooltipResult } from '../interface/common';
import type { Tooltip } from '../tooltip';
import type { MouseEventData, TooltipInfo } from './interface';
import { ChartEvent } from '../../../constant/event';
import type { TooltipEventParams } from '../interface/event';
import type { IDimensionInfo } from '../../../event/events/dimension';
import type { ISeries } from '../../../series/interface';
import { getTooltipSpecForShow } from '../utils/get-spec';
import { isActiveTypeVisible } from '../utils/common';
import { isValid } from '@visactor/vutils';

export abstract class BaseTooltipProcessor {
  readonly component: Tooltip;
  abstract activeType: TooltipActiveType;

  protected _cacheViewSpec: ITooltipActual | undefined;

  constructor(component: Tooltip) {
    this.component = component;
  }

  /** 触发对应类型的 tooltip */
  abstract showTooltip(info: TooltipInfo, params: BaseEventParams, changePositionOnly: boolean): TooltipResult;
  /** 获取触发 tooltip 需要的信息 */
  abstract getMouseEventData(params: BaseEventParams): MouseEventData;

  protected _showTooltipByHandler = (data: TooltipData | undefined, params: TooltipHandlerParams): TooltipResult => {
    if (isNil(data)) {
      return TooltipResult.failed;
    }

    if (!params.changePositionOnly) {
      this.clearCache();
    }

    // 更新 this._cacheViewSpec
    this._updateViewSpec(data, params);
    const spec = this._cacheViewSpec;
    if (isNil(spec) || spec.visible === false) {
      return TooltipResult.failed;
    }
    params.tooltipSpec = this.component.getSpec();
    params.activeTooltipSpec = spec;

    // 判断 tooltip 是否为空
    const { title, content } = spec;

    const isEmpty = isNil(title?.key) && isNil(title?.value) && !content?.length;
    // 触发事件
    this.component.event.emit(ChartEvent.tooltipShow, {
      ...params,
      isEmptyTooltip: isNil(title?.key) && isNil(title?.value) && !content?.length,
      tooltipData: data,
      activeType: this.activeType,
      tooltip: this.component
    } as TooltipEventParams);

    if (isEmpty) {
      return TooltipResult.failed;
    }

    // 显示 tooltip
    let showTooltip;
    if (spec.handler?.showTooltip) {
      showTooltip = spec.handler.showTooltip.bind(spec.handler);
    } else if (this.component.tooltipHandler?.showTooltip) {
      showTooltip = this.component.tooltipHandler.showTooltip.bind(this.component.tooltipHandler);
    }
    if (showTooltip) {
      return showTooltip(this.activeType, data, params) ?? TooltipResult.success;
    }
    return TooltipResult.failed;
  };

  protected _preprocessDimensionInfo(dimensionInfo?: IDimensionInfo[]): IDimensionInfo[] | undefined {
    const newDimensionInfo: IDimensionInfo[] = [];
    dimensionInfo?.forEach(info => {
      const di: IDimensionInfo = {
        ...info,
        data: info.data.filter(
          ({ series }: any) => series.getSpec()?.tooltip?.visible !== false // 过滤掉不需要显示的维度数据
        )
      };
      if (di.data.length > 0) {
        newDimensionInfo.push(di);
      }
    });
    if (newDimensionInfo.length > 0) {
      return newDimensionInfo;
    }
    return undefined;
  }

  /**
   * 合成实际显示的 tooltip spec
   * @param params
   */
  protected _updateViewSpec(data: TooltipData, params: TooltipHandlerParams) {
    const { changePositionOnly, model } = params;
    if (!changePositionOnly || !this._cacheViewSpec) {
      const tooltipSpec = this.component.getSpec();
      /** spec 预处理 */
      this._cacheViewSpec = getTooltipSpecForShow(this.activeType, this.component.getSpec(), model as ISeries, data);

      if (this._cacheViewSpec) {
        if (isNil(this._cacheViewSpec.handler) && isValid(tooltipSpec.handler)) {
          this._cacheViewSpec.handler = tooltipSpec.handler;
        }
        const updateTitle = this._cacheViewSpec.updateTitle ?? tooltipSpec[this.activeType]?.updateTitle;
        const updateContent = this._cacheViewSpec.updateContent ?? tooltipSpec[this.activeType]?.updateContent;

        if (updateTitle) {
          this._cacheViewSpec.title = updateTitle(this._cacheViewSpec.title, data, params) ?? this._cacheViewSpec.title;
        }

        if (updateContent) {
          this._cacheViewSpec.content =
            updateContent(this._cacheViewSpec.content, data, params) ?? this._cacheViewSpec.content;
        }
      }
    }
  }

  /** 判断是否应该触发 tooltip */
  shouldHandleTooltip(params: BaseEventParams, info: TooltipInfo): boolean {
    if (isNil(info)) {
      return false;
    }

    return isActiveTypeVisible(this.activeType, (params.model as ISeries)?.tooltipHelper?.spec);
  }

  clearCache() {
    this._cacheViewSpec = undefined;
  }
}
