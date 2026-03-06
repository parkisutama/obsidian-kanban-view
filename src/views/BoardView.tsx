import classcat from 'classcat';
import { ScrollContainer } from 'src/dnd/components/ScrollContainer';
import { SortPlaceholder } from 'src/dnd/components/SortPlaceholder';
import { Sortable } from 'src/dnd/components/Sortable';

import { Lanes } from '../components/Lane/Lane';
import { c } from '../components/helpers';
import { Board, DataTypes } from '../components/types';

const boardScrollTriggers = [DataTypes.Item, DataTypes.Lane];
const boardAccepts = [DataTypes.Lane];

export interface BoardViewProps {
  viewId: string;
  boardData: Board;
  isLaneFormVisible: boolean;
}

export function BoardView({ viewId, boardData, isLaneFormVisible }: BoardViewProps) {
  return (
    <ScrollContainer
      id={viewId}
      className={classcat([
        c('board'),
        {
          [c('horizontal')]: true,
          'is-adding-lane': isLaneFormVisible,
        },
      ])}
      triggerTypes={boardScrollTriggers}
    >
      <div>
        <Sortable axis="horizontal">
          <Lanes lanes={boardData.children} collapseDir="horizontal" />
          <SortPlaceholder
            accepts={boardAccepts}
            className={c('lane-placeholder')}
            index={boardData.children.length}
          />
        </Sortable>
      </div>
    </ScrollContainer>
  );
}
