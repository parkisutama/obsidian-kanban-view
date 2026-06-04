import { App, TFile } from 'obsidian';
import { hasKanbanStructure, hasKanbanStructureRaw } from 'src/fileDetection';
import { describe, expect, it } from 'vitest';

const gfmPointCases = [
  ['dash bullet', '- Task A'],
  ['plus bullet', '+ Task A'],
  ['asterisk bullet', '* Task A'],
  ['ordered dot', '1. Task A'],
  ['ordered paren', '1) Task A'],
  ['unchecked task', '- [ ] Task A'],
  ['checked task lowercase', '* [x] Task A'],
  ['checked task uppercase', '+ [X] Task A'],
] as const;

describe('hasKanbanStructureRaw', () => {
  it.each(gfmPointCases)('detects an H2 followed by a GFM point: %s', (_label, point) => {
    expect(hasKanbanStructureRaw(`## Lane\n${point}\n`)).toBe(true);
  });

  it('does not detect a point before the first H2 as a board', () => {
    expect(hasKanbanStructureRaw('- Task A\n\n## Lane\nJust text\n')).toBe(false);
  });

  it('does not detect a file without an H2 lane heading', () => {
    expect(hasKanbanStructureRaw('# Title\n- Task A\n')).toBe(false);
  });

  it('does not detect deeply indented code-like points', () => {
    expect(hasKanbanStructureRaw('## Lane\n    - Task A\n')).toBe(false);
  });
});

describe('hasKanbanStructure', () => {
  it('detects metadata cache list items after an H2 even when they are not tasks', () => {
    const app = new App() as any;
    const file = new TFile('board.md');

    app.metadataCache.getFileCache = () => ({
      headings: [
        {
          heading: 'Lane',
          level: 2,
          position: {
            start: { line: 0, col: 0, offset: 0 },
            end: { line: 0, col: 7, offset: 7 },
          },
        },
      ],
      listItems: [
        {
          parent: -1,
          position: {
            start: { line: 1, col: 0, offset: 8 },
            end: { line: 1, col: 8, offset: 16 },
          },
        },
      ],
    });

    expect(hasKanbanStructure(file, app)).toBe(true);
  });

  it('does not detect metadata cache list items that only appear before an H2', () => {
    const app = new App() as any;
    const file = new TFile('board.md');

    app.metadataCache.getFileCache = () => ({
      headings: [
        {
          heading: 'Lane',
          level: 2,
          position: {
            start: { line: 1, col: 0, offset: 10 },
            end: { line: 1, col: 7, offset: 17 },
          },
        },
      ],
      listItems: [
        {
          parent: -1,
          position: {
            start: { line: 0, col: 0, offset: 0 },
            end: { line: 0, col: 8, offset: 8 },
          },
        },
      ],
    });

    expect(hasKanbanStructure(file, app)).toBe(false);
  });
});
