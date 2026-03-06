import classcat from 'classcat';
import { ScrollContainer } from 'src/dnd/components/ScrollContainer';
import { SortPlaceholder } from 'src/dnd/components/SortPlaceholder';
import { Sortable } from 'src/dnd/components/Sortable';

import { Lanes } from '../components/Lane/Lane';
import { c } from '../components/helpers';
import { Board, DataTypes } from '../components/types';

const listScrollTriggers = [DataTypes.Item, DataTypes.Lane];
const listAccepts = [DataTypes.Lane];

export interface ListViewProps {
  viewId: string;
  boardData: Board;
  isLaneFormVisible: boolean;
}

export function ListView({ viewId, boardData, isLaneFormVisible }: ListViewProps) {
  return (
    <ScrollContainer
      id={viewId}
      className={classcat([
        c('board'),
        {
          [c('vertical')]: true,
          'is-adding-lane': isLaneFormVisible,
        },
      ])}
      triggerTypes={listScrollTriggers}
    >
      <div>
        <Sortable axis="vertical">
          <Lanes lanes={boardData.children} collapseDir="vertical" />
          <SortPlaceholder
            accepts={listAccepts}
            className={c('lane-placeholder')}
            index={boardData.children.length}
          />
        </Sortable>
      </div>
    </ScrollContainer>
  );
}
