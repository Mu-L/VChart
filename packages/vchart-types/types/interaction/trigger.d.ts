import type { IMark } from '../mark/interface';
import type { BaseEventParams, IEvent } from '../event/interface';
import type { IHoverSpec, IInteraction, ISelectSpec, ITrigger, ITriggerOption, ITriggerSpec } from './interface';
import { MarkSet } from '../mark/mark-set';
export declare class Trigger implements ITrigger {
    readonly event: IEvent;
    protected readonly interaction: IInteraction;
    protected _spec: ITriggerSpec;
    protected _option: ITriggerOption;
    protected _hover: IHoverSpec;
    get hover(): IHoverSpec;
    protected _select: ISelectSpec;
    get select(): ISelectSpec;
    protected _fields: string[] | null;
    protected _marks: MarkSet;
    protected _markReverse: MarkSet;
    constructor(spec: ITriggerSpec, option: ITriggerOption);
    setStateKeys(fields: string[]): void;
    registerMark(mark: IMark): void;
    init(): void;
    release(): void;
    protected initEvent(): void;
    protected releaseEvent(): void;
    private initConfig;
    private onHover;
    private onUnHover;
    private onSelect;
    private onUnSelect;
    protected hoverItem(params: BaseEventParams): void;
    protected unhoverItem(): void;
    protected handleSingleEventHover(params: BaseEventParams): void;
    protected selectItems(datums: any[]): void;
    protected clearSelectedItems(): void;
    protected unselectItems(params: BaseEventParams): void;
    protected handleSingleEventSelect(params: BaseEventParams): void;
    protected filterEventMark(params: BaseEventParams): boolean;
    protected isDatumEqual(datumA: any, datumB: any): boolean;
}
