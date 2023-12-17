import type { IChart } from '../../chart/interface';
import type { ComponentTypeEnum } from '../../component/interface';
import type { VChart } from '../../core';
import type { IModel, IModelSpecInfo } from '../../model/interface';
import type { SeriesTypeEnum } from '../../series';
import type { IChartSpec } from '../../typings';
import type { IMediaQueryItem, IMediaQuerySpec } from './spec';

export interface IMediaInfo {
  /** 图表宽度 */
  width: number;
  /** 图表高度 */
  height: number;
}

export interface IMediaQueryActionFilterResult<T extends Record<string, unknown> = any> {
  /** 是否是图表层级 */
  isChart?: boolean;
  /** 如果不是图表层级，是哪个 model 类型 */
  modelType?: 'series' | 'region' | 'component';
  /** model 具体的类型 */
  type?: SeriesTypeEnum | ComponentTypeEnum;
  /** model 在图表 spec 中对应的 key */
  specKey?: keyof IChartSpec;
  /** 匹配到的 model 的 spec 信息 */
  modelInfo: IModelSpecInfo<T>[];
}

export interface IMediaQueryOption {
  globalInstance: VChart;
  updateSpec: (spec: any, compile?: boolean, render?: boolean) => void;
}

export interface IMediaQueryCheckResult {
  /** 是否命中媒体查询条件 */
  isActive: boolean;
  /** 当前媒体查询的状态是否发生改变（生效->失效 或 失效->生效） */
  hasChanged: boolean;
}

export interface IMediaQueryActionResult {
  /** 返回的图表 spec */
  chartSpec: any;
  /** spec 是否被更改 */
  hasChanged: boolean;
}

export interface IMediaQuery {
  /** 当前正在生效的媒体查询 */
  readonly currentActiveItems: Set<IMediaQueryItem>;
  /** 更新图表宽高信息，执行所有相关媒体查询，返回是否命中某个查询 */
  changeSize: (width: number, height: number, compile?: boolean, render?: boolean) => boolean;
  /** 重新初始化，并重新执行一遍当前生效的媒体查询 */
  reInit: (compile?: boolean, render?: boolean) => void;
  release: () => void;
}

export interface IMediaQueryConstructor {
  new (spec: IMediaQuerySpec, option: IMediaQueryOption): IMediaQuery;
}
