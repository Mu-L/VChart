/**
 * @description 复合增长 & 总计差异标注标记交互
 * 1. 双击出现编辑框
 * 2. DEFAULT_OFFSET_FOR_GROWTH_MARKLINE 这个偏移量还是在坐标点内部计算比较好
 * 3. 不支持的系列类型的处理
 */
import type { IGroup, ILine, ISymbol } from '@visactor/vrender-core';
import { type IGraphic, createGroup, vglobal, createLine, createSymbol } from '@visactor/vrender-core';
import type { IEditorElement } from '../../../../core/interface';
import type { IPointLike } from '@visactor/vutils';
import { PointService, array, last, merge } from '@visactor/vutils';
import type { MarkLine as MarkLineComponent } from '@visactor/vrender-components';
import { Segment } from '@visactor/vrender-components';
import type { EventParams, MarkLine, ICartesianSeries, IComponent, IStepMarkLineSpec } from '@visactor/vchart';
import { STACK_FIELD_TOTAL_TOP } from '@visactor/vchart';
import { findClosestPoint } from '../../utils/math';
import { DEFAULT_OFFSET_FOR_TOTAL_DIFF_MARKLINE, calculateCAGR, getInsertPoints, stackTotal } from '../../utils/marker';
import type { DataPoint, Point } from '../types';
import { MarkerTypeEnum } from '../../interface';
import { BaseMarkerEditor } from './base';
import type { IBandLikeScale } from '@visactor/vscale';
import { SamePointApproximate } from '../../../../utils/space';

const START_LINK_HANDLER = 'overlay-growth-mark-line-start-handler';
const END_LINK_HANDLER = 'overlay-growth-mark-line-end-handler';

export class GrowthLineEditor extends BaseMarkerEditor<MarkLine, MarkLineComponent> {
  readonly type = 'markLine';

  private _overlayLine: ILine;
  private _overlayStartHandler: IGraphic;
  private _overlayEndHandler: IGraphic;
  private _currentHandler: IGraphic;
  private _fixedHandler: IGraphic;
  private _dataAnchors: IGroup;

  private _lastDownPoint: Point;
  private _prePoint: Point;
  private _spec: any;
  private _coordinateOffset: [Point, Point];

  protected _handlePointerUp(e: EventParams): void {
    super._handlePointerUp(e);
    this._editComponent?.setAttribute('childrenPickable', true);
  }

  protected _getEnableMarkerTypes(): string[] {
    return [MarkerTypeEnum.growthLine, MarkerTypeEnum.totalDiffLine];
  }

  protected _setCursor(e: EventParams): void {
    // do nothing
  }

  protected _handlePointerDown(e: EventParams): void {
    this._spec = this._model.getSpec();
    this._coordinateOffset = this._getCoordinateOffset();
    const el = this._getEditorElement(e);
    this.startEditor(el, e.event as PointerEvent);
  }
  private _getCoordinateOffset(): [Point, Point] {
    const series = (this._model as unknown as MarkLine).getRelativeSeries();
    const region = series.getRegion();
    const { width: regionWidth, height: regionHeight } = region.getLayoutRect();

    const coordinatesOffset = this._spec.coordinatesOffset ?? [
      { x: 0, y: 0 },
      { x: 0, y: 0 }
    ];
    return coordinatesOffset.map((offset: any) => {
      let offsetX = 0;
      let offsetY = 0;

      const x = offset.x;
      const y = offset.y;
      if (x) {
        offsetX = (Number(x.substring(0, x.length - 1)) * regionWidth) / 100;
      }
      if (y) {
        offsetY = (Number(y.substring(0, y.length - 1)) * regionHeight) / 100;
      }

      return {
        x: offsetX,
        y: offsetY
      };
    });
  }

  protected _getOverGraphic(el: IEditorElement): IGraphic {
    const model = el.model;
    const markLine = (model as unknown as IComponent).getVRenderComponents()[0];
    const lineShape = (markLine as unknown as MarkLineComponent).getLine();
    const overlayLine = new Segment(
      merge({}, lineShape.attribute, {
        lineStyle: {
          stroke: '#3073F2'
        },
        startSymbol: {
          style: {
            fill: '#3073F2'
          }
        },
        endSymbol: {
          style: {
            fill: '#3073F2'
          }
        },
        pickable: false,
        childrenPickable: false
        // dx: markLine.attribute.dx ?? 0,
        // dy: markLine.attribute.dy ?? 0
      })
    );
    overlayLine.name = 'overlay-growth-mark-line-line';

    return overlayLine as unknown as IGraphic;
  }

