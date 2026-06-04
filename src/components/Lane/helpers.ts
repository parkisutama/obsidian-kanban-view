import { DataTypes, Item } from '../types';

export function laneTitleWithMaxItems(title: string, maxItems?: number) {
  if (!maxItems) return title;
  return `${title} (${maxItems})`;
}

export function setHeadingLevel(heading: string, level: number) {
  return `${'#'.repeat(level)} ${heading}`;
}

export function isItem(child: unknown): child is Item {
  return !!child && (child as Item).type === DataTypes.Item;
}

export function countTasks(children: Item[]): number {
  return children.reduce((count, child) => {
    if (!isItem(child)) return count;
    return count + 1 + countTasks(child.children || []);
  }, 0);
}
