import { EditorController } from './editor-controller';
import type { EditorMode, IEditorData, IVChartEditorInitOption } from './interface';
import { EditorEvent } from './editor-event';
import { ChartLayer } from '../elements/chart/chart-layer';
import { EditorLayer } from './editor-layer';
import type { Include } from './../typings/commnt';
import { ElementsMap } from './../elements/index';
import type { IElementOption } from './../elements/interface';
import { isString, Bounds, isValidNumber } from '@visactor/vutils';
import type { IDataParserConstructor } from '../elements/chart/data/interface';
import type { IChartTempConstructor } from '../elements/chart/template/interface';
import { EditorFactory } from './factory';

export class VChartEditor {
  static registerParser(key: string, parser: IDataParserConstructor) {
    EditorFactory.registerParser(key, parser);
  }
  static registerTemp(key: string, temp: IChartTempConstructor) {
    EditorFactory.registerTemp(key, temp);
  }

  protected _option: IVChartEditorInitOption;
  get option() {
    return this._option;
  }
  protected _container: HTMLElement;
  get container() {
    return this._container;
  }

  protected _layers: EditorLayer[] = [];
  get layers() {
    return this._layers;
  }

  protected _event: EditorEvent;

  protected _data: IEditorData;

  protected _editorController: EditorController;
  get editorController() {
    return this._editorController;
  }

  protected _mode: EditorMode = 'view';

  protected _width: number;
  protected _height: number;
  protected _needResize: boolean = false;

  constructor(option: IVChartEditorInitOption) {
    this._option = option;
    const { dom, mode } = this._option;
    this._mode = mode;

    this._option.data.setLayers(this.getLayers);
    this._option.data.setDataKey(`_vchart_editor_${this._option.id}`);
    if (dom) {
      this._container = isString(dom) ? document?.getElementById(dom) : dom;
    }
    if (this._container) {
      this._container.style.position = 'relative';
    }
    this._editorController = new EditorController(this._container, {
      getTopLayer: () => {
        if (this._event.triggerLayer) {
          return this._event.triggerLayer;
        }
        return this._layers[0];
      }
    });
    this._editorController.addEndHandler(() => {
      this._option.data?.save?.();
    });
    this.initEvent();
  }

  getLayers = () => {
    return this._layers;
  };

  addElements(type: string, option: Include<Omit<IElementOption, 'layer' | 'controller' | 'mode'>>) {
    if (!ElementsMap[type]) {
      return;
    }
    let layer;
    if (type === 'chart') {
      layer = new ChartLayer(this._container, this._mode);
      option.renderCanvas = layer.getCanvas();
    } else {
      layer = new EditorLayer(this._container, this._mode);
    }
    this.addLayer(layer);
    option.layer = layer;
    option.controller = this._editorController;
    option.mode = this._mode;
    const el = new ElementsMap[type](option);
    if (!el) {
      return;
    }
    el.initWithOption();
    layer.addElements(el);
    this._option.data.save();
  }

  initEvent() {
    this._event = new EditorEvent(this);
    this._event.initEvent();
  }

  resetLayoutZIndex() {
    this._layers.forEach((l, i) => {
      l.getCanvas().style.zIndex = 200 + i + '';
    });
  }

  addLayer(l: EditorLayer) {
    l.getCanvas().style.zIndex = 200 + this._layers.length + '';
    l.onElementReady(this._checkLayerReady);
    this._layers.push(l);
  }

  protected _checkLayerReady = () => {
    if (this._layers.every(l => l.isElementReady)) {
      this._afterAllLayerReady();
      return true;
    }
    return false;
  };

  protected _afterAllLayerReady() {
    if (this._needResize && this._width && this._height) {
      this.resize(this._width, this._height);
    }
  }

  async loadLasted(width?: number, height?: number) {
    if (!this._option.data) {
      return;
    }
    // remove last
    this._layers.forEach(l => l.release());
    this._layers = [];

    const layerData = await this._option.data.load();
    if (!layerData) {
      return;
    }
    layerData.forEach(l => {
      if (l.type === 'chart') {
        const layer = new ChartLayer(this._container, this._mode);
        this.addLayer(layer);
        l.elements.forEach(e => {
          const el = new ElementsMap[e.type]({
            layer: layer,
            rect: e.rect,
            id: e.id,
            type: e.type,
            attribute: e.attribute,
            controller: this._editorController,
            mode: this._mode
          });
          if (!el) {
            return;
          }
          el.initWithOption();
          layer.addElements(el);
        });
      }
    });
    if (width && height) {
      this._width = width;
      this._height = height;
      if (this._mode === 'view') {
        this._needResize = true;
        this._checkLayerReady();
      }
    }
  }

  setModel(mode: EditorMode) {
    if (mode === this._mode) {
      return;
    }
    this._mode = mode;
    this._layers.forEach(l => {
      l.elements.forEach(e => {
        e.setModel(this._mode);
      });
    });
    // clean overGraphic
    if (mode === 'view') {
      this._editorController.setOverGraphic(null, null, null);
    }
    // rerender to clean editor graphic
    this._layers.forEach(l => l.getStage().render());
  }

  release() {
    this._editorController.release();
    this._layers.forEach(l => l.release());
    this._layers = [];
  }

  resize(width: number, height: number) {
    if (!isValidNumber(width) || !isValidNumber(height)) {
      return;
    }
    this._width = width;
    this._height = height;
    const b = new Bounds();
    if (this._layers.length === 0) {
      return;
    }
    this._needResize = false;
    this._layers.forEach(l => {
      b.union(l.getAABBBounds());
    });
    const contentWidth = b.width();
    const contentHeight = b.height();
    if (contentWidth === 0 || contentWidth === Infinity || contentHeight === 0 || contentHeight === Infinity) {
      return;
    }
    const scale = Math.min(width / b.width(), height / b.height(), 1);
    const finalWidth = contentWidth * scale;
    const finalHeight = contentHeight * scale;
    const posX = (width - finalWidth) * 0.5 - b.x1 * scale;
    const posY = (height - finalHeight) * 0.5 - b.y1 * scale;
    this._layers.forEach(l => {
      l.resizeLayer(width, height, posX, posY, scale);
    });
  }
}