  protected _createEditorGraphic(el: IEditorElement, e: any): IGraphic {
    if (this._editComponent) {
      return this._editComponent;
    }

    const series = (this._model as unknown as MarkLine).getRelativeSeries();

    const dataPoints = this._getAnchorPoints();
    const lineShape = this._element.getLine();
    const editComponent = createGroup({
      pickable: false,
      childrenPickable: false
    });
    editComponent.name = 'overlay-growth-mark-line';
    const overlayLine = createLine({
      points: lineShape.attribute.points as IPointLike[],
      lineDash: [0],
      lineWidth: 3,
      stroke: '#3073F2'
    });
    overlayLine.name = 'overlay-growth-mark-line-line';
    this._overlayLine = overlayLine;
    editComponent.add(overlayLine);

    const relativeDataPoints = [
      (lineShape.attribute.points as Point[])[0],
      last(lineShape.attribute.points as Point[])
    ].map((point, index) => {
      return dataPoints.find((dataPoint: DataPoint) =>
        SamePointApproximate(dataPoint, {
          x: point.x + this._coordinateOffset[index].x * -1,
          y: point.y + this._coordinateOffset[index].y * -1
        })
      );
    });

    let startLinkLine;
    let endLinkLine;
    if (this._element.name === MarkerTypeEnum.growthLine) {
      startLinkLine = new Segment({
        zIndex: 1,
        points: [
          relativeDataPoints[0],
          {
            x: relativeDataPoints[0].x + this._coordinateOffset[0].x,
            y: relativeDataPoints[0].y + this._coordinateOffset[0].y
          }
        ],
        startSymbol: {
          visible: true,
          symbolType: 'circle',
          size: 10,
          style: {
            fill: '#fff',
            stroke: '#3073F2',
            lineWidth: 1,
            shadowBlur: 4,
            shadowOffsetX: 0,
            shadowOffsetY: 4,
            shadowColor: 'rgba(0, 0, 0, 0.25)'
          }
        },
        endSymbol: { visible: false },
        lineStyle: {
          stroke: '#89909D',
          lineWidth: 1
        },
        childrenPickable: false
      });

      endLinkLine = new Segment({
        zIndex: 1,
        points: [
          relativeDataPoints[1],
          {
            x: relativeDataPoints[1].x + this._coordinateOffset[1].x,
            y: relativeDataPoints[1].y + this._coordinateOffset[1].y
          }
        ],
        startSymbol: {
          visible: true,
          symbolType: 'circle',
          size: 10,
          style: {
            fill: '#fff',
            stroke: '#3073F2',
            lineWidth: 1,
            shadowBlur: 4,
            shadowOffsetX: 0,
            shadowOffsetY: 4,
            shadowColor: 'rgba(0, 0, 0, 0.25)'
          }
        },
        endSymbol: { visible: false },
        lineStyle: {
          stroke: '#89909D',
          lineWidth: 1
        },
        childrenPickable: false
      });
    } else {
      startLinkLine = createSymbol({
        zIndex: 1,
        x: relativeDataPoints[0].x,
        y: relativeDataPoints[0].y,
        symbolType: 'circle',
        size: 10,
        fill: '#fff',
        stroke: '#3073F2',
        lineWidth: 1,
        shadowBlur: 4,
        shadowOffsetX: 0,
        shadowOffsetY: 4,
        shadowColor: 'rgba(0, 0, 0, 0.25)'
      });

      endLinkLine = createSymbol({
        zIndex: 1,
        x: relativeDataPoints[1].x,
        y: relativeDataPoints[1].y,
        symbolType: 'circle',
        size: 10,
        fill: '#fff',
        stroke: '#3073F2',
        lineWidth: 1,
        shadowBlur: 4,
        shadowOffsetX: 0,
        shadowOffsetY: 4,
        shadowColor: 'rgba(0, 0, 0, 0.25)'
      });
    }

    startLinkLine.name = START_LINK_HANDLER;
    this._overlayStartHandler = startLinkLine as unknown as IGraphic;
    editComponent.add(startLinkLine as unknown as IGraphic);

    endLinkLine.name = END_LINK_HANDLER;
    this._overlayEndHandler = endLinkLine as unknown as IGraphic;
    editComponent.add(endLinkLine as unknown as IGraphic);

    this._layer.editorGroup.add(editComponent as unknown as IGraphic);
    this._editComponent = editComponent;

    startLinkLine.addEventListener('pointerenter', () => this._onHandlerHover('move'));
    endLinkLine.addEventListener('pointerenter', () => this._onHandlerHover('move'));
    overlayLine.addEventListener('pointerenter', () =>
      this._onHandlerHover(series.direction === 'horizontal' ? 'ew-resize' : 'ns-resize')
    );

    startLinkLine.addEventListener('pointerleave', this._onHandlerUnHover as EventListenerOrEventListenerObject);
    endLinkLine.addEventListener('pointerleave', this._onHandlerUnHover as EventListenerOrEventListenerObject);
    overlayLine.addEventListener('pointerleave', this._onHandlerUnHover as EventListenerOrEventListenerObject);
    startLinkLine.addEventListener('pointerdown', this._onHandlerDragStart as EventListenerOrEventListenerObject);
    endLinkLine.addEventListener('pointerdown', this._onHandlerDragStart as EventListenerOrEventListenerObject);
    overlayLine.addEventListener('pointerdown', this._onLineHandlerDragStart as EventListenerOrEventListenerObject);

    const dataAnchors = createGroup({
      pickable: false,
      childrenPickable: false
    });
    dataPoints.forEach((point: DataPoint) => {
      const anchor = createSymbol({
        ...point,
        symbolType: 'circle',
        size: 10,
        fill: '#fff',
        stroke: '#FFC528',
        lineWidth: 1,
        shadowBlur: 4,
        shadowOffsetX: 0,
        shadowOffsetY: 4,
        shadowColor: 'rgba(0, 0, 0, 0.25)',
        visible: false
      });
      anchor.data = point.data;
      dataAnchors.add(anchor);
    });
    editComponent.add(dataAnchors as unknown as IGraphic);
    this._dataAnchors = dataAnchors;

    return this._editComponent as unknown as IGraphic;
  }

