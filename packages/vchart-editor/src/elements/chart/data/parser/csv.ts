import { isString } from '@visactor/vutils';
import { DataView, csvParser } from '@visactor/vdataset';
import type { DataSet } from '@visactor/vdataset';
import type { DataUpdateCall, IDataParser } from './../interface';
export class CSVParser implements IDataParser {
  static readonly type = 'csv';
  readonly type: string = CSVParser.type;
  protected _data: DataView = null;
  protected _dataSet: DataSet = null;
  protected _dataValue: string | {} = null;
  protected _onDataUpdateCall: DataUpdateCall = null;
  constructor(dataSet: DataSet, call: DataUpdateCall, value: any) {
    this._dataSet = dataSet;
    this.onDataUpdate(call);
    this._data = new DataView(this._dataSet, { name: 'editor_csv' });
    if (value) {
      this.updateValue(value);
    }
  }
  getData() {
    return this._data;
  }

  getSave() {
    return {
      type: 'csv',
      value: this._dataValue
    };
  }

  updateValue(value: unknown) {
    this._dataValue = value;
    // only enable csv string
    if (isString(value)) {
      this._dataSet.registerParser('csv', csvParser);
      this._data.parse(value, { type: 'csv' });
      this._data.reRunAllTransform();
    }
    this._onDataUpdateCall?.(this._data);
  }
  onDataUpdate(call: DataUpdateCall) {
    this._onDataUpdateCall = call;
  }
  clear() {
    this._data = null;
    this._onDataUpdateCall = null;
  }
}
