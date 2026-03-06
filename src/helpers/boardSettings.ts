/**
 * boardSettings.ts
 *
 * Manages per-board settings stored externally in the plugin's data store
 * instead of inside the Markdown file itself (%% kanban:settings %% footer).
 *
 * This allows Kanban markdown files to remain "pure" and compatible with other
 * Markdown applications while still persisting board-specific configuration.
 *
 * The settings map is keyed by the vault-relative file path of the board.
 * It is loaded once at plugin startup and saved whenever a board setting changes.
 */

import { KanbanSettings } from 'src/Settings';

/** Key used inside the plugin's persisted data object */
export const BOARD_SETTINGS_KEY = 'boardSettings';

export type BoardSettingsMap = Record<string, KanbanSettings>;

export class BoardSettingsManager {
    /** Internal map: filePath → board-specific KanbanSettings */
    private store: BoardSettingsMap;

    /** Callback that persists the full plugin data (must call Plugin.saveData internally) */
    private saveCallback: (boardSettings: BoardSettingsMap) => Promise<void>;

    constructor(
        initial: BoardSettingsMap,
        saveCallback: (boardSettings: BoardSettingsMap) => Promise<void>
    ) {
        this.store = initial ?? {};
        this.saveCallback = saveCallback;
    }

    /** Returns settings for a given board file path, or empty object if none stored */
    get(filePath: string): KanbanSettings {
        return this.store[filePath] ?? {};
    }

    /** Merge `settings` into the stored settings for the given board */
    async set(filePath: string, settings: KanbanSettings): Promise<void> {
        this.store[filePath] = { ...this.store[filePath], ...settings };
        await this.saveCallback(this.store);
    }

    /**
     * Replace all settings for a board at once.
     * Use this after a full settings save (e.g. from the board settings modal).
     */
    async replace(filePath: string, settings: KanbanSettings): Promise<void> {
        this.store[filePath] = { ...settings };
        await this.saveCallback(this.store);
    }

    /** Remove the stored settings for a board (e.g. on file rename / delete) */
    async remove(filePath: string): Promise<void> {
        if (filePath in this.store) {
            delete this.store[filePath];
            await this.saveCallback(this.store);
        }
    }

    /** Rename the key when a board file is renamed */
    async rename(oldPath: string, newPath: string): Promise<void> {
        if (oldPath in this.store) {
            this.store[newPath] = this.store[oldPath];
            delete this.store[oldPath];
            await this.saveCallback(this.store);
        }
    }

    /** Returns a shallow copy of the full store (for debugging) */
    getAll(): BoardSettingsMap {
        return { ...this.store };
    }
}