  // 交互描述：拖拽过程中，根据当前的鼠标垫查找最近的数据点，然后更新图形位置
  private _onHandlerDragStart = (e: any) => {
    e.stopPropagation();

    this._lastDownPoint = {
      x: e.clientX,
      y: e.clientY
    };

    this._chart.option.editorEvent.setCursor('move');

    const model = this._chart.vchart.getChart().getComponentByUserId(this._modelId) as unknown as MarkLine;
    this._element = model.getVRenderComponents()[0] as unknown as MarkLineComponent;
    this._model = model;

    const handler = e.target;
    this._currentHandler = handler as unknown as IGraphic;
    this._fixedHandler = handler.name === START_LINK_HANDLER ? this._overlayEndHandler : this._overlayStartHandler;

    vglobal.addEventListener('pointermove', this._onHandlerDrag);
    vglobal.addEventListener('pointerup', this._onHandlerDragEnd);
  };

  private _onHandlerDrag = (e: any) => {
    e.stopPropagation();
    this._chart.option.editorEvent.setCursor('move');

    // Important: 拖拽过程中，关闭所有标注的交互
    this._silentAllMarkers();

    // 展示可吸附的数据锚点
    // 对于数据锚点，不允许拖拽至另一个固定的锚点
    const enableDataPoints: any[] = [];
    const unenableDataPoint =
      this._element.name === MarkerTypeEnum.growthLine
        ? ((this._fixedHandler as unknown as Segment).attribute.points[0] as Point)
        : {
            x: (this._fixedHandler as unknown as ISymbol).attribute.x,
            y: (this._fixedHandler as unknown as ISymbol).attribute.y
          };
    this._dataAnchors.getChildren().forEach((child: any) => {
      if (SamePointApproximate(child.attribute, unenableDataPoint)) {
        child.setAttribute('visible', false);
        // @ts-ignore
        this._fixedHandler.data = child.data;
      } else {
        enableDataPoints.push({
          x: child.attribute.x,
          y: child.attribute.y,
          data: child.data
        });
        child.setAttribute('visible', true);
      }
    });

    // 转换为画布坐标
    const currentPoint = vglobal.mapToCanvasPoint(e);
    const closestPoint = findClosestPoint(currentPoint, enableDataPoints) as Point;
    // @ts-ignore
    this._currentHandler.data = closestPoint.data;
    if (this._element.name === MarkerTypeEnum.growthLine) {
      (this._currentHandler as unknown as Segment).setAttributes({
        points: [
          closestPoint,
          {
            x: closestPoint.x + this._coordinateOffset[0].x,
            y: closestPoint.y + this._coordinateOffset[0].y
          }
        ]
      });
      (this._fixedHandler as unknown as Segment).setAttributes({
        points: [
          (this._fixedHandler as unknown as Segment).attribute.points[0] as Point,
          {
            x:
              ((this._fixedHandler as unknown as Segment).attribute.points[0] as Point).x + this._coordinateOffset[0].x,
            y: ((this._fixedHandler as unknown as Segment).attribute.points[0] as Point).y + this._coordinateOffset[0].y
          }
        ]
      });

      this._overlayLine.setAttributes({
        points: [
          {
            x: closestPoint.x + this._coordinateOffset[0].x,
            y: closestPoint.y + this._coordinateOffset[0].y
          },
          {
            x:
              ((this._fixedHandler as unknown as Segment).attribute.points[0] as Point).x + this._coordinateOffset[0].x,
            y: ((this._fixedHandler as unknown as Segment).attribute.points[0] as Point).y + this._coordinateOffset[0].y
          }
        ]
      });
    } else {
      (this._currentHandler as unknown as Segment).setAttributes({
        x: closestPoint.x,
        y: closestPoint.y
      });

      this._overlayLine.setAttributes({
        points: getInsertPoints(
          {
            x: this._overlayStartHandler.attribute.x,
            y: this._overlayStartHandler.attribute.y
          },
          {
            x: this._overlayEndHandler.attribute.x,
            y: this._overlayEndHandler.attribute.y
          },
          (this._model.getSpec() as IStepMarkLineSpec).connectDirection,
          DEFAULT_OFFSET_FOR_TOTAL_DIFF_MARKLINE
        )
      });
    }
  };

