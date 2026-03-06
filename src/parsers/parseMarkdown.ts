import { fromMarkdown } from 'mdast-util-from-markdown';
import { frontmatterFromMarkdown } from 'mdast-util-frontmatter';
import { frontmatter } from 'micromark-extension-frontmatter';
import { parseYaml } from 'obsidian';
import { KanbanSettings, settingKeyLookup } from 'src/Settings';
import { StateManager } from 'src/StateManager';
import { getNormalizedPath } from 'src/helpers/renderMarkdown';

import { frontmatterKey, getLinkedPageMetadata } from './common';
import { blockidExtension, blockidFromMarkdown } from './extensions/blockid';
import { genericWrappedExtension, genericWrappedFromMarkdown } from './extensions/genericWrapped';
import { internalMarkdownLinks } from './extensions/internalMarkdownLink';
import { tagExtension, tagFromMarkdown } from './extensions/tag';
import { gfmTaskListItem, gfmTaskListItemFromMarkdown } from './extensions/taskList';
import { FileAccessor } from './helpers/parser';

/**
 * Attempts to extract and parse YAML frontmatter from the document.
 * Returns an empty object if no frontmatter is present (instead of throwing).
 * This allows "pure" Markdown kanban files that have no frontmatter at all.
 */
function extractFrontmatter(md: string): Record<string, any> {
  // Quick check: frontmatter must start at position 0 with '---'
  if (!md.startsWith('---')) {
    return {};
  }

  let frontmatterStart = -1;
  let openDashCount = 0;

  for (let i = 0, len = md.length; i < len; i++) {
    if (openDashCount < 3) {
      if (md[i] === '-') {
        openDashCount++;
        continue;
      } else {
        // Not a valid frontmatter block
        return {};
      }
    }

    if (frontmatterStart < 0) frontmatterStart = i;

    if (md[i] === '-' && /[\r\n]/.test(md[i - 1]) && md[i + 1] === '-' && md[i + 2] === '-') {
      try {
        return parseYaml(md.slice(frontmatterStart, i - 1).trim()) ?? {};
      } catch {
        return {};
      }
    }
  }

  return {};
}

/**
 * Attempts to extract the legacy `%% kanban:settings ``` ... ``` %%` footer
 * from the bottom of a Kanban markdown file.
 *
 * Returns an empty object when no settings footer is present so that callers
 * can transparently fall back to the external BoardSettingsManager store.
 */
function extractSettingsFooter(md: string): Record<string, any> {
  let hasEntered = false;
  let openTickCount = 0;
  let settingsEnd = -1;

  for (let i = md.length - 1; i >= 0; i--) {
    if (!hasEntered && /[`%\n\r]/.test(md[i])) {
      if (md[i] === '`') {
        openTickCount++;

        if (openTickCount === 3) {
          hasEntered = true;
          settingsEnd = i - 1;
        }
      }
      continue;
    } else if (!hasEntered) {
      return {};
    }

    if (md[i] === '`' && md[i - 1] === '`' && md[i - 2] === '`' && /[\r\n]/.test(md[i - 3])) {
      try {
        return JSON.parse(md.slice(i + 1, settingsEnd).trim());
      } catch {
        return {};
      }
    }
  }

  return {};
}

function getExtensions(stateManager: StateManager) {
  return [
    gfmTaskListItem,
    genericWrappedExtension('embedWikilink', '![[', ']]'),
    genericWrappedExtension('wikilink', '[[', ']]'),
    tagExtension(),
    blockidExtension(),
  ];
}

