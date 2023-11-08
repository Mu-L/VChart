import { MAX_HISTORY_COUNT } from './const';
import type { IEditorData, IHistory } from './interface';

export class EditorData {
  protected _history: IHistory[] = [];

  // 当前正在生效的记录节点
  protected _currentIndex: number = 0;

  protected _data: IEditorData;

  constructor(data: IEditorData) {
    this._data = data;
  }

  pushHistory(h: IHistory) {
    // remove history after currentIndex
    this._history.splice(this._currentIndex + 1);
    // push new history
    this._history.push(h);
    this._currentIndex++;
    if (this._history.length > MAX_HISTORY_COUNT) {
      this._history.shift();
      this._currentIndex--;
    }
    this.saveData();
  }

  forward() {
    if (this._currentIndex >= this._history.length - 1) {
      return;
    }
    this._currentIndex++;
    const his = this._history[this._currentIndex];
    his.use(his.element, his.from, his.to);
    this.saveData();
  }
  backward() {
    if (this._currentIndex <= 0) {
      return;
    }
    this._currentIndex--;
    const his = this._history[this._currentIndex];
    his.use(his.element, his.to, his.from);
    this.saveData();
  }

  saveData() {
    //save
    this._data.save();
  }
}
