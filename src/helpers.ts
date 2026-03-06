import { App, HeadingCache, ListItemCache, TFile } from 'obsidian';

import { frontmatterKey } from './parsers/common';

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
 * task/checklist item (`- [ ]` or `- [x]`) that appears after that heading.
 * Used inside `setViewData` where only the raw string is available.
 */
export function hasKanbanStructureRaw(data: string): boolean {
  if (!data) return false;

  // Quick bail-outs
  if (!/^## .+/m.test(data)) return false;
  if (!/^- \[[ xX]\]/m.test(data)) return false;

  // Verify at least one task appears after the first H2
  const h2Index = data.search(/^## .+/m);
  if (h2Index < 0) return false;

  const afterH2 = data.slice(h2Index);
  return /^- \[[ xX]\]/m.test(afterH2);
}

export function hasFrontmatterKey(file: TFile, app?: App) {
  if (!file) return false;
  if (!app) return false;
  const cache = app.metadataCache.getFileCache(file);
  return !!cache?.frontmatter?.[frontmatterKey];
}

/**
 * Detects if a file qualifies as a Kanban board based purely on its structure
 * (at least one Heading 2 with a task/checklist item anywhere in the file).
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

  // Must have at least one checklist/task item
  const hasTasks = listItems.some((item: ListItemCache) => item.task !== undefined);
  if (!hasTasks) return false;

  // Verify at least one task item appears AFTER an H2 heading
  const h2Positions = headings
    .filter((h: HeadingCache) => h.level === 2)
    .map((h: HeadingCache) => h.position.start.offset);

  return listItems.some(
    (item: ListItemCache) =>
      item.task !== undefined &&
      h2Positions.some((pos: number) => item.position.start.offset > pos)
  );
}

/**
 * Returns true if a file should be treated as a Kanban board:
 * - Either it has the legacy `kanban-plugin` frontmatter key, OR
 * - It has the structural signature (H2 heading + checklist items).
 */
export function isKanbanFile(file: TFile, app?: App): boolean {
  return hasFrontmatterKey(file, app) || hasKanbanStructure(file, app);
}
