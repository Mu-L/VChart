import type { DataView } from '@visactor/vdataset';
import { array, isFunction, isValid, isNil } from '@visactor/vutils';
import { AGGR_TYPE } from '../../constant/marker';
import type { IOptionAggr } from '../../data/transforms/aggregation';
import type { IModelRenderOption } from '../../model/interface';
import type { IRegion } from '../../region/interface';
import type { ICartesianSeries } from '../../series/interface';
import type { ILayoutRect, ILayoutType, IRect, StringOrNumber } from '../../typings';
import { BaseComponent } from '../base/base-component';
import type { IAggrType, IDataPointSpec, IDataPos, IDataPosCallback, IMarkerAxisSpec, IMarkerSpec } from './interface';
import type { IGraphic, IGroup } from '@visactor/vrender-core';
import { calcLayoutNumber } from '../../util/space';

export abstract class BaseMarker<T extends IMarkerSpec & IMarkerAxisSpec> extends BaseComponent<T> {
  layoutType: ILayoutType | 'none' = 'none';

  protected _startRelativeSeries!: ICartesianSeries;
  protected _endRelativeSeries!: ICartesianSeries;
  protected _relativeSeries!: ICartesianSeries;
  getRelativeSeries() {
    return this._relativeSeries;
  }

  // marker 组件数据
  protected _markerData!: DataView;
  // marker 组件
  protected _markerComponent!: any;

  protected _layoutOffsetX: number = 0;
  protected _layoutOffsetY: number = 0;

  created() {
    super.created();
    // event
    this.initEvent();
    this._bindSeries();
    this._initDataView();
  }

  private _isSpecAggr(spec: IDataPos | IDataPosCallback) {
    return AGGR_TYPE.includes(spec as any);
  }

  private _getAllRelativeSeries() {
    return {
      getRelativeSeries: () => this._relativeSeries,
      getStartRelativeSeries: () => this._startRelativeSeries,
      getEndRelativeSeries: () => this._endRelativeSeries
    };
  }

  protected _processSpecX(specX: IDataPos | IDataPosCallback) {
    const relativeSeries = this._relativeSeries;
    if (this._isSpecAggr(specX)) {
      return {
        x: {
          field: relativeSeries.getSpec().xField,
          aggrType: specX as unknown as IAggrType
        },
        ...this._getAllRelativeSeries()
      };
    }
    return { x: isFunction(specX) ? specX : [specX], ...this._getAllRelativeSeries() };
  }

  protected _processSpecY(specY: IDataPos | IDataPosCallback) {
    const relativeSeries = this._relativeSeries;
    if (this._isSpecAggr(specY)) {
      return {
        y: {
          field: relativeSeries.getSpec().yField,
          aggrType: specY as unknown as IAggrType
        },
        ...this._getAllRelativeSeries()
      };
    }
    return { y: isFunction(specY) ? specY : [specY], ...this._getAllRelativeSeries() };
  }

  protected _processSpecXY(specX: IDataPos | IDataPosCallback, specY: IDataPos | IDataPosCallback) {
    const result: any = {
      ...this._getAllRelativeSeries()
    };
    const relativeSeries = this._relativeSeries;
    if (this._isSpecAggr(specX)) {
      result.x = {
        field: relativeSeries.getSpec().xField,
        aggrType: specX as unknown as IAggrType
      };
    } else {
      result.x = specX;
    }

    if (this._isSpecAggr(specY)) {
      result.y = {
        field: relativeSeries.getSpec().yField,
        aggrType: specY as unknown as IAggrType
      };
    } else {
      result.y = specY;
    }

    return result;
  }

