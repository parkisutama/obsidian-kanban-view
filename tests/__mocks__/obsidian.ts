/**
 * Manual mock for the "obsidian" package.
 *
 * The real obsidian module is only available inside Obsidian's runtime.
 * For unit tests executed in Node / jsdom we provide lightweight stubs for
 * every symbol that the plugin source code imports from "obsidian".
 *
 * Add new exports here as needed when new source files import more symbols.
 */

import jsyaml from 'js-yaml';

// ─── YAML helpers ────────────────────────────────────────────────────────────

export function parseYaml(yaml: string): unknown {
    return jsyaml.load(yaml) ?? {};
}

export function stringifyYaml(obj: unknown): string {
    // Obsidian's stringifyYaml always appends a newline; mirror that.
    return jsyaml.dump(obj);
}

// ─── Core classes ────────────────────────────────────────────────────────────

export class TFile {
    path: string;
    name: string;
    extension: string;
    basename: string;
    stat = { mtime: 0, ctime: 0, size: 0 };
    parent: TFolder | null = null;

    constructor(path: string) {
        this.path = path;
        this.name = path.split('/').pop() ?? path;
        this.extension = this.name.includes('.') ? this.name.split('.').pop()! : '';
        this.basename = this.name.replace(/\.[^.]+$/, '');
    }
}

export class TFolder {
    path: string;
    name: string;
    children: (TFile | TFolder)[] = [];
    parent: TFolder | null = null;

    constructor(path: string) {
        this.path = path;
        this.name = path.split('/').pop() ?? path;
    }
}

export class TAbstractFile {
    path = '';
    name = '';
}

// ─── App stub ────────────────────────────────────────────────────────────────

export class App {
    metadataCache = {
        getFirstLinkpathDest: (_linkpath: string, _sourcePath: string): TFile | null => null,
        getFileCache: (_file: TFile) => null,
    };
    vault = {
        getConfig: (key: string) => {
            if (key === 'useTab') return false;
            return undefined;
        },
        read: async () => '',
        modify: async () => { },
        on: () => ({ unload: () => { } }),
    };
    workspace = {
        getLeavesOfType: () => [],
        getActiveViewOfType: () => null,
        on: () => ({ unload: () => { } }),
    };
}

// ─── View stubs ──────────────────────────────────────────────────────────────

export class MarkdownView {
    file: TFile | null = null;
    app = new App();
    containerEl = typeof document !== 'undefined' ? document.createElement('div') : ({} as HTMLElement);
}

export class ItemView {
    app = new App();
    containerEl = typeof document !== 'undefined' ? document.createElement('div') : ({} as HTMLElement);
    leaf = {} as WorkspaceLeaf;
}

export class WorkspaceLeaf {
    view: ItemView | null = null;
}

// ─── Plugin base ─────────────────────────────────────────────────────────────

export class Plugin {
    app = new App();
    addCommand(_cmd: unknown) { }
    addRibbonIcon(_icon: string, _title: string, _cb: () => void) { }
    registerView(_type: string, _viewCreator: unknown) { }
    registerEvent(_event: unknown) { }
    loadData = async (): Promise<unknown> => ({});
    saveData = async (_data: unknown) => { };
}

// ─── Notice ──────────────────────────────────────────────────────────────────

export class Notice {
    constructor(public message: string, public duration?: number) { }
}

// ─── Misc helpers ────────────────────────────────────────────────────────────

export const Platform = {
    isDesktop: true,
    isMobile: false,
    isMacOS: false,
    isWin: true,
    isLinux: false,
};

export function setIcon(_el: HTMLElement, _icon: string) { }
export function addIcon(_name: string, _svg: string) { }
export function normalizePath(path: string) {
    return path.replace(/\\/g, '/').replace(/\/+/g, '/');
}

export class MarkdownRenderer {
    static async renderMarkdown(
        _markdown: string,
        _el: HTMLElement,
        _sourcePath: string,
        _component: unknown,
    ) { }
}

export class Component {
    load() { }
    unload() { }
    onload() { }
    onunload() { }
    register(_cb: () => void) { }
    registerEvent(_event: unknown) { }
}

export class Vault { }
export class MetadataCache { }
export class Workspace { }
export class FileSystemAdapter { }

// ─── Missing symbols needed by transitive imports ────────────────────────────

/** Used in src/parsers/helpers/parser.ts */
export interface Stat {
    ctime: number;
    mtime: number;
    size: number;
}

/** Used as type in src/helpers.ts */
export interface HeadingCache {
    heading: string;
    level: number;
    position: {
        start: { line: number; col: number; offset: number };
        end: { line: number; col: number; offset: number };
    };
}

/** Used as type in src/helpers.ts */
export interface ListItemCache {
    id?: string;
    task?: string;
    parent: number;
    position: {
        start: { line: number; col: number; offset: number };
        end: { line: number; col: number; offset: number };
    };
}

/** Used in src/KanbanView.tsx */
export class TextFileView extends Component {
    file: TFile | null = null;
    app = new App();
    containerEl =
        typeof document !== 'undefined' ? document.createElement('div') : ({} as HTMLElement);
    leaf = {} as WorkspaceLeaf;

    getViewType() { return ''; }
    getDisplayText() { return ''; }
    async onLoadFile(_file: TFile) { }
    async onUnloadFile(_file: TFile) { }
    getViewData() { return ''; }
    setViewData(_data: string, _clear: boolean) { }
    clear() { }
    save(_exitMode?: boolean) { }
    requestSave() { }
}

