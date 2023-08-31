import type { IBoundsLike } from '@visactor/vutils';
import { VChart } from '@visactor/vchart';
import type { IChart, IChartSpec } from '@visactor/vchart';
import type { IElementOption } from './../interface';
import type { IRect, IPoint, ILayoutGuideLine } from '../../typings/space';
import { BaseElement } from '../base-element';
import type { IChartTemp } from './temp/interface';
import type { ILayout } from '../../layout/interface';
import { SpecProcess } from './spec-process/spec-process';
import type { ISpecProcess } from './spec-process/interface';
import { Data } from './data/data';
import type { IData } from './data/interface';
import { Layout } from '../../layout/layout';
import { getTemp } from './temp';
import type { IChartElementOption } from './interface';

export class EditorChart extends BaseElement {
  protected _data: IData;
  protected _specProcess: ISpecProcess;
  protected _layout: ILayout;
  protected _temp: IChartTemp;

  protected declare _opt: IChartElementOption;
  protected _container: HTMLElement;

  protected _vchart: IChart;

  constructor(opt: IChartElementOption) {
    super(opt);

    this._data = new Data();
    this._specProcess = new SpecProcess(this._data, this.onSpecReady);
    this._layout = new Layout(this._specProcess);
  }

  initWithOption(): void {
    super.initWithOption();
    if (this._opt.dataSource) {
      this._data.changeDataSource(this._opt.dataSource.type, this._opt.dataSource.value);
    }
    if (this._opt.temp) {
      this.setTemp(this._opt.temp);
    }
  }

  protected _initVChart(spec: IChartSpec) {
    this._vchart = new VChart(spec, {
      renderCanvas: this._opt.renderCanvas,
      viewBox: {
        x1: this._rect.x,
        x2: this._rect.x + this._rect.width,
        y1: this._rect.y,
        y2: this._rect.y + this._rect.height
      }
    });
    this._layout.setVChart(this._vchart);
  }

  setTemp(key: string) {
    this._temp = getTemp(key);
    this._specProcess.updateTemp(this._temp);
  }

  setDataSource(type: string, value: any) {
    this._data.changeDataSource(type, value);
  }

  onSpecReady = () => {
    if (!this._vchart) {
      this._initVChart(this._specProcess.getVChartSpec());
      this._vchart.renderAsync();
    } else {
      this._vchart.updateSpec(this._specProcess.getVChartSpec());
    }
  };

  clear() {
    this._vchart.release();

    this._data.clear();
    this._temp.clear();
    this._specProcess.clear();
    this._layout.clear();

    this._data = this._temp = this._specProcess = this._layout = this._vchart = null;
  }

  resize(rect: IRect): void {
    throw new Error('Method not implemented.');
  }
  move(pos: IPoint): void {
    throw new Error('Method not implemented.');
  }
  getBounds(): IBoundsLike {
    throw new Error('Method not implemented.');
  }
  getLayoutGuideLine(): ILayoutGuideLine[] {
    throw new Error('Method not implemented.');
  }
}
