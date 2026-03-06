/**
 * FT-2.4.7 / FT-2.4.8 / FT-2.4.9 — Roundtrip Fidelity (🤖 Otomasi)
 *
 * These tests verify that opening a Markdown file as a Kanban board and
 * immediately serialising it back produces output that either:
 *   - is byte-for-byte identical to the input (canonical-format files), or
 *   - preserves all semantic content (lanes, cards, frontmatter).
 *
 * References: ADR-09, FR-02, NFR-02
 *
 * Run:  npx vitest run tests/unit/parsers/roundtrip.test.ts
 */

import { describe, expect, it } from 'vitest';

import { boardToMd, astToUnhydratedBoard } from 'src/parsers/formats/list';
import { parseMarkdown } from 'src/parsers/parseMarkdown';
import { createMockStateManager } from 'tests/helpers/mockStateManager';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Full parse → unhydratedBoard → serialize pipeline.
 * Mirrors what the plugin does when it opens a file as Kanban.
 */
function roundtrip(md: string): string {
    const sm = createMockStateManager() as any;
    const { ast, settings, frontmatter } = parseMarkdown(sm, md, {});
    const board = astToUnhydratedBoard(sm, settings, frontmatter, ast, md);
    // useTab = false mirrors the common editor default; results are deterministic.
    return boardToMd(board, false);
}

// ─── FT-2.4.7: Roundtrip — canonical format, no frontmatter ──────────────────

describe('FT-2.4.7 — pure markdown roundtrip fidelity (no modifications)', () => {
    /**
     * "Canonical" means the markdown is already in the exact format that
     * boardToMd() produces:
     *   ## Heading\n- [ ] item\n   (no blank line between heading and items)
     *
     * parse(write(parse(file))) === parse(file)
     */

    it('single lane, single unchecked card', () => {
        const md = '## To Do\n- [ ] Task A\n';
        expect(roundtrip(md)).toBe(md);
    });

    it('single lane, single checked card', () => {
        const md = '## Done\n- [x] Task B\n';
        expect(roundtrip(md)).toBe(md);
    });

    it('single lane, multiple cards', () => {
        const md = '## To Do\n- [ ] Task A\n- [ ] Task B\n- [x] Task C\n';
        expect(roundtrip(md)).toBe(md);
    });

    it('multiple lanes preserve order', () => {
        const md = '## To Do\n- [ ] Task A\n## In Progress\n- [ ] Task B\n## Done\n- [x] Task C\n';
        expect(roundtrip(md)).toBe(md);
    });

    it('empty lane (no items) round-trips', () => {
        const md = '## Empty Lane\n';
        expect(roundtrip(md)).toBe(md);
    });

    it('FT-2.4.10 — file with no H2 headings produces empty board (no crash, no content written)', () => {
        const md = 'Just a paragraph.\nNo headings here.\n';
        const result = roundtrip(md);
        // No lanes → no output. The result should be an empty string because there
        // is no preamble (no heading to start a preamble before it), no lanes, no archive.
        expect(result).toBe('');
    });
});

// ─── FT-2.4.8: Roundtrip — custom frontmatter preserved ──────────────────────

describe('FT-2.4.8 — frontmatter preservation', () => {
    it('custom frontmatter keys are captured in board.data.frontmatter', () => {
        const md = [
            '---',
            'title: My Board',
            'tags:',
            '  - work',
            '  - project',
            '---',
            '',
            '## To Do',
            '- [ ] Task A',
            '',
        ].join('\n');

        const sm = createMockStateManager() as any;
        const { frontmatter } = parseMarkdown(sm, md, {});

        // Custom keys (not KanbanSettings keys) land in frontmatter
        expect(frontmatter['title']).toBe('My Board');
        expect(frontmatter['tags']).toEqual(['work', 'project']);
    });

    it('plugin does not inject kanban-plugin key into pure-mode frontmatter', () => {
        const md = [
            '---',
            'title: My Board',
            '---',
            '',
            '## Lane',
            '- [ ] Task',
            '',
        ].join('\n');

        const sm = createMockStateManager() as any;
        const { frontmatter } = parseMarkdown(sm, md, {});

        // Frontmatter must NOT get the kanban-plugin key injected
        expect(frontmatter).not.toHaveProperty('kanban-plugin');
    });

    it('pure-mode boardToMd does NOT write frontmatter back to the file', () => {
        const md = [
            '---',
            'title: My Board',
            '---',
            '',
            '## Lane',
            '- [ ] Task',
            '',
        ].join('\n');

        const output = roundtrip(md);
        // Pure mode output must not contain the frontmatter block
        expect(output).not.toContain('---');
        expect(output).not.toContain('title: My Board');
        // But the lane content must be present
        expect(output).toContain('## Lane');
        expect(output).toContain('- [ ] Task');
    });

    it('legacy board (kanban-plugin: board) preserves frontmatter in output', () => {
        const md = [
            '---',
            '',
            'kanban-plugin: board',
            '',
            '---',
            '',
            '## Lane',
            '- [ ] Task',
            '',
        ].join('\n');

        const output = roundtrip(md);
        // Legacy mode must rewrite frontmatter
        expect(output).toContain('kanban-plugin:');
        expect(output).toContain('## Lane');
        expect(output).toContain('- [ ] Task');
    });
});

