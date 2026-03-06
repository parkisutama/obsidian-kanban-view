/**
 * FT-4.2.2 / FT-4.2.4 — Archiver Separator (🤖 Otomasi)
 *
 * Tests for the archive-separator behavior described in ADR-10.
 *
 *   FT-4.2.2  Files using the legacy `***` separator are read correctly
 *             (backward-compatibility).
 *
 *   FT-4.2.4  New archive sections are ALWAYS written with `---` (ADR-10).
 *
 * References: ADR-10, FR-05
 *
 * Run:  npx vitest run tests/unit/parsers/archive.test.ts
 */

import { describe, expect, it } from 'vitest';

import { boardToMd, astToUnhydratedBoard } from 'src/parsers/formats/list';
import { parseMarkdown } from 'src/parsers/parseMarkdown';
import { archiveString } from 'src/parsers/common';
import { createMockStateManager } from 'tests/helpers/mockStateManager';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseBoard(md: string) {
    const sm = createMockStateManager() as any;
    const { ast, settings, frontmatter } = parseMarkdown(sm, md, {});
    return { board: astToUnhydratedBoard(sm, settings, frontmatter, ast, md), sm };
}

// ─── FT-4.2.2: `***` separator is recognized (backward compat) ───────────────

describe('FT-4.2.2 — legacy *** separator is read correctly', () => {
    /**
     * A board file where the archive section uses the old `***` separator.
     * The parser should recognise the section and expose archive items.
     */
    const LEGACY_MD = [
        '## To Do',
        '- [ ] Active task',
        '',
        '***',
        '',
        '## Archive',
        '- [x] Archived task',
        '',
    ].join('\n');

    it('board is parsed without errors', () => {
        expect(() => parseBoard(LEGACY_MD)).not.toThrow();
    });

    it('recognises the archive section — archived items captured', () => {
        const { board } = parseBoard(LEGACY_MD);
        expect(board.data.archive).toHaveLength(1);
        expect(board.data.archive[0].data.titleRaw).toBe('Archived task');
    });

    it('archive lane is NOT part of the regular lanes array', () => {
        const { board } = parseBoard(LEGACY_MD);
        // Only "To Do" should appear as a regular lane; "Archive" is archive section
        expect(board.children).toHaveLength(1);
        expect(board.children[0].data.title).toBe('To Do');
    });

    it('active tasks are still present in the correct lane', () => {
        const { board } = parseBoard(LEGACY_MD);
        expect(board.children[0].children).toHaveLength(1);
        expect(board.children[0].children[0].data.titleRaw).toBe('Active task');
    });
});

// ─── FT-4.2.4: New archive always writes `---` ────────────────────────────────

describe('FT-4.2.4 — new archive writes --- separator (ADR-10)', () => {
    /**
     * ADR-10 mandates that newly written archive sections use `---` as the
     * separator instead of the legacy `***`.
     */

    it('archiveString constant is --- (ADR-10)', () => {
        // This assertion documents the ADR-10 requirement.
        // Changing archiveString from "***" to "---" will make this pass.
        expect(archiveString).toBe('---');
    });

    it('boardToMd writes --- before archive heading when archive has items', () => {
        // Build a board that has one archived item
        const md = [
            '## To Do',
            '- [ ] Active task',
            '',
            '***',
            '',
            '## Archive',
            '- [x] Done task',
            '',
        ].join('\n');

        const sm = createMockStateManager() as any;
        const { ast, settings, frontmatter } = parseMarkdown(sm, md, {});
        const board = astToUnhydratedBoard(sm, settings, frontmatter, ast, md);

        // Verify the board captured the archive item
        expect(board.data.archive).toHaveLength(1);

        // Serialize back — new separator must be ---
        const output = boardToMd(board, false);
        expect(output).toContain('---');
        expect(output).not.toContain('***');
    });
});

// ─── Bonus: archiveString constant value ─────────────────────────────────────

describe('archiveString constant — current vs expected', () => {
    it('documents the current value of archiveString (audit aid)', () => {
        // This snapshot test captures the CURRENT value so a reviewer can see
        // when it changes from *** to ---.
        expect(archiveString).toMatchInlineSnapshot(`"---"`);

        // ADR-10 implemented: archiveString is now "---".
    });
});