  private _onHandlerDragEnd = (e: any) => {
    e.preventDefault();

    vglobal.removeEventListener('pointermove', this._onHandlerDrag);
    vglobal.removeEventListener('pointerup', this._onHandlerDragEnd);

    this._chart.option.editorEvent.setCursorSyncToTriggerLayer();
    // Important: 拖拽结束，恢复所有 marker 交互
    this._activeAllMarkers();

    if (PointService.distancePP(this._lastDownPoint, { x: e.clientX, y: e.clientY }) <= 1) {
      return;
    }

    // 隐藏可吸附数据锚点
    this._dataAnchors?.hideAll();
    // 更新 markLine
    const model = this._model as MarkLine;
    const series = model.getRelativeSeries() as ICartesianSeries;
    const valueField = series.direction === 'horizontal' ? series.fieldX[0] : series.fieldY[0];
    const valueFieldInData = series.direction === 'horizontal' ? series.getSpec().xField : series.getSpec().yField;
    const startDatum = (this._overlayStartHandler as unknown as any).data;
    const endDatum = (this._overlayEndHandler as unknown as any).data;

    if (startDatum && endDatum) {
      // 1. 生成新的 markLine spec，用于存储
      const newMarkLineSpec = merge({}, this._spec, {
        coordinates: [
          {
            ...startDatum,
            [valueFieldInData]: startDatum[valueField]
          },
          {
            ...endDatum,
            [valueFieldInData]: endDatum[valueField]
          }
        ],
        _originValue_: [startDatum[valueField], endDatum[valueField]]
      });

      // 2. 更新当前 markLine 组件
      if (this._element.name === MarkerTypeEnum.growthLine) {
        const dimensionField =
          series.direction === 'horizontal' ? array(series.getSpec().yField)[0] : array(series.getSpec().xField)[0];
        const dimensionTicks =
          series.direction === 'horizontal'
            ? (series.getYAxisHelper().getScale(0) as IBandLikeScale).ticks()
            : (series.getXAxisHelper().getScale(0) as IBandLikeScale).ticks();
        const n = Math.abs(
          dimensionTicks.indexOf(endDatum[dimensionField]) - dimensionTicks.indexOf(startDatum[dimensionField])
        );

        const labelText =
          startDatum[valueField] === 0
            ? '<超过 0 的百分比>'
            : `${(calculateCAGR(endDatum[valueField], startDatum[valueField], n) * 100).toFixed(0)}%`;
        newMarkLineSpec.label = {
          ...newMarkLineSpec.label,
          text: labelText
        };
      } else {
        const labelText =
          startDatum[valueField] === 0
            ? '<超过 0 的百分比>'
            : `${(((endDatum[valueField] - startDatum[valueField]) / startDatum[valueField]) * 100).toFixed(0)}%`;

        newMarkLineSpec.expandDistance = DEFAULT_OFFSET_FOR_TOTAL_DIFF_MARKLINE;
        newMarkLineSpec.label = {
          ...newMarkLineSpec.label,
          text: labelText
        };
      }

      this._spec = newMarkLineSpec;
      this._updateAndSave(newMarkLineSpec, 'markLine');
    }
  };

