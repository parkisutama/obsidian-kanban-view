import { sortLaneChildren } from 'src/components/Lane/LaneMenu';
import { maybeCompleteForMove } from 'src/components/helpers';
import {
  Board,
  BoardTemplate,
  DataTypes,
  Item,
  ItemTemplate,
  Lane,
  LaneTemplate,
} from 'src/components/types';
import { getBoardModifiers } from 'src/helpers/boardModifiers';
import { getTaskStatusDone } from 'src/parsers/helpers/inlineMetadata';
import { describe, expect, it, vi } from 'vitest';

function makeItem(id: string, title: string, children: Item[] = [], checked = false): Item {
  const checkChar = checked ? getTaskStatusDone() : ' ';

  return {
    ...ItemTemplate,
    id,
    children,
    data: {
      blockId: undefined,
      checked,
      checkChar,
      title,
      titleRaw: title,
      titleSearch: title.toLocaleLowerCase(),
      titleSearchRaw: title.toLocaleLowerCase(),
      metadata: {
        tags: [],
        fileAccessor: undefined,
        file: undefined,
        fileMetadata: undefined,
        fileMetadataOrder: undefined,
      },
    },
  };
}

function makeLane(
  id: string,
  title: string,
  children: Item[],
  shouldMarkItemsComplete?: boolean
): Lane {
  return {
    ...LaneTemplate,
    id,
    children,
    data: {
      title,
      shouldMarkItemsComplete,
    },
  };
}

function makeBoard(children: Lane[]): Board {
  return {
    ...BoardTemplate,
    id: 'board',
    children,
    data: {
      archive: [],
      errors: [],
      frontmatter: {},
      isSearching: false,
      settings: {},
    },
  } as Board;
}

function stateManagerFor(initialBoard: Board) {
  let state = initialBoard;

  return {
    get state() {
      return state;
    },
    setState(updater: (board: Board) => Board) {
      state = updater(state);
    },
    setError: vi.fn(),
  };
}

describe('tree-aware board behavior', () => {
  it('marks a moved nested item complete from the nearest completed ancestor lane', () => {
    const moving = makeItem('moving', 'Moving');
    const sourceBoard = makeBoard([makeLane('todo', 'To Do', [moving])]);
    const destinationBoard = makeBoard([
      makeLane('done', 'Done', [makeItem('parent', 'Parent')], true),
    ]);

    const { next } = maybeCompleteForMove(
      {} as any,
      sourceBoard,
      [0, 0],
      {} as any,
      destinationBoard,
      [0, 0, 0],
      moving
    );

    expect(next.data.checked).toBe(true);
    expect(next.data.checkChar).toBe(getTaskStatusDone());
  });

  it('unchecks a moved item when leaving a completed ancestor lane', () => {
    const moving = makeItem('moving', 'Moving', [], true);
    const sourceBoard = makeBoard([makeLane('done', 'Done', [moving], true)]);
    const destinationBoard = makeBoard([makeLane('todo', 'To Do', [makeItem('parent', 'Parent')])]);

    const { next } = maybeCompleteForMove(
      {} as any,
      sourceBoard,
      [0, 0],
      {} as any,
      destinationBoard,
      [0, 0, 0],
      moving
    );

    expect(next.data.checked).toBe(false);
    expect(next.data.checkChar).toBe(' ');
  });

  it('moves nested items to the top and bottom of their current parent', () => {
    const parent = makeItem('parent', 'Parent', [
      makeItem('a', 'A'),
      makeItem('b', 'B'),
      makeItem('c', 'C'),
    ]);
    const manager = stateManagerFor(makeBoard([makeLane('lane', 'Lane', [parent])]));
    const modifiers = getBoardModifiers({} as any, manager as any);

    modifiers.moveItemToTop([0, 0, 2]);
    expect(
      manager.state.children[0].children[0].children.map((item) => item.data.titleRaw)
    ).toEqual(['C', 'A', 'B']);

    modifiers.moveItemToBottom([0, 0, 0]);
    expect(
      manager.state.children[0].children[0].children.map((item) => item.data.titleRaw)
    ).toEqual(['A', 'B', 'C']);
  });

  it('sorts item children without dropping non-item lane nodes', () => {
    const markdownNode = {
      id: 'markdown',
      type: 'markdown',
      accepts: [],
      children: [],
      data: { markdown: 'lane note' },
    };
    const lane = makeLane('lane', 'Lane', [
      makeItem('b', 'B'),
      markdownNode as any,
      makeItem('a', 'A'),
    ]);

    const sorted = sortLaneChildren(lane, (a, b) => a.data.title.localeCompare(b.data.title));

    expect(sorted[1]).toBe(markdownNode);
    expect(
      sorted.map((child) => (child.type === DataTypes.Item ? child.data.titleRaw : child.type))
    ).toEqual(['A', 'markdown', 'B']);
  });
});
