import { App, HeadingCache, ListItemCache, TFile } from 'obsidian';

import { frontmatterKey } from './parsers/common';

const h2HeadingRegex = /^##\s+.+$/m;
const gfmListItemRegex = /^[\t ]{0,3}(?:[-+*]|\d{1,9}[.)])[\t ]+(?:\[[ xX]\][\t ]+)?\S/m;

export function hasFrontmatterKeyRaw(data: string) {
  if (!data) return false;

  const match = data.match(/---\s+([\w\W]+?)\s+---/);

  if (!match) {
    return false;
  }

  if (!match[1].contains(frontmatterKey)) {
    return false;
  }

  return true;
}

/**
 * Detects Kanban board structure directly from raw Markdown text (no metadataCache).
 * A file qualifies when it contains at least one H2 heading AND at least one
 * GFM list item that appears after that heading.
 * Used inside `setViewData` where only the raw string is available.
 */
export function hasKanbanStructureRaw(data: string): boolean {
  if (!data) return false;

  // Quick bail-outs
  if (!h2HeadingRegex.test(data)) return false;
  if (!gfmListItemRegex.test(data)) return false;

  // Verify at least one GFM list item appears after the first H2
  const h2Index = data.search(h2HeadingRegex);
  if (h2Index < 0) return false;

  const afterH2 = data.slice(h2Index);
  return gfmListItemRegex.test(afterH2);
}

export function hasFrontmatterKey(file: TFile, app?: App) {
  if (!file) return false;
  if (!app) return false;
  const cache = app.metadataCache.getFileCache(file);
  return !!cache?.frontmatter?.[frontmatterKey];
}

/**
 * Detects if a file qualifies as a Kanban board based purely on its structure
 * (at least one Heading 2 with a GFM list item anywhere in the file).
 * This enables the "Open as Kanban" feature without requiring frontmatter.
 */
export function hasKanbanStructure(file: TFile, app?: App): boolean {
  if (!file || !app) return false;
  const cache = app.metadataCache.getFileCache(file);
  if (!cache) return false;

  const headings = cache.headings ?? [];
  const listItems = cache.listItems ?? [];

  // Must have at least one H2 heading
  const hasH2 = headings.some((h: HeadingCache) => h.level === 2);
  if (!hasH2) return false;

  // Must have at least one GFM list item. Task-list items are included by
  // Obsidian as list items, but normal bullet/ordered points should qualify too.
  if (!listItems.length) return false;

  // Verify at least one list item appears AFTER an H2 heading
  const h2Positions = headings
    .filter((h: HeadingCache) => h.level === 2)
    .map((h: HeadingCache) => h.position.start.offset);

  return listItems.some((item: ListItemCache) =>
    h2Positions.some((pos: number) => item.position.start.offset > pos)
  );
}

/**
 * Returns true if a file should be treated as a Kanban board:
 * - Either it has the legacy `kanban-plugin` frontmatter key, OR
 * - It has the structural signature (H2 heading + GFM list items).
 */
export function isKanbanFile(file: TFile, app?: App): boolean {
  return hasFrontmatterKey(file, app) || hasKanbanStructure(file, app);
}
