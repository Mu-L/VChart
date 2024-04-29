import type { IActionContext } from '..';
import type { IFlickerAction } from '../common';
import type { IBrightenAction } from '../common/brighten';
import type { IDarkenAction } from '../common/darken';
import type { IMoveToAction } from '../common/moveTo';
import type { IGraphicAppearAction } from './appear';

export type GraphicAction = IFlickerAction | IBrightenAction | IDarkenAction | IMoveToAction | IGraphicAppearAction;

export type GraphicActonNode = GraphicAction & IActionContext;
