import { TFile } from 'obsidian';
import { KanbanSettings } from 'src/Settings';
import { Nestable } from 'src/dnd/types';
import { InlineField } from 'src/parsers/helpers/inlineMetadata';
import { FileAccessor } from 'src/parsers/helpers/parser';

export enum LaneSort {
  TitleAsc,
  TitleDsc,
  TagsAsc,
  TagsDsc,
}

export interface LaneData {
  shouldMarkItemsComplete?: boolean;
  title: string;
  maxItems?: number;
  markdown?: string;
  dom?: HTMLDivElement;
  forceEditMode?: boolean;
  sorted?: LaneSort | string;
}

export interface DataKey {
  metadataKey: string;
  label: string;
  shouldHideLabel: boolean;
  containsMarkdown: boolean;
}

export interface TagSort {
  tag: string;
}

export type PageDataValue =
  | string
  | number
  | Array<string | number>
  | { [k: string]: PageDataValue };

export interface PageData extends DataKey {
  value: PageDataValue;
}

export interface FileMetadata {
  [k: string]: PageData;
}

export interface ItemMetadata {
  tags?: string[];
  fileAccessor?: FileAccessor;
  file?: TFile | null;
  fileMetadata?: FileMetadata;
  fileMetadataOrder?: string[];
  inlineMetadata?: InlineField[];
}

export interface ItemData {
  blockId?: string;
  checked: boolean;
  checkChar: string;
  isTask?: boolean;
  listMarker?: string;
  title: string;
  titleRaw: string;
  titleSearch: string;
  titleSearchRaw: string;
  metadata: ItemMetadata;
  forceEditMode?: boolean;
}

export interface ErrorReport {
  description: string;
  stack: string;
}

export interface BoardData {
  isSearching: boolean;
  settings: KanbanSettings;
  frontmatter: Record<string, number | string | Array<number | string>>;
  archive: Item[];
  errors: ErrorReport[];
  /** Content that appears before the first lane (e.g. a # H1 document title). Preserved as-is during round-trips. */
  preamble?: string;
}

export type Item = Nestable<ItemData>;
export type Lane = Nestable<LaneData, Item>;
export type Board = Nestable<BoardData, Lane>;
export type MetadataSetting = Nestable<DataKey>;
export type TagSortSetting = Nestable<TagSort>;

export const DataTypes = {
  Item: 'item',
  Lane: 'lane',
  Board: 'board',
  MetadataSetting: 'metadata-setting',
  TagSortSetting: 'tag-sort',
};

export const ItemTemplate = {
  accepts: [DataTypes.Item],
  type: DataTypes.Item,
  children: [] as any[],
};

export const LaneTemplate = {
  accepts: [DataTypes.Lane],
  type: DataTypes.Lane,
};

export const BoardTemplate = {
  accepts: [] as string[],
  type: DataTypes.Board,
};

export const MetadataSettingTemplate = {
  accepts: [DataTypes.MetadataSetting],
  type: DataTypes.MetadataSetting,
  children: [] as any[],
};

export const TagSortSettingTemplate = {
  accepts: [DataTypes.TagSortSetting],
  type: DataTypes.TagSortSetting,
  children: [] as any[],
};

export interface EditCoordinates {
  x: number;
  y: number;
}

export enum EditingState {
  cancel,
  complete,
}

export type EditState = EditCoordinates | EditingState;

export function isEditing(state: EditState): state is EditCoordinates {
  if (state === null) return false;
  if (typeof state === 'number') return false;
  return true;
}