  // 连线拖拽交互
  private _onLineHandlerDragStart = (e: any) => {
    e.stopPropagation();

    this._lastDownPoint = this._prePoint = {
      x: e.clientX,
      y: e.clientY
    };

    const model = this._chart.vchart.getChart().getComponentByUserId(this._modelId) as unknown as MarkLine;
    const series = model.getRelativeSeries();
    this._element = model.getVRenderComponents()[0] as unknown as MarkLineComponent;
    this._model = model;
    this._chart.option.editorEvent.setCursor(series.direction === 'horizontal' ? 'ew-resize' : 'ns-resize');

    vglobal.addEventListener('pointermove', this._onLineHandlerDrag);
    vglobal.addEventListener('pointerup', this._onLineHandlerDragEnd);
  };

  private _onLineHandlerDrag = (e: any) => {
    e.stopPropagation();
    const series = this._model.getRelativeSeries();
    const isHorizontal = series.direction === 'horizontal';
    this._chart.option.editorEvent.setCursor(isHorizontal ? 'ew-resize' : 'ns-resize');

    // Important: 拖拽过程中，关闭所有标注的交互
    this._silentAllMarkers();

    // 更新编辑元素的图形属性
    let xDelta: number;
    let yDelta: number;
    if (isHorizontal) {
      xDelta = e.clientX - this._prePoint.x;
      yDelta = 0;
    } else {
      xDelta = 0;
      yDelta = e.clientY - this._prePoint.y;
    }

    this._prePoint = {
      x: e.clientX,
      y: e.clientY
    };

    if (this._element.name === MarkerTypeEnum.growthLine) {
      this._overlayLine.setAttribute(
        'points',
        this._overlayLine.attribute.points.map(point => {
          return {
            x: point.x + xDelta,
            y: point.y + yDelta
          };
        })
      );
      this._overlayStartHandler.setAttribute(
        'points',
        this._overlayStartHandler.attribute.points.map(point => {
          if (point.data) {
            return point;
          }

          return {
            x: point.x + xDelta,
            y: point.y + yDelta
          };
        })
      );
      this._overlayEndHandler.setAttribute(
        'points',
        this._overlayEndHandler.attribute.points.map(point => {
          if (point.data) {
            return point;
          }

          return {
            x: point.x + xDelta,
            y: point.y + yDelta
          };
        })
      );
    } else {
      this._overlayLine.setAttribute(
        'points',
        this._overlayLine.attribute.points.map((point, index) => {
          if (index === 1 || index === 2) {
            return {
              x: point.x + xDelta,
              y: point.y + yDelta
            };
          }
          return {
            ...point
          };
        })
      );
    }
  };

