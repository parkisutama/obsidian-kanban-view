/**
 * Unified Pretty Properties integration.
 *
 * Single module for all PP color-styling logic.  Every pill element
 * (property value or tag) goes through the same code path, and the
 * DOM-level refresh used on view-switch / css-change is defined here
 * once.
 */
import { CSSProperties } from 'preact';

// ── helpers shared by VDOM & DOM paths ──────────────────────────

function getPPApi(win: Window = window): any {
    return (win as any).PrettyPropertiesApi;
}

/**
 * Return a CSSProperties object with PP colours for the given
 * property + value, or undefined when PP is absent / has no config.
 */
export function getPrettyPropertiesStyle(
    propertyKey: string,
    value: string
): CSSProperties | undefined {
    if (!value) return undefined;
    const api = getPPApi();
    if (!api) return undefined;

    try {
        const bg = api.getPropertyBackgroundColorValue?.(propertyKey, value);
        const text = api.getPropertyTextColorValue?.(propertyKey, value);
        if (bg || text) {
            const style: CSSProperties = {};
            if (bg) style.backgroundColor = bg;
            if (text) style.color = text;
            return style;
        }
    } catch {
        // No colour config for this property.
    }
    return undefined;
}

/**
 * Call PP's DOM-side enhancement on a mounted element (CSS classes,
 * data-attributes, etc.).  Errors are silently swallowed because the
 * inline style from `getPrettyPropertiesStyle` is already in place.
 */
export function enhanceWithPrettyProperties(
    el: HTMLElement | null,
    propertyKey: string,
    value: string
): void {
    if (!el || !value) return;
    const api = getPPApi();
    if (api?.setPPColorStyles) {
        try {
            api.setPPColorStyles(el, propertyKey, value);
        } catch {
            // Silently ignored.
        }
    }
}

// ── Data-attribute contract ─────────────────────────────────────
// Every PP-colourable pill carries exactly these two attributes.
// The DOM refresh queries only for `[data-pp-key][data-pp-value]`.

export const PP_KEY_ATTR = 'data-pp-key';
export const PP_VALUE_ATTR = 'data-pp-value';

/** HTML attributes to spread on a pill element for later DOM refresh. */
export function ppDataAttrs(propertyKey: string, value: string) {
    return {
        [PP_KEY_ATTR]: propertyKey,
        [PP_VALUE_ATTR]: value,
    } as Record<string, string>;
}

// ── DOM-level bulk refresh ──────────────────────────────────────

const PP_SELECTOR = `[${PP_KEY_ATTR}][${PP_VALUE_ATTR}]`;

/**
 * Walk every PP-pill inside `root` and re-apply colours from the
 * current PP configuration.  Call this after a view switch (with a
 * `requestAnimationFrame` delay) or in response to `css-change`.
 */
export function refreshPrettyProperties(root: HTMLElement): void {
    const api = getPPApi((root as any).win ?? window);
    if (!api) return;

    root.querySelectorAll<HTMLElement>(PP_SELECTOR).forEach((el) => {
        const key = el.getAttribute(PP_KEY_ATTR);
        const value = el.getAttribute(PP_VALUE_ATTR);
        if (!key || !value) return;

        try {
            const bg = api.getPropertyBackgroundColorValue?.(key, value);
            const text = api.getPropertyTextColorValue?.(key, value);
            el.style.backgroundColor = bg || '';
            el.style.color = text || '';
        } catch {
            /* no colour config */
        }

        if (api.setPPColorStyles) {
            try {
                api.setPPColorStyles(el, key, value);
            } catch {
                /* ignore */
            }
        }
    });
}
