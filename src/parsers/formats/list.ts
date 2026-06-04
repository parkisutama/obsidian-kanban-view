import update from 'immutability-helper';
import { Content, Heading, List, Parent, Root } from 'mdast';
import { ListItem } from 'mdast-util-from-markdown/lib';
import { toString } from 'mdast-util-to-string';
import { stringifyYaml } from 'obsidian';
import { KanbanSettings } from 'src/Settings';
import { StateManager } from 'src/StateManager';
import { laneTitleWithMaxItems } from 'src/components/Lane/helpers';
import { generateInstanceId } from 'src/components/helpers';
import {
  Board,
  BoardTemplate,
  Item,
  ItemData,
  ItemTemplate,
  Lane,
  LaneTemplate,
} from 'src/components/types';
import { defaultSort } from 'src/helpers/util';
import { t } from 'src/lang/helpers';
import { SKIP, visit } from 'unist-util-visit';

import { archiveString, completeString, frontmatterKey, settingsToCodeblock } from '../common';
import { FileNode, ValueNode } from '../extensions/types';
import {
  ContentBoundary,
  getNodeContentBoundary,
  getPrevSibling,
  getStringFromBoundary,
} from '../helpers/ast';
import { hydrateItem, preprocessTitle } from '../helpers/hydrateBoard';
import { extractInlineFields } from '../helpers/inlineMetadata';
import {
  addBlockId,
  dedentNewLines,
  executeDeletion,
  indentNewLines,
  markRangeForDeletion,
  parseLaneTitle,
  removeBlockId,
  replaceBrs,
  replaceNewLines,
} from '../helpers/parser';
import { parseFragment } from '../parseMarkdown';

interface TaskItem extends ListItem {
  checkChar?: string;
}

function isTaskListItem(item: TaskItem) {
  return typeof item.checked === 'boolean';
}

function getListItemMarker(md: string, item: TaskItem) {
  const start = item.position?.start?.offset;

  if (start === undefined) {
    return '-';
  }

  const lineEnd = md.indexOf('\n', start);
  const line = md.slice(start, lineEnd === -1 ? undefined : lineEnd);
  const marker = line.match(/^[\t ]{0,3}([-+*]|\d{1,9}[.)])[\t ]+/)?.[1];

  return marker || '-';
}