function getMdastExtensions(stateManager: StateManager) {
  return [
    gfmTaskListItemFromMarkdown,
    genericWrappedFromMarkdown('embedWikilink', (text, node) => {
      if (!text) return;

      const normalizedPath = getNormalizedPath(text);

      const file = stateManager.app.metadataCache.getFirstLinkpathDest(
        normalizedPath.root,
        stateManager.file.path
      );

      node.fileAccessor = {
        target: normalizedPath.root,
        isEmbed: true,
        stats: file?.stat,
      } as FileAccessor;
    }),
    genericWrappedFromMarkdown('wikilink', (text, node) => {
      if (!text) return;

      const normalizedPath = getNormalizedPath(text);

      const file = stateManager.app.metadataCache.getFirstLinkpathDest(
        normalizedPath.root,
        stateManager.file.path
      );

      node.fileAccessor = {
        target: normalizedPath.root,
        isEmbed: false,
      } as FileAccessor;

      if (file) {
        const metadata = getLinkedPageMetadata(stateManager, file);

        node.fileMetadata = metadata.fileMetadata;
        node.fileMetadataOrder = metadata.fileMetadataOrder;
      }
    }),
    internalMarkdownLinks((node, isEmbed) => {
      if (!node.url || /:\/\//.test(node.url) || !/.md$/.test(node.url)) {
        return;
      }

      const file = stateManager.app.metadataCache.getFirstLinkpathDest(
        decodeURIComponent(node.url),
        stateManager.file.path
      );

      if (isEmbed) {
        node.type = 'embedLink';
        node.fileAccessor = {
          target: decodeURIComponent(node.url),
          isEmbed: true,
          stats: file.stat,
        } as FileAccessor;
      } else {
        node.fileAccessor = {
          target: decodeURIComponent(node.url),
          isEmbed: false,
        } as FileAccessor;

        if (file) {
          const metadata = getLinkedPageMetadata(stateManager, file);

          node.fileMetadata = metadata.fileMetadata;
          node.fileMetadataOrder = metadata.fileMetadataOrder;
        }
      }
    }),
    tagFromMarkdown(),
    blockidFromMarkdown(),
  ];
}

/**
 * Parse a Kanban Markdown string into an AST and extract settings.
 *
 * @param stateManager - The active StateManager for this board.
 * @param md - Raw Markdown content of the board file.
 * @param externalSettings - Per-board settings loaded from the external
 *   BoardSettingsManager (used when the file has no `%% kanban:settings %%`
 *   footer, i.e. for "pure" Markdown kanban files).
 */
export function parseMarkdown(
  stateManager: StateManager,
  md: string,
  externalSettings: Record<string, any> = {}
) {
  const mdFrontmatter = extractFrontmatter(md);
  const mdSettings = extractSettingsFooter(md);

  // Merge priority: footer settings > external settings > (nothing)
  // External settings are only used when there is no in-file footer.
  const hasFooterSettings = Object.keys(mdSettings).length > 0;
  const settings: Record<string, any> = hasFooterSettings
    ? { ...mdSettings }
    : { ...externalSettings };

  const fileFrontmatter: Record<string, any> = {};

  Object.keys(mdFrontmatter).forEach((key) => {
    if (key === frontmatterKey) {
      const val = mdFrontmatter[key] === 'basic' ? 'board' : mdFrontmatter[key];
      settings[key] = val;
      fileFrontmatter[key] = val;
    } else if (settingKeyLookup.has(key as keyof KanbanSettings)) {
      settings[key] = mdFrontmatter[key];
    } else {
      fileFrontmatter[key] = mdFrontmatter[key];
    }
  });

  stateManager.compileSettings(settings);

  return {
    settings,
    frontmatter: fileFrontmatter,
    /** Whether this file used the legacy in-file settings footer */
    hasLegacyFooter: hasFooterSettings,
    ast: fromMarkdown(md, {
      extensions: [frontmatter(['yaml']), ...getExtensions(stateManager)],
      mdastExtensions: [frontmatterFromMarkdown(['yaml']), ...getMdastExtensions(stateManager)],
    }),
  };
}

export function parseFragment(stateManager: StateManager, md: string) {
  return fromMarkdown(md, {
    extensions: getExtensions(stateManager),
    mdastExtensions: getMdastExtensions(stateManager),
  });
}
