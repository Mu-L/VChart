import type { IAxis } from '../../../../component/axis';
import type { AxisCurrentValueMap } from '../../../../component/crosshair';
import type { IHair } from '../../../../component/crosshair/base';
import { LayoutType } from '../../../../component/crosshair/config';
import {
  layoutByValue,
  layoutHorizontalCrosshair,
  layoutVerticalCrosshair
} from '../../../../component/crosshair/utils/cartesian';
import type { IDimensionData } from '../../../../event';
import type { ICartesianSeries } from '../../../../series';
import { Direction, type ILayoutPoint } from '../../../../typings';
import type {
  IFixedTooltipPositionPattern,
  IGlobalTooltipPositionPattern,
  TooltipFixedPosition
} from '../../../../typings/tooltip/position';
import { isFunction, isNumber, isObject, isValid } from '@visactor/vutils';

export const getActualTooltipPositionValue = (
  position: number | ((event: MouseEvent) => number) | null | undefined,
  event: MouseEvent
): number => {
  let result: number;
  if (isValid(position)) {
    if (isNumber(position)) {
      result = position as number;
    } else if (isFunction(position)) {
      //  这里额外判断下是否合法
      const tooltipPosition = (position as (event: MouseEvent) => number)(event);

      if (isNumber(tooltipPosition)) {
        result = tooltipPosition;
      }
    }
  }
  return result;
};

export type TooltipHorizontalPositionType = 'left' | 'right' | 'center' | 'centerLeft' | 'centerRight';
export type TooltipVerticalPositionType = 'top' | 'bottom' | 'center' | 'centerTop' | 'centerBottom';

/** position 对齐方式在 x、y 分量下的分解 */
export const positionType: Record<TooltipFixedPosition, [TooltipHorizontalPositionType, TooltipVerticalPositionType]> =
  {
    left: ['left', 'center'],
    right: ['right', 'center'],
    top: ['center', 'top'],
    lt: ['left', 'top'],
    tl: ['left', 'top'],
    rt: ['right', 'top'],
    tr: ['right', 'top'],
    bottom: ['center', 'bottom'],
    bl: ['left', 'bottom'],
    lb: ['left', 'bottom'],
    br: ['right', 'bottom'],
    rb: ['right', 'bottom'],
    inside: ['center', 'center'], // 旧版兼容
    center: ['center', 'center'],
    centerBottom: ['center', 'centerBottom'],
    centerTop: ['center', 'centerTop'],
    centerLeft: ['centerLeft', 'center'],
    centerRight: ['centerRight', 'center']
  };

export const getHorizontalPositionType = (
  position: TooltipFixedPosition,
  defaultCase?: TooltipHorizontalPositionType
): TooltipHorizontalPositionType => positionType[position]?.[0] ?? defaultCase;

export const getVerticalPositionType = (
  position: TooltipFixedPosition,
  defaultCase?: TooltipVerticalPositionType
): TooltipVerticalPositionType => positionType[position]?.[1] ?? defaultCase;

export const getCartesianCrosshairRect = (dimensionData: IDimensionData, layoutStartPoint: ILayoutPoint) => {
  const currValueX: AxisCurrentValueMap = new Map();
  const currValueY: AxisCurrentValueMap = new Map();
  const { series, datum } = dimensionData;
  const isHorizontal = (series as ICartesianSeries).direction === Direction.horizontal;
  const axisHelper = isHorizontal
    ? (series as ICartesianSeries).getYAxisHelper()
    : (series as ICartesianSeries).getXAxisHelper();
  const axisId = axisHelper.getAxisId();
  const axis = series
    .getChart()
    .getComponentsByKey('axes')
    .find(axis => axis.id === axisId) as IAxis;

  if (!axis) {
    return undefined;
  }
  (isHorizontal ? currValueY : currValueX).set(axis.getSpecIndex(), {
    value: series.getDatumPositionValues(datum[0], series.getDimensionField())?.[0],
    axis
  });

  const xHair: IHair = {
    visible: !!currValueX.size,
    type: 'rect'
  };
  const yHair: IHair = {
    visible: !!currValueY.size,
    type: 'rect'
  };

  const {
    x: crosshairInfoX,
    y: crosshairInfoY,
    offsetWidth,
    offsetHeight,
    bandWidth,
    bandHeight
  } = layoutByValue(LayoutType.ALL, series as ICartesianSeries, layoutStartPoint, currValueX, currValueY, xHair, yHair);

  if (crosshairInfoX) {
    return layoutVerticalCrosshair(xHair, crosshairInfoX, bandWidth, offsetWidth);
  }
  if (crosshairInfoY) {
    return layoutHorizontalCrosshair(yHair, crosshairInfoY, bandHeight, offsetHeight);
  }
  return undefined;
};

export const isGlobalTooltipPositionPattern = (obj: any): obj is IGlobalTooltipPositionPattern => {
  return (
    isObject(obj) &&
    (isValid((obj as IGlobalTooltipPositionPattern).left) ||
      isValid((obj as IGlobalTooltipPositionPattern).right) ||
      isValid((obj as IGlobalTooltipPositionPattern).top) ||
      isValid((obj as IGlobalTooltipPositionPattern).bottom))
  );
};

export const isFixedTooltipPositionPattern = (obj: any): obj is IFixedTooltipPositionPattern => {
  return (
    isObject(obj) &&
    (isValid((obj as IFixedTooltipPositionPattern).x) || isValid((obj as IFixedTooltipPositionPattern).y))
  );
};
