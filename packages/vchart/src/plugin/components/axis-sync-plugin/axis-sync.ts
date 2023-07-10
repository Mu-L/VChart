import { ChartEvent } from './../../../constant/event';
import { zeroAlign } from './zero-align-transform';
import { BasicComponentPlugin } from '../basic-plugin';
import type { IComponentPlugin, IComponentPluginService } from '../interface';
import type { CartesianAxis, ILinearAxisSync } from '../../../component/axis/cartesian';
import { isContinuous } from '@visactor/vscale';
import { registerDataSetInstanceTransform } from '../../../data/register';
import { tickAlign } from './tick-align-transform';

export class AxisSyncPlugin extends BasicComponentPlugin implements IComponentPlugin {
  Name: string = 'AxisSyncPlugin';

  constructor() {
    super(AxisSyncPlugin.Name);
  }

  protected _checkEnableSync(axis: CartesianAxis): ILinearAxisSync | false {
    if (!isContinuous(axis.getScale().type)) {
      return false;
    }
    const sync = axis.getSpec().sync as ILinearAxisSync;
    if (!sync?.axisId) {
      return false;
    }
    return sync;
  }

  private _getTargetAxis(axis: CartesianAxis, sync: ILinearAxisSync) {
    const targetAxis = axis.getOption().getChart().getComponentByUserId(sync.axisId) as CartesianAxis;
    if (!targetAxis?.type.startsWith('cartesianAxis')) {
      return null;
    }
    return targetAxis;
  }

  onInit(service: IComponentPluginService, axis: CartesianAxis) {
    const sync = this._checkEnableSync(axis);
    if (!sync) {
      return;
    }
    if (!sync.zeroAlign) {
      return;
    }
    const targetAxis = this._getTargetAxis(axis, sync);
    if (!targetAxis) {
      return;
    }
    // because of if the to axes bind in same region, the region will update them both in the data update.
    axis.event.on(ChartEvent.scaleDomainUpdate, { filter: ({ model }) => model.id === axis.id }, () => {
      zeroAlign(targetAxis, axis);
    });
  }

  onDidCompile(service: IComponentPluginService, axis: CartesianAxis) {
    const sync = this._checkEnableSync(axis);
    if (!sync) {
      return;
    }
    const targetAxis = this._getTargetAxis(axis, sync);
    if (!targetAxis) {
      return;
    }
    if (sync.tickAlign) {
      registerDataSetInstanceTransform(axis.getOption().dataSet, 'tickAlign', tickAlign);
      const opt = {
        targetAxis: () => targetAxis,
        currentAxis: () => axis
      };
      // only make this one follow target
      axis.addTransformToTickData({ type: 'tickAlign', options: opt, level: Number.MAX_SAFE_INTEGER }, false);
    }
  }
}
