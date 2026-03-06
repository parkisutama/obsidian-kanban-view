/**
 * Global Vitest setup file.
 * Run before every test file.  Polyfills browser globals that the plugin
 * source code reads at module-load time (e.g. window.localStorage in
 * src/lang/helpers.ts).
 */

// ─── Obsidian Array prototype extensions ─────────────────────────────────────
// Obsidian patches Array.prototype with .first() and .last() convenience
// helpers. The plugin source code calls these methods directly, so we must
// polyfill them for the test environment.

// `declare global` requires this file to be a module.
export { };

declare global {
    interface Array<T> {
        first(): T | undefined;
        last(): T | undefined;
    }
}

if (!Array.prototype.first) {
    // eslint-disable-next-line no-extend-native
    Array.prototype.first = function <T>(this: T[]): T | undefined {
        return this[0];
    };
}

if (!Array.prototype.last) {
    // eslint-disable-next-line no-extend-native
    Array.prototype.last = function <T>(this: T[]): T | undefined {
        return this[this.length - 1];
    };
}

// ─── Window globals ───────────────────────────────────────────────────────────

// jsdom already provides window / localStorage; we only need to pre-populate
// the language key so the translation helper selects the English locale and
// never logs a "locale not found" error during tests.
if (typeof window !== 'undefined') {
    window.localStorage.setItem('language', 'en');
}

// Silence "moment is not defined" if any helper lazily accesses window.moment.
if (typeof window !== 'undefined' && !(window as any).moment) {
    (window as any).moment = () => ({
        format: () => '',
        isValid: () => false,
    });
}