export function listItemToItemData(stateManager: StateManager, md: string, item: TaskItem) {
  const moveTags = stateManager.getSetting('move-tags');

  const startNode = item.children.first();
  const endNode = item.children.last();

  const start =
    startNode.type === 'paragraph'
      ? getNodeContentBoundary(startNode).start
      : startNode.position.start.offset;
  const end =
    endNode.type === 'paragraph'
      ? getNodeContentBoundary(endNode).end
      : endNode.position.end.offset;
  const itemBoundary: ContentBoundary = { start, end };

  let itemContent = getStringFromBoundary(md, itemBoundary);

  // Handle empty task
  if (isTaskListItem(item) && itemContent === '[' + (item.checked ? item.checkChar : ' ') + ']') {
    itemContent = '';
  }

  let title = itemContent;
  let titleSearch = '';

  visit(
    item,
    ['text', 'wikilink', 'embedWikilink', 'image', 'inlineCode', 'code', 'hashtag'],
    (node: any, i, parent) => {
      if (node.type === 'hashtag') {
        if (!parent.children.first()?.value?.startsWith('```')) {
          titleSearch += ' #' + node.value;
        }
      } else {
        titleSearch += node.value || node.alt || '';
      }
    }
  );

  const itemData: ItemData = {
    titleRaw: removeBlockId(dedentNewLines(replaceBrs(itemContent))),
    blockId: undefined,
    title: '',
    titleSearch,
    titleSearchRaw: titleSearch,
    metadata: {
      tags: [],
      fileAccessor: undefined,
      file: undefined,
      fileMetadata: undefined,
      fileMetadataOrder: undefined,
    },
    checked: !!item.checked,
    checkChar: item.checked ? item.checkChar || ' ' : ' ',
    isTask: isTaskListItem(item),
    listMarker: getListItemMarker(md, item),
  };

  visit(
    item,
    (node) => {
      return node.type !== 'paragraph';
    },
    (node, i, parent) => {
      const genericNode = node as ValueNode;

      // Do not descend into nested sub-task lists — their wikilinks/metadata
      // belong to the sub-task, not the parent card.
      if (genericNode.type === 'list' && parent === item) {
        return SKIP;
      }

      if (genericNode.type === 'blockid') {
        itemData.blockId = genericNode.value;
        return true;
      }

      if (
        genericNode.type === 'hashtag' &&
        !(parent.children.first() as any)?.value?.startsWith('```')
      ) {
        if (!itemData.metadata.tags) {
          itemData.metadata.tags = [];
        }

        itemData.metadata.tags.push('#' + genericNode.value);

        if (moveTags) {
          title = markRangeForDeletion(title, {
            start: node.position.start.offset - itemBoundary.start,
            end: node.position.end.offset - itemBoundary.start,
          });
        }
        return true;
      }

      if (genericNode.type === 'embedWikilink') {
        itemData.metadata.fileAccessor = (genericNode as FileNode).fileAccessor;
        return true;
      }

      if (genericNode.type === 'wikilink') {
        itemData.metadata.fileAccessor = (genericNode as FileNode).fileAccessor;
        itemData.metadata.fileMetadata = (genericNode as FileNode).fileMetadata;
        itemData.metadata.fileMetadataOrder = (genericNode as FileNode).fileMetadataOrder;
        return true;
      }

      if (genericNode.type === 'link' && (genericNode as FileNode).fileAccessor) {
        itemData.metadata.fileAccessor = (genericNode as FileNode).fileAccessor;
        itemData.metadata.fileMetadata = (genericNode as FileNode).fileMetadata;
        itemData.metadata.fileMetadataOrder = (genericNode as FileNode).fileMetadataOrder;
        return true;
      }

      if (genericNode.type === 'embedLink') {
        itemData.metadata.fileAccessor = (genericNode as FileNode).fileAccessor;
        return true;
      }
    }
  );

  itemData.title = preprocessTitle(stateManager, dedentNewLines(executeDeletion(title)));

  const firstLineEnd = itemData.title.indexOf('\n');
  const inlineFields = extractInlineFields(itemData.title, true);

  if (inlineFields?.length) {
    itemData.metadata.inlineMetadata = inlineFields.reduce((acc, curr) => {
      if (firstLineEnd <= 0 || curr.end <= firstLineEnd) acc.push(curr);

      return acc;
    }, []);
  }

  itemData.metadata.tags?.sort(defaultSort);

  return itemData;
}

function isArchiveLane(child: Content, children: Content[], currentIndex: number) {
  if (child.type !== 'heading' || toString(child, { includeImageAlt: false }) !== t('Archive')) {
    return false;
  }

  const prev = getPrevSibling(children, currentIndex);

  return prev && prev.type === 'thematicBreak';
}

function getHeadingTitle(md: string, child: Heading) {
  const headingBoundary = getNodeContentBoundary(child as Parent);
  return getStringFromBoundary(md, headingBoundary);
}

function getSectionBoundary(children: Content[], startIndex: number, depth: number) {
  let endIndex = children.length;

  for (let i = startIndex + 1; i < children.length; i++) {
    const child = children[i];
    const next = children[i + 1];

    if (
      child.type === 'thematicBreak' &&
      next?.type === 'heading' &&
      isArchiveLane(next, children, i + 1)
    ) {
      endIndex = i;
      break;
    }

    if (child.type === 'heading' && (child as Heading).depth <= depth) {
      endIndex = i;
      break;
    }
  }

  return endIndex;
}

function getListItemsFromNode(stateManager: StateManager, md: string, child: Content): Item[] {
  if (child.type !== 'list') {
    return [];
  }

  return (child as List).children.map((listItem) => {
    return {
      ...ItemTemplate,
      id: generateInstanceId(),
      data: listItemToItemData(stateManager, md, listItem),
    };
  });
}

