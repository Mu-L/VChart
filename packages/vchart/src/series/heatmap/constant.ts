import { MarkTypeEnum } from '../../mark/interface';
import { baseSeriesMark } from '../base/constant';
import { SeriesMarkNameEnum, type SeriesMarkMap } from '../interface/common';

export const heatmapSeriesMark: SeriesMarkMap = {
  ...baseSeriesMark,
  [SeriesMarkNameEnum.cell]: { name: SeriesMarkNameEnum.cell, type: MarkTypeEnum.cell },
  [SeriesMarkNameEnum.cellBackground]: { name: SeriesMarkNameEnum.cellBackground, type: MarkTypeEnum.cell }
};
