import { IRole } from '../../../story/role';
import { IDarkenAction } from '../../types/common/darken';
import { darken } from './effect/shade';
import { getRoleGraphic } from './util';

// TODO: 类型问题
export const darkenProcessor = async (role: IRole, spec = {}, darkenAction: IDarkenAction) => {
  const { animation } = darkenAction.payload ?? {};
  const graphics = getRoleGraphic(role);
  graphics.forEach(graphic => {
    darken(graphic, animation);
  });
};