  private _onLineHandlerDragEnd = (e: any) => {
    e.preventDefault();

    vglobal.removeEventListener('pointermove', this._onLineHandlerDrag);
    vglobal.removeEventListener('pointerup', this._onLineHandlerDragEnd);

    this._chart.option.editorEvent.setCursorSyncToTriggerLayer();
    // Important: 拖拽结束，恢复所有 marker 交互
    this._activeAllMarkers();

    if (PointService.distancePP(this._lastDownPoint, { x: e.clientX, y: e.clientY }) <= 1) {
      return;
    }

    const series = this._model.getRelativeSeries();
    const { width: regionWidth, height: regionHeight } = series.getRegion().getLayoutRect();
    const isHorizontal = series.direction === 'horizontal';
    // 更新 spec
    let newMarkLineSpec;
    if (this._element.name === MarkerTypeEnum.growthLine) {
      // 直接使用最后的编辑图形同数据点的距离
      const points = (this._overlayStartHandler as unknown as Segment).attribute.points as Point[];
      let offset;
      if (isHorizontal) {
        offset = `${((points[1].x - points[0].x) / regionWidth) * 100}%`;
      } else {
        offset = `${((points[1].y - points[0].y) / regionHeight) * 100}%`;
      }

      newMarkLineSpec = merge({}, this._spec, {
        coordinatesOffset: [
          {
            x: isHorizontal ? offset : 0,
            y: isHorizontal ? 0 : offset
          },
          {
            x: isHorizontal ? offset : 0,
            y: isHorizontal ? 0 : offset
          }
        ]
      });
      this._spec = newMarkLineSpec;
      this._coordinateOffset = this._getCoordinateOffset();
    } else {
      const points = this._overlayLine.attribute.points;
      let offset;
      if (isHorizontal) {
        offset = `${
          ((points[1].x - Math.max(this._overlayStartHandler.attribute.x, this._overlayEndHandler.attribute.x)) /
            regionWidth) *
          100
        }%`;
      } else {
        const relativeY = Math.min(this._overlayStartHandler.attribute.y, this._overlayEndHandler.attribute.y);

        offset = `${((relativeY - points[1].y) / regionHeight) * 100}%`;
      }
      newMarkLineSpec = merge({}, this._spec, {
        expandDistance: offset
      });
      this._spec = newMarkLineSpec;
    }
    this._updateAndSave(newMarkLineSpec, 'markLine');
  };

  private _getAnchorPoints() {
    const model = this._model as MarkLine;
    const series = model.getRelativeSeries() as ICartesianSeries;
    const region = series.getRegion();
    const { x: regionStartX, y: regionStartY } = region.getLayoutStartPoint();

    if (series.type === 'bar') {
      // TODO: 需要根据不同的系列名称获取不同的图形节点
      const rectMark = series.getMarks().find((mark: any) => mark.type === 'rect');
      const vgrammarElements = rectMark.getProduct().elements;

      let source;
      // 如果存在堆叠，则只取包含了 STACK_FIELD_TOTAL_TOP 的数据
      if (series.getStack() && series.getStackData()) {
        stackTotal(series.getStackData(), series.getStackValueField());
        source = vgrammarElements.filter((element: any) => {
          const data = array(element.data)[0];
          return data[STACK_FIELD_TOTAL_TOP];
        });
      } else {
        source = vgrammarElements;
      }

      const dataPoints = source.map((element: any) => {
        const graphItem = element.getGraphicItem();
        return {
          x:
            (series.direction === 'horizontal'
              ? graphItem.attribute.x + graphItem.attribute.width
              : graphItem.attribute.x + graphItem.attribute.width / 2) + regionStartX,
          y:
            (series.direction === 'horizontal'
              ? graphItem.attribute.y + graphItem.attribute.height / 2
              : graphItem.attribute.y) + regionStartY,
          data: array(element.data)[0],
          length: series.direction === 'horizontal' ? graphItem.attribute.width : graphItem.attribute.height
        };
      });

      return dataPoints;
    }

    if (series.type === 'line' || series.type === 'area') {
      const seriesData = series.getRawData().latestData;
      let source;
      // 如果存在堆叠，则只取包含了 STACK_FIELD_TOTAL_TOP 的数据
      if (series.getStack() && series.getStackData()) {
        stackTotal(series.getStackData(), series.getStackValueField());

        source = seriesData.filter((data: any) => {
          return data[STACK_FIELD_TOTAL_TOP];
        });
      } else {
        source = seriesData;
      }

      const dataPoints = source.map((data: any) => {
        const position = series.dataToPosition(data);
        return {
          x: position.x + regionStartX,
          y: position.y + regionStartY,
          data,
          length: series.direction === 'horizontal' ? position.x : position.y
        };
      });

      return dataPoints;
    }
  }

  private _onHandlerHover(cursor: string) {
    this._chart.option.editorEvent.setCursor(cursor);
  }

  private _onHandlerUnHover = () => {
    this._chart.option.editorEvent.setCursorSyncToTriggerLayer();
  };
}
