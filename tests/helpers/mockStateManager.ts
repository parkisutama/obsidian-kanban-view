/**
 * Minimal StateManager-like object for unit tests.
 *
 * The real StateManager depends on KanbanView → Obsidian API, which we cannot
 * instantiate in a Node/jsdom environment.  This factory creates a plain
 * object that satisfies the subset of the StateManager interface actually
 * exercised by the parser layer (parseMarkdown, formats/list, common, etc.).
 */

import { App, TFile } from 'obsidian';
import type { KanbanSettings } from 'src/Settings';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface MockStateManagerOptions {
    /** Partial KanbanSettings returned by getSetting(). */
    settings?: Partial<KanbanSettings>;
    /** Path of the "current" board file. */
    filePath?: string;
}

// ─── Factory ─────────────────────────────────────────────────────────────────

export function createMockStateManager(opts: MockStateManagerOptions = {}) {
    const { settings = {}, filePath = 'tests/board.md' } = opts;

    // Default compiled settings mirror the production defaults from StateManager.
    const compiledSettings: Partial<KanbanSettings> = {
        'move-tags': false,
        'metadata-keys': [],
        'show-add-list': true,
        'show-archive-all': true,
        ...settings,
    };

    const stateManager = {
        // ---- File / app ----
        file: new TFile(filePath) as any,
        app: new App() as any,

        // ---- State ----
        state: null as unknown,
        hasError: () => false,
        setError: (_e: unknown) => { },

        // ---- Settings ----
        compiledSettings,
        compileSettings(_suppliedSettings?: Partial<KanbanSettings>) {
            // In tests the compiledSettings are pre-built; nothing extra needed.
        },
        getSetting<K extends keyof KanbanSettings>(key: K): KanbanSettings[K] {
            return (compiledSettings as KanbanSettings)[key];
        },
        getExternalSettings(): Partial<KanbanSettings> {
            return {};
        },

        // ---- Misc ----
        // Provide enough of the StateManager surface that parsers don't throw.
        stateReceivers: [] as Array<(s: unknown) => void>,
        settingsNotifiers: new Map(),
    };

    return stateManager;
}

/** Type alias so tests can import it conveniently. */
export type MockStateManager = ReturnType<typeof createMockStateManager>;
