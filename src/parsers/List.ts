import { isPlainObject } from 'is-plain-object';
import { TFile } from 'obsidian';
import { StateManager } from 'src/StateManager';
import { Board, Item } from 'src/components/types';

import { diff, diffApply } from '../helpers/patch';
import { BaseFormat } from './common';
import {
  astToUnhydratedBoard,
  boardToMd,
  newItem,
  reparseBoard,
  updateItemContent,
} from './formats/list';
import { hydrateBoard, hydratePostOp } from './helpers/hydrateBoard';
import { parseMarkdown } from './parseMarkdown';

const generatedKeys: Array<string | number> = [
  'id',
  'titleSearch',
  'titleSearchRaw',
  'file',
];

export class ListFormat implements BaseFormat {
  stateManager: StateManager;

  constructor(stateManager: StateManager) {
    this.stateManager = stateManager;
  }

  newItem(content: string, checkChar: string, forceEdit?: boolean) {
    return newItem(this.stateManager, content, checkChar, forceEdit);
  }

  updateItemContent(item: Item, content: string) {
    return updateItemContent(this.stateManager, item, content);
  }

  boardToMd(board: Board) {
    return boardToMd(board, this.stateManager.app.vault.getConfig('useTab'));
  }

  mdToBoard(md: string) {
    // Load external (per-board) settings when available.
    // These are only active when the file has no legacy %% kanban:settings %% footer.
    const externalSettings = this.stateManager.getExternalSettings();
    const { ast, settings, frontmatter } = parseMarkdown(this.stateManager, md, externalSettings);
    const newBoard = astToUnhydratedBoard(this.stateManager, settings, frontmatter, ast, md);
    const { state } = this.stateManager;

    if (!this.stateManager.hasError() && state) {
      const ops = diff(
        state,
        newBoard,
        (path) => {
          return generatedKeys.includes(path.last());
        },
        (val: any) => {
          if (!val) return String(val);
          if (val instanceof TFile) return val.path;
          if (isPlainObject(val) || Array.isArray(val)) return String(val);
          return String(val);
        }
      );

      const patchedBoard = diffApply(state, ops) as Board;

      return hydratePostOp(this.stateManager, patchedBoard, ops);
    }

    return hydrateBoard(this.stateManager, newBoard);
  }

  reparseBoard() {
    return reparseBoard(this.stateManager, this.stateManager.state);
  }
}
