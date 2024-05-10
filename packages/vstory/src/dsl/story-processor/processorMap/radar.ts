import { StoryChartComponentType, StoryChartType, StoryGraphicType } from '../../constant';

import { addProcessor } from '../vchart/add';
import { createMarkStyleProcessorByMarkType } from '../vchart/style/style';
import { updateProcessor } from '../vchart/update';
import { graphicAppearProcessor, textAppearProcessor } from '../graphic/appear';
import {
  barAppearProcessor,
  barDisappearProcessor,
  lineAppearProcessor,
  areaAppearProcessor,
  areaDisappearProcessor,
  pieAppearProcessor,
  pieDisappearProcessor,
  radarAppearProcessor,
  radarDisappearProcessor
} from '../vchart/charts';
import { createMarkPointProcessor, markPointFlickerProcessor } from '../vchart/markPoint';
import { createTitleProcessor } from '../vchart/title';
import { lineStyleProcessor } from '../vchart/style/lineStyle';
import { danceProcessor } from '../vchart/dance';
import { flickerProcessor } from '../graphic/flicker';
import { darkenProcessor } from '../graphic/darken';
import { brightenProcessor } from '../graphic/brighten';
import { moveToProcessor } from '../graphic/moveTo';
import { styleProcessor } from '../graphic/style';
import { graphicDisappearProcessor, textDisappearProcessor } from '../graphic/disappear';
import { bounceProcessor } from '../vchart/bounce';

export const radarProcessorMap = {
  add: addProcessor,
  addPatch: addProcessor,
  updateProcessor,

  bounce: bounceProcessor,

  createMarkPoint: createMarkPointProcessor,
  createTitle: createTitleProcessor,

  appear: radarAppearProcessor,
  disappear: radarDisappearProcessor,
  areaStyle: createMarkStyleProcessorByMarkType('area')
};
