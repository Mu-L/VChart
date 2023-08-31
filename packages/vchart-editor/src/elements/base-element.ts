import type { IBoundsLike } from '@visactor/vutils';
import type { IRect, IPoint, ILayoutGuideLine } from '../typings/space';
import type { IElementOption } from './interface';
import { CreateID } from '../utils/common';
export abstract class BaseElement {
  protected _rect: IRect;
  protected _position: IPoint;
  protected _anchor: IPoint;
  protected _opt: IElementOption;

  protected _id: number = CreateID();

  constructor(opt: IElementOption) {
    this._opt = opt;
  }

  initWithOption() {
    this._rect = this._opt.rect;
    if (!this._rect) {
      this._rect = { x: 50, y: 50, width: 100, height: 100 };
    }
    this._position = this._opt.position ?? { x: this._rect.x, y: this._rect.y };
    this._anchor = this._opt.anchor ?? { x: 0, y: 0 };
  }

  setRect(rect: IRect) {
    this._rect = rect;
  }

  setPosition(pos: IPoint) {
    this._position = pos;
  }

  setAnchor(anchor: IPoint) {
    this._anchor = anchor;
  }

  abstract resize(rect: IRect): void;
  abstract move(pos: IPoint): void;

  abstract getBounds(): IBoundsLike;

  abstract getLayoutGuideLine(): ILayoutGuideLine[];
}