export interface ViewStateResult {
    history: boolean;
}

export interface ViewState {
    type: string;
    state?: unknown;
}

export interface HoverParent {
    hoverPopover: HoverPopover | null;
}

export class HoverPopover {
    constructor(_parent: HoverParent, _targetEl: HTMLElement | null) { }
}

/** Used in src/Settings.ts */
export class Modal {
    app: App;
    containerEl =
        typeof document !== 'undefined' ? document.createElement('div') : ({} as HTMLElement);
    contentEl =
        typeof document !== 'undefined' ? document.createElement('div') : ({} as HTMLElement);

    constructor(app: App) {
        this.app = app;
    }

    open() { }
    close() { }
    onOpen() { }
    onClose() { }
}

export class PluginSettingTab {
    app: App;
    containerEl =
        typeof document !== 'undefined' ? document.createElement('div') : ({} as HTMLElement);

    constructor(app: App, _plugin: unknown) {
        this.app = app;
    }

    display() { }
    hide() { }
}

export class TextComponent {
    setValue(_v: string) { return this; }
    getValue() { return ''; }
    onChange(_cb: (_v: string) => void) { return this; }
    setPlaceholder(_p: string) { return this; }
    inputEl =
        typeof document !== 'undefined' ? document.createElement('input') : ({} as HTMLInputElement);
}

export class TextAreaComponent {
    setValue(_v: string) { return this; }
    getValue() { return ''; }
    onChange(_cb: (_v: string) => void) { return this; }
    setPlaceholder(_p: string) { return this; }
    inputEl =
        typeof document !== 'undefined'
            ? document.createElement('textarea')
            : ({} as HTMLTextAreaElement);
}

export class ToggleComponent {
    setValue(_v: boolean) { return this; }
    getValue() { return false; }
    onChange(_cb: (_v: boolean) => void) { return this; }
}

export class DropdownComponent {
    addOption(_value: string, _display: string) { return this; }
    addOptions(_options: Record<string, string>) { return this; }
    setValue(_v: string) { return this; }
    getValue() { return ''; }
    onChange(_cb: (_v: string) => void) { return this; }
}

export class ButtonComponent {
    setButtonText(_t: string) { return this; }
    setCta() { return this; }
    onClick(_cb: () => void) { return this; }
    setIcon(_icon: string) { return this; }
    setClass(_cls: string) { return this; }
    buttonEl =
        typeof document !== 'undefined'
            ? document.createElement('button')
            : ({} as HTMLButtonElement);
}

export class ColorComponent {
    setValue(_v: string) { return this; }
    getValue() { return '#000000'; }
    onChange(_cb: (_v: string) => void) { return this; }
}

export class ExtraButtonComponent {
    setIcon(_icon: string) { return this; }
    setTooltip(_t: string) { return this; }
    onClick(_cb: () => void) { return this; }
    extraSettingsEl =
        typeof document !== 'undefined' ? document.createElement('button') : ({} as HTMLElement);
}

export class Setting {
    constructor(_containerEl: HTMLElement) { }
    setName(_name: string) { return this; }
    setDesc(_desc: string) { return this; }
    addText(_cb: (_c: TextComponent) => void) { _cb(new TextComponent()); return this; }
    addToggle(_cb: (_c: ToggleComponent) => void) { _cb(new ToggleComponent()); return this; }
    addDropdown(_cb: (_c: DropdownComponent) => void) { _cb(new DropdownComponent()); return this; }
    addButton(_cb: (_c: ButtonComponent) => void) { _cb(new ButtonComponent()); return this; }
    addColorPicker(_cb: (_c: ColorComponent) => void) { _cb(new ColorComponent()); return this; }
    addExtraButton(_cb: (_c: ExtraButtonComponent) => void) { _cb(new ExtraButtonComponent()); return this; }
    addTextArea(_cb: (_c: TextAreaComponent) => void) { _cb(new TextAreaComponent()); return this; }
    setClass(_cls: string) { return this; }
    setHeading() { return this; }
    then(_cb: (_s: Setting) => void) { _cb(this); return this; }
    settingEl =
        typeof document !== 'undefined' ? document.createElement('div') : ({} as HTMLElement);
}

export interface EditorPosition {
    line: number;
    ch: number;
}

export class Menu {
    addItem(_cb: (_item: MenuItem) => void) { _cb(new MenuItem()); return this; }
    addSeparator() { return this; }
    showAtMouseEvent(_e: MouseEvent) { return this; }
    showAtPosition(_pos: { x: number; y: number }) { return this; }
    hide() { }
}

export class MenuItem {
    setTitle(_t: string) { return this; }
    setIcon(_i: string) { return this; }
    setChecked(_c: boolean) { return this; }
    setDisabled(_d: boolean) { return this; }
    onClick(_cb: (_e: MouseEvent | KeyboardEvent) => void) { return this; }
}

export class Keymap {
    static isModifier(_e: MouseEvent | KeyboardEvent, _modifier: string) { return false; }
}

export function getLinkpath(linktext: string): string {
    return linktext.split('#')[0].split('|')[0].trim();
}

export function debounce<T extends unknown[]>(
    fn: (...args: T) => void,
    timeout = 0,
    _resetTimer = false,
): (...args: T) => void {
    let timer: ReturnType<typeof setTimeout>;
    return (...args: T) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), timeout);
    };
}
