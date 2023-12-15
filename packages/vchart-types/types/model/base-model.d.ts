import type { IEvent } from '../event/interface';
import type { IEffect, IModel, IModelInitOption, IModelOption, IModelRenderOption, IModelEvaluateOption, IModelSpec, IModelMarkInfo } from './interface';
import type { CoordinateType } from '../typings/coordinate';
import type { IMark, IMarkOption, IMarkRaw, IMarkStyle } from '../mark/interface';
import type { Datum, StateValueType, ConvertToMarkStyleSpec, ICommonSpec, StringOrNumber, IRect, ILayoutRect } from '../typings';
import type { CompilableData } from '../compile/data/compilable-data';
import type { IGroupMark } from '@visactor/vgrammar-core';
import { MarkSet } from '../mark/mark-set';
import type { ILayoutItem } from '../layout/interface';
import { CompilableBase } from '../compile/compilable-base';
export declare abstract class BaseModel<T extends IModelSpec> extends CompilableBase implements IModel {
    protected _spec: T;
    getSpec(): T;
    readonly type: string;
    readonly modelType: string;
    readonly id: number;
    userId: StringOrNumber | undefined;
    readonly event: IEvent;
    readonly effect: IEffect;
    protected _data: CompilableData;
    getData(): CompilableData;
    protected _layout?: ILayoutItem;
    get layout(): ILayoutItem;
    protected _specIndex: number;
    getSpecIndex(): number;
    readonly specKey: string;
    protected _originalSpec: any;
    protected _option: IModelOption;
    getOption(): IModelOption;
    protected _marks: MarkSet;
    getMarks(): IMark[];
    getMarkNameMap(): Record<string, IMark>;
    getMarkSet(): MarkSet;
    getMarkInfoList(): IModelMarkInfo[];
    getChart(): import("../chart/interface").IChart;
    protected _theme?: any;
    protected _lastLayoutRect: ILayoutRect;
    constructor(spec: T, option: IModelOption);
    coordinate?: CoordinateType;
    protected _releaseEvent(): void;
    created(): void;
    init(option: IModelInitOption): void;
    afterInit(): void;
    getVisible(): boolean;
    onLayoutStart(layoutRect: IRect, viewRect: ILayoutRect, ctx: any): void;
    onLayoutEnd(ctx: any): void;
    onEvaluateEnd(ctx: IModelEvaluateOption): void;
    abstract onRender(ctx: IModelRenderOption): void;
    onDataUpdate(): void;
    beforeRelease(): void;
    release(): void;
    updateSpec(spec: any): {
        change: boolean;
        reMake: boolean;
        reRender: boolean;
        reSize: boolean;
        reCompile: boolean;
    };
    protected _transformSpec(): void;
    protected _compareSpec(): {
        change: boolean;
        reMake: boolean;
        reRender: boolean;
        reSize: boolean;
        reCompile: boolean;
    };
    reInit(theme?: any): void;
    protected _initTheme(theme?: any): void;
    protected _getTheme(): any;
    protected _mergeThemeToSpec(): void;
    protected _shouldMergeThemeToSpec(): boolean;
    setCurrentTheme(): void;
    updateLayoutAttribute(): void;
    setAttrFromSpec(): void;
    protected _convertMarkStyle<T extends ICommonSpec = ICommonSpec>(style: Partial<IMarkStyle<T> | ConvertToMarkStyleSpec<T>>): Partial<IMarkStyle<T> | ConvertToMarkStyleSpec<T>>;
    setMarkStyle<T extends ICommonSpec>(mark: IMarkRaw<T>, style?: Partial<IMarkStyle<T> | ConvertToMarkStyleSpec<T>>, state?: StateValueType, level?: number): void;
    initMarkStyleWithSpec(mark?: IMark, spec?: any, key?: string): void;
    protected stateKeyToSignalName(key: string, opt?: string): string;
    compileData(): void;
    compileMarks(group?: string | IGroupMark): void;
    protected _createMark<T extends IMark>(markInfo: IModelMarkInfo, option?: Partial<IMarkOption>): T;
    protected _getDataIdKey(): string | ((datum: Datum) => string) | undefined;
    getColorScheme(): import("..").IThemeColorScheme;
}
