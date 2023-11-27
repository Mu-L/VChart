export * from './light';
export * from './dark';
export * from './common/legacy';
import type { ITheme } from '../interface';
export declare const builtinThemes: Record<string, ITheme>;
export declare const defaultThemeName: string;
export declare const themes: Map<string, ITheme>;
export declare const hasThemeMerged: Map<string, boolean>;
export declare const registerTheme: (name: string, theme: Partial<ITheme>) => void;
export declare const getTheme: (name?: string, transformed?: boolean) => ITheme;
export declare const removeTheme: (name: string) => boolean;
export declare const themeExist: (name: any) => boolean;
export declare const getMergedTheme: (theme: Partial<ITheme>) => ITheme;