function getNodeMarkdown(md: string, child: Content) {
  const start = child.position?.start?.offset;
  const end = child.position?.end?.offset;

  if (start === undefined || end === undefined) {
    return '';
  }

  return md.slice(start, end).trimEnd();
}

function parseLaneChildren(stateManager: StateManager, children: Content[], md: string) {
  const items: Item[] = [];
  const markdown: string[] = [];

  children.forEach((child) => {
    if (child.type === 'list') {
      items.push(...getListItemsFromNode(stateManager, md, child));
      return;
    }

    const raw = getNodeMarkdown(md, child);
    if (raw) {
      markdown.push(raw);
    }
  });

  return {
    items,
    markdown: markdown.join('\n\n').trim(),
  };
}

export function astToUnhydratedBoard(
  stateManager: StateManager,
  settings: KanbanSettings,
  frontmatter: Record<string, any>,
  root: Root,
  md: string
): Board {
  const lanes: Lane[] = [];
  const archive: Item[] = [];

  // Capture preamble: everything between the end of any frontmatter block and
  // the first H2 heading. This preserves a document-level # H1 title (and any
  // other pre-lane content) so it survives the board → markdown round-trip.
  let preamble: string | undefined;
  const firstLaneChild = root.children.find(
    (child) => child.type === 'heading' && (child as Heading).depth === 2
  );
  if (firstLaneChild?.position) {
    const beforeFirstLane = md.slice(0, firstLaneChild.position.start.offset);
    // Strip frontmatter block if present (legacy boards start with ---)
    const afterFrontmatter = beforeFirstLane.replace(/^---[\s\S]*?---\r?\n?/, '');
    const trimmed = afterFrontmatter.trimEnd();
    if (trimmed) {
      preamble = trimmed;
    }
  }

  root.children.forEach((child, index) => {
    if (child.type === 'heading') {
      // Skip H1 headings – they represent a document title, not a lane/column.
      // H1 content is preserved via the `preamble` field instead.
      if ((child as Heading).depth !== 2) return;
      const isArchive = isArchiveLane(child, root.children, index);
      const title = getHeadingTitle(md, child as Heading);

      let shouldMarkItemsComplete = false;

      const endIndex = getSectionBoundary(root.children, index, 2);
      const laneChildren = root.children.slice(index + 1, endIndex);

      const filteredChildren = laneChildren.filter((laneChild) => {
        if (laneChild.type !== 'paragraph') {
          return true;
        }

        const childStr = toString(laneChild);

        if (childStr.startsWith('%% kanban:settings')) {
          return false;
        }

        if (childStr === t('Complete')) {
          shouldMarkItemsComplete = true;
          return false;
        }

        return true;
      });

      if (isArchive) {
        archive.push(
          ...filteredChildren.flatMap((archiveChild) => {
            return getListItemsFromNode(stateManager, md, archiveChild);
          })
        );

        return;
      }

      const parsedLane = parseLaneChildren(stateManager, filteredChildren, md);

      lanes.push({
        ...LaneTemplate,
        children: parsedLane.items,
        id: generateInstanceId(),
        data: {
          ...parseLaneTitle(title),
          markdown: parsedLane.markdown || undefined,
          shouldMarkItemsComplete,
        },
      });
    }
  });

  return {
    ...BoardTemplate,
    id: stateManager.file.path,
    children: lanes,
    data: {
      settings,
      frontmatter,
      archive,
      isSearching: false,
      errors: [],
      preamble,
    },
  };
}