  protected _processSpecCoo(spec: any) {
    const coordinates = spec.coordinates ?? array(spec.coordinate);
    return coordinates.map((coordinate: IDataPointSpec) => {
      const refRelativeSeries = this._getSeriesByIdOrIndex(
        coordinate.refRelativeSeriesId,
        coordinate.refRelativeSeriesIndex
      );

      const { xField, yField } = refRelativeSeries.getSpec();
      const { xFieldDim, xFieldIndex, yFieldDim, yFieldIndex } = coordinate;
      let bindXField = xField;
      if (isValid(xFieldIndex)) {
        bindXField = array(xField)[xFieldIndex];
      }
      if (xFieldDim && array(xField).includes(xFieldDim)) {
        bindXField = xFieldDim;
      }

      let bindYField = yField;
      if (isValid(yFieldIndex)) {
        bindYField = array(yField)[yFieldIndex];
      }
      if (yFieldDim && array(yField).includes(yFieldDim)) {
        bindYField = yFieldDim;
      }

      // const { [xField]: coordinateX, [yField]: coordinateY } = coordinate;
      const option: IOptionAggr = {
        x: undefined,
        y: undefined,
        ...this._getAllRelativeSeries()
      };

      if (this._isSpecAggr(coordinate[bindXField])) {
        option.x = { field: bindXField, aggrType: coordinate[bindXField] as IAggrType };
      } else {
        option.x = array(bindXField).map(field => coordinate[field]);
      }

      if (this._isSpecAggr(coordinate[bindYField])) {
        option.y = { field: bindYField, aggrType: coordinate[bindYField] as IAggrType };
      } else {
        option.y = array(bindYField).map(field => coordinate[field]);
      }
      option.getRefRelativeSeries = () => refRelativeSeries;
      return option;
    });
  }

  updateLayoutAttribute(): void {
    const markerVisible = this._spec.visible ?? true;
    if (markerVisible) {
      // 创建marker组件
      if (!this._markerComponent) {
        this._createMarkerComponent();
        // 代理 marker 组件上的事件
        this._markerComponent.on('*', (event: any, type: string) =>
          this._delegateEvent(this._markerComponent as unknown as IGraphic, event, type)
        );
      }
      this._markerLayout();
    }

    super.updateLayoutAttribute();
  }

  protected _getSeriesByIdOrIndex(seriesUserId: StringOrNumber, seriesIndex: number) {
    let series: ICartesianSeries;
    series = this._option.getSeriesInUserIdOrIndex(array(seriesUserId), [seriesIndex])?.[0] as ICartesianSeries;
    if (!series) {
      series = this._relativeSeries ?? this.getFirstSeries();
    }
    return series;
  }

  protected _bindSeries() {
    const spec = this._spec;
    this._relativeSeries = this._getSeriesByIdOrIndex(spec.relativeSeriesId, spec.relativeSeriesIndex);
    this._startRelativeSeries = this._getSeriesByIdOrIndex(spec.startRelativeSeriesId, spec.startRelativeSeriesIndex);
    this._endRelativeSeries = this._getSeriesByIdOrIndex(spec.endRelativeSeriesId, spec.endRelativeSeriesIndex);
  }

  protected _computeClipRange(regions: IRegion[]) {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    regions.forEach((region: IRegion) => {
      if (region.getLayoutStartPoint().x < minX) {
        minX = region.getLayoutStartPoint().x;
      }
      if (region.getLayoutStartPoint().x + region.getLayoutRect().width > maxX) {
        maxX = region.getLayoutStartPoint().x + region.getLayoutRect().width;
      }
      if (region.getLayoutStartPoint().y < minY) {
        minY = region.getLayoutStartPoint().y;
      }
      if (region.getLayoutStartPoint().y + region.getLayoutRect().height > maxY) {
        maxY = region.getLayoutStartPoint().y + region.getLayoutRect().height;
      }
    });
    return { minX, maxX, minY, maxY };
  }

  protected abstract _initDataView(): void;
  protected abstract _createMarkerComponent(): void;
  protected abstract _markerLayout(): void;

  protected initEvent() {
    // do nothing
  }
  onRender(ctx: IModelRenderOption): void {
    // do nothing
  }
  changeRegions(regions: IRegion[]): void {
    // do nothing
  }

  protected getFirstSeries(): ICartesianSeries {
    for (let i = 0; i < this._regions.length; i++) {
      const r = this._regions[i];
      const series = r.getSeries();
      for (let j = 0; j < series.length; j++) {
        const s = series[j];
        if (s) {
          return s as ICartesianSeries;
        }
      }
    }
    this._option?.onError('need at least one series');
    return null;
  }

  getVRenderComponents(): IGraphic[] {
    return [this._markerComponent] as unknown as IGroup[];
  }

  onLayoutStart(layoutRect: IRect, chartViewRect: ILayoutRect, ctx: any): void {
    // offset
    if (!isNil(this._spec.offsetX)) {
      this._layoutOffsetX = calcLayoutNumber(this._spec.offsetX, chartViewRect.width, chartViewRect);
    }
    if (!isNil(this._spec.offsetY)) {
      this._layoutOffsetY = calcLayoutNumber(this._spec.offsetY, chartViewRect.height, chartViewRect);
    }
    super.onLayoutStart(layoutRect, chartViewRect, ctx);
  }
}
