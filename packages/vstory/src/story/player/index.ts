import { isNumber, last } from '@visactor/vutils';
import { StoryCanvas } from '../canvas/canvas';
import { IActSpec, IAction } from '../interface';
import { IPlayer } from '../interface/player';
import { processorMap } from '../../dsl/story-processor';
import { Encoder } from './encode';
import { IRole } from '../role';

export class Ticker {
  cb?: (delta: number) => void;
  rafIdx = 0;
  start(cb: (t: number) => void) {
    this.stop();
    this.cb = cb;
    this._tick(0);
  }

  _tick = (lt: number) => {
    const ct = Date.now();
    this.cb && this.cb(lt === 0 ? 0 : ct - lt);
    this.rafIdx = requestAnimationFrame(() => this._tick(ct));
  };

  stop() {
    this.rafIdx && cancelAnimationFrame(this.rafIdx);
    this.rafIdx = 0;
  }
}

type IChapterInstanceItem = {
  id: string;
  scenes: Array<
    {
      role: IRole;
      action: IAction;
    }[]
  >;
  roles: IRole[];
};

export class Player implements IPlayer {
  protected _canvas: StoryCanvas;
  protected _acts: IChapterInstanceItem[];
  protected _currAct: IChapterInstanceItem;
  protected _ticker: Ticker;
  protected _currTime: number;
  protected _encoder: Encoder;

  constructor(c: StoryCanvas) {
    this._canvas = c;
    this._acts = [];
    this._ticker = new Ticker();
    this._currTime = 0;
    this._encoder = new Encoder();
  }

  addAct(
    c: IActSpec,
    roles: {
      [key: string]: IRole;
    }
  ): void {
    const scenes: IChapterInstanceItem['scenes'] = [];
    const roleSet: Set<IRole> = new Set();
    c.scenes.forEach(item => {
      const scene: IChapterInstanceItem['scenes'][0] = [];
      item.forEach(({ actions, roleId }) => {
        const _actions = actions.slice();
        _actions.sort((a, b) => a.startTime - b.startTime);
        _actions.forEach(action => {
          const role = roles[roleId];
          scene.push({
            role,
            action: action
          });
          roleSet.add(role);
        });
      });
      scenes.push(scene);
    });
    this._acts.push({
      id: c.id,
      scenes: scenes,
      roles: Array.from(roleSet.values())
    });
  }

  setCurrentAct(id: number | string) {
    if (isNumber(id)) {
      this._currAct = this._acts[id];
    } else {
      this._currAct = this._acts.filter(item => item.id === id)[0];
    }
  }

  // 清除当前状态，一般用于回放操作
  reset() {
    this._currAct.roles.forEach(item => {
      item.reset();
    });
  }

  tickTo(t: number) {
    const lastTime = this._currTime;
    if (lastTime > t) {
      console.log('abcdefg');
      // 如果时间回退，那就重新走一遍
      this.reset();
      this._currTime = 0;
      this.tickTo(0);
    }
    const roleSet = new Set<IRole>();
    this._currAct.scenes.forEach(scene => {
      scene.forEach(({ role, action }) => {
        const { startTime } = action;
        if (startTime > t) {
          return;
        }
        roleSet.add(role);
        // 之前没走过，现在走
        if (startTime > lastTime && startTime <= t) {
          console.log('abc');
          const { type } = role.spec;
          const process = processorMap[type];
          if (process) {
            const func = process[action.action];
            func && func(role, {}, action);
          }
        }
        role.show();
      });
    });

    // roleSet.forEach(r => {
    //   r.tickTo && r.tickTo(t);
    // });

    this._currTime = t;
    this._canvas.getStage().ticker.tickAt(t);
    this._canvas.getStage().render();
  }

  play(): void {
    if (!this._currAct) {
      return;
    }
    this._ticker.stop();
    this._currTime = 0;
    this.reset();
    this._ticker.start(t => {
      this.tickTo(this._currTime + t);
    });
  }

  async encodeToVideo(millsecond: number, fps: number) {
    // if (!this._currChapter) {
    //   return;
    // }
    const frameNum = (millsecond / 1000) * fps;
    const deltaT = 1000 / fps;
    this.tickTo(0);
    const objUrl = await this._encoder.exportVideo(frameNum, fps, async i => {
      const t = deltaT * i;
      this.tickTo(t);
      return new Promise((resolve, reject) => {
        this._canvas
          .getStage()
          .window.getContext()
          .canvas.nativeCanvas.toBlob((blob: any) => {
            if (blob) {
              resolve(blob);
            } else {
              console.log('no blob');
              reject('no blob');
            }
          }, `image/png`);
      });
    });

    return objUrl;
  }

  pause(): void {
    this._ticker.stop();
  }

  resume(): void {
    this._ticker._tick(this._currTime);
  }

  release(): void {}
}