export function updateItemContent(stateManager: StateManager, oldItem: Item, newContent: string) {
  const useTab = stateManager.app.vault.getConfig('useTab');
  const marker = oldItem.data.listMarker || '-';
  const itemContent = addBlockId(indentNewLines(newContent, useTab), oldItem);
  const md =
    oldItem.data.isTask === false
      ? `${marker} ${itemContent}`
      : `${marker} [${oldItem.data.checkChar}] ${itemContent}`;

  const ast = parseFragment(stateManager, md);
  const itemData = listItemToItemData(stateManager, md, (ast.children[0] as List).children[0]);
  const newItem = update(oldItem, {
    data: {
      $set: itemData,
    },
  });

  try {
    hydrateItem(stateManager, newItem);
  } catch (e) {
    console.error(e);
  }

  return newItem;
}

export function newItem(
  stateManager: StateManager,
  newContent: string,
  checkChar: string,
  forceEdit?: boolean
) {
  const useTab = stateManager.app.vault.getConfig('useTab');
  const md = `- [${checkChar}] ${indentNewLines(newContent, useTab)}`;
  const ast = parseFragment(stateManager, md);
  const itemData = listItemToItemData(stateManager, md, (ast.children[0] as List).children[0]);

  itemData.forceEditMode = !!forceEdit;

  const newItem: Item = {
    ...ItemTemplate,
    id: generateInstanceId(),
    data: itemData,
  };

  try {
    hydrateItem(stateManager, newItem);
  } catch (e) {
    console.error(e);
  }

  return newItem;
}

export function reparseBoard(stateManager: StateManager, board: Board) {
  try {
    return update(board, {
      children: {
        $set: board.children.map((lane) => {
          return update(lane, {
            children: {
              $set: lane.children.map((item) => {
                return updateItemContent(stateManager, item, item.data.titleRaw);
              }),
            },
          });
        }),
      },
    });
  } catch (e) {
    stateManager.setError(e);
    throw e;
  }
}

function itemToMd(item: Item, useTab: boolean) {
  const marker = item.data.listMarker || '-';
  const itemContent = addBlockId(indentNewLines(item.data.titleRaw, useTab), item);

  if (item.data.isTask === false) {
    return `${marker} ${itemContent}`;
  }

  return `${marker} [${item.data.checkChar}] ${itemContent}`;
}

function laneToMd(lane: Lane, useTab: boolean) {
  const parts: string[] = [
    `## ${replaceNewLines(laneTitleWithMaxItems(lane.data.title, lane.data.maxItems))}`,
  ];

  if (lane.data.shouldMarkItemsComplete) {
    parts.push(completeString);
  }

  if (lane.data.markdown?.trim()) {
    parts.push(lane.data.markdown.trim());
  }

  if (lane.children.length) {
    parts.push(lane.children.map((item) => itemToMd(item, useTab)).join('\n'));
  }

  return parts.join('\n\n');
}

function archiveToMd(archive: Item[], useTab: boolean) {
  if (archive.length) {
    return [
      archiveString,
      '',
      `## ${t('Archive')}`,
      '',
      archive.map((item) => itemToMd(item, useTab)).join('\n'),
    ].join('\n');
  }

  return '';
}

export function boardToMd(board: Board, useTab = true) {
  const parts: string[] = [];
  const lanes = board.children.map((lane) => laneToMd(lane, useTab));
  const archive = archiveToMd(board.data.archive, useTab);

  if (board.data.preamble?.trim()) {
    parts.push(board.data.preamble.trimEnd());
  }

  if (lanes.length) {
    parts.push(lanes.join('\n\n'));
  }

  if (archive) {
    parts.push(archive);
  }

  const md = parts.length ? `${parts.join('\n\n')}\n` : '';

  // Legacy mode: board has `kanban-plugin` front matter key.
  // Write the full legacy format: frontmatter + preamble + lanes + settings footer.
  const isLegacy = frontmatterKey in (board.data.frontmatter ?? {});

  if (isLegacy) {
    const frontmatter = ['---', '', stringifyYaml(board.data.frontmatter), '---'].join('\n');
    return `${frontmatter}\n\n${md}${settingsToCodeblock(board)}`;
  }

  // Pure markdown mode: write only preamble + lanes (and archive if present).
  // Settings are stored externally via BoardSettingsManager.
  return md;
}