// ─── FT-2.4.9: Roundtrip — code blocks inside list items preserved ────────────

describe('FT-2.4.9 — code block preservation inside list items', () => {
    it('code block content in a list item title is preserved in titleRaw', () => {
        // A list item whose text content includes a backtick-code snippet
        // (inline code, not a fenced block):
        const md = '## Dev\n- [ ] Run `console.log("test")` to debug\n';

        const sm = createMockStateManager() as any;
        const { ast, settings, frontmatter } = parseMarkdown(sm, md, {});
        const board = astToUnhydratedBoard(sm, settings, frontmatter, ast, md);

        const item = board.children[0].children[0];
        expect(item.data.titleRaw).toContain('`console.log("test")`');
    });

    it('multiline item (indented continuation) is preserved in titleRaw', () => {
        // Continuation lines of a list item are preserved
        const md = '## Dev\n- [ ] Task A\n  continuation line\n';

        const sm = createMockStateManager() as any;
        const { ast, settings, frontmatter } = parseMarkdown(sm, md, {});
        const board = astToUnhydratedBoard(sm, settings, frontmatter, ast, md);

        const item = board.children[0].children[0];
        // The raw title should contain both lines
        expect(item.data.titleRaw).toContain('Task A');
        expect(item.data.titleRaw).toContain('continuation line');
    });

    it('roundtrip of an item with inline code is stable', () => {
        const md = '## Dev\n- [ ] Run `npm test` before pushing\n';
        expect(roundtrip(md)).toBe(md);
    });
});

// ─── FT-2.4 bonus: structural integrity ──────────────────────────────────────

describe('FT-2.4 — structural parsing cross-checks', () => {
    it('FT-2.4.1 H2 rendered as lanes', () => {
        const md = '## To Do\n- [ ] Item 1\n## Done\n- [ ] Item 2\n';
        const sm = createMockStateManager() as any;
        const { ast, settings, frontmatter } = parseMarkdown(sm, md, {});
        const board = astToUnhydratedBoard(sm, settings, frontmatter, ast, md);

        expect(board.children).toHaveLength(2);
        expect(board.children[0].data.title).toBe('To Do');
        expect(board.children[1].data.title).toBe('Done');
    });

    it('FT-2.4.2 list items rendered as cards', () => {
        const md = '## Lane\n- [ ] Card A\n- [ ] Card B\n- [ ] Card C\n';
        const sm = createMockStateManager() as any;
        const { ast, settings, frontmatter } = parseMarkdown(sm, md, {});
        const board = astToUnhydratedBoard(sm, settings, frontmatter, ast, md);

        expect(board.children[0].children).toHaveLength(3);
        expect(board.children[0].children[0].data.titleRaw).toBe('Card A');
        expect(board.children[0].children[1].data.titleRaw).toBe('Card B');
        expect(board.children[0].children[2].data.titleRaw).toBe('Card C');
    });

    it('FT-2.4.3 checklist state is correctly parsed', () => {
        const md = '## Lane\n- [ ] Undone\n- [x] Done\n';
        const sm = createMockStateManager() as any;
        const { ast, settings, frontmatter } = parseMarkdown(sm, md, {});
        const board = astToUnhydratedBoard(sm, settings, frontmatter, ast, md);

        const [undone, done] = board.children[0].children;
        expect(undone.data.checkChar).toBe(' ');
        expect(done.data.checkChar).toBe('x');
    });

    it('FT-2.4.5 only top-level list items become cards (nested lists excluded)', () => {
        const md = '## Lane\n- [ ] Parent\n  - Child 1\n  - Child 2\n';
        const sm = createMockStateManager() as any;
        const { ast, settings, frontmatter } = parseMarkdown(sm, md, {});
        const board = astToUnhydratedBoard(sm, settings, frontmatter, ast, md);

        // Only "Parent" should be a card; children are part of its content
        expect(board.children[0].children).toHaveLength(1);
        expect(board.children[0].children[0].data.titleRaw).toContain('Parent');
    });
});
