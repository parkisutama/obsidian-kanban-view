// Internal Obsidian APIs — Kanban Plugin
// Verified against Obsidian 1.12.0
//
// These augmentations document undocumented-but-stable internal APIs used by
// this plugin.  They allow us to remove most `as any` casts while keeping the
// call-sites type-safe.

import 'obsidian';

declare module 'obsidian' {
    interface App {
        /** Used to retrieve the internal MarkdownEditor class. No public alternative. */
        embedRegistry: {
            embedByExtension: Record<
                string,
                (ctx: { app: App; containerEl: HTMLElement; state: any }, file: any, path: string) => any
            >;
        };

        /** Mobile only — `undefined` on desktop. */
        mobileNavbar?: { containerEl: HTMLElement };

        /** Mobile toolbar — `undefined` on desktop. */
        mobileToolbar?: { update(): void };

        /** Internal plugin registry. No public alternative. */
        internalPlugins: {
            plugins: Record<string, { enabled: boolean; instance: any } | undefined>;
            getPluginById(id: string): { enabled: boolean; instance: any } | null;
        };

        /** Community plugin registry. No public alternative. */
        plugins: {
            plugins: Record<string, any>;
            enabledPlugins: Set<string>;
        };

        /** Drag state manager — no public API. */
        dragManager: {
            draggable?: { type: string; file?: TFile | TFolder; files?: TFile[]; linktext?: string } | null;
        };

        /** Internal command manager. */
        commands: {
            executeCommand(command: { id: string }): boolean;
        };
    }

    interface Vault {
        /** Internal config object used by Proxy in MarkdownEditor. */
        config: Record<string, unknown>;

        /** Read user config values; falls back gracefully if absent. */
        getConfig(key: 'useTab'): boolean;
        getConfig(key: 'useMarkdownLinks'): boolean;
        getConfig(key: 'smartIndentList'): boolean;
        getConfig(key: 'rightToLeft'): boolean;
        getConfig(key: string): unknown;

        /** Resolve the next available attachment path. No public alternative. */
        getAvailablePathForAttachments(
            filename: string,
            ext: string,
            file: TFile
        ): Promise<string>;
    }

    interface WorkspaceLeaf {
        /** Stable since Obsidian 0.x. No public alternative. */
        id: string;
    }

    interface Workspace {
        /** Floating (popout) split container. */
        floatingSplit?: { children: Array<{ win: Window }> };

        /** Context menu helpers for links. */
        handleLinkContextMenu(menu: Menu, linktext: string, sourcePath: string): void;
        handleExternalLinkContextMenu(menu: Menu, url: string): void;

        /** Hover link source registration. */
        registerHoverLinkSource(
            id: string,
            info: { display: string; defaultMod: boolean }
        ): void;
        unregisterHoverLinkSource(id: string): void;

        /** Currently active editor instance. */
        activeEditor: any;
    }

    interface Menu {
        /** Section ordering for context menus. */
        addSections(sections: string[]): this;
    }

    interface FileSystemAdapter {
        /** The absolute base path of the vault on disk. */
        basePath: string;
    }

    interface FileManager {
        /** Create a new markdown file in the given folder. */
        createNewMarkdownFile(folder: TFolder, name: string): Promise<TFile>;
    }

    interface Scope {
        keys: Array<{ modifiers: string; key: string }>;
    }

    interface MenuItem {
        /** Create a submenu from this menu item. */
        setSubmenu(): Menu;
    }
}
