import classcat from 'classcat';
import { isPlainObject } from 'is-plain-object';
import { TFile } from 'obsidian';
import { ComponentChild } from 'preact';
import { memo, useContext, useMemo } from 'preact/compat';
import { KanbanView } from 'src/KanbanView';
import { StateManager } from 'src/StateManager';

import { MarkdownRenderer } from '../MarkdownRenderer/MarkdownRenderer';
import { KanbanContext } from '../context';
import { c } from '../helpers';
import {
  enhanceWithPrettyProperties,
  getPrettyPropertiesStyle,
  ppDataAttrs,
} from '../prettyProperties';
import { FileMetadata, Item, PageData } from '../types';
import { Tags } from './ItemContent';

export interface ItemMetadataProps {
  item: Item;
  searchQuery?: string;
}

export function ItemMetadata({ item, searchQuery }: ItemMetadataProps) {
  const { stateManager } = useContext(KanbanContext);
  const { fileMetadata, fileMetadataOrder } = item.data.metadata;

  const metadata = useMemo(() => {
    if (!fileMetadata) return null;
    if (!Object.keys(fileMetadata).length) return null;

    return fileMetadata;
  }, [fileMetadata]);

  const order = useMemo(() => {
    return Array.from(new Set(fileMetadataOrder || []));
  }, [fileMetadataOrder]);

  if (!metadata) {
    return null;
  }

  return (
    <div className={c('item-metadata-wrapper')}>
      <MetadataTable metadata={metadata} order={order} searchQuery={searchQuery} />
    </div>
  );
}

interface MetadataValueProps {
  data: PageData;
  propertyKey: string;
  searchQuery?: string;
}

function getLinkFromObj(v: any, view: KanbanView) {
  if (typeof v !== 'object' || !v.path) return null;
  const viewApp = view.app;

  const file = viewApp.vault.getAbstractFileByPath(v.path);
  if (file && file instanceof TFile) {
    const link = viewApp.fileManager.generateMarkdownLink(
      file,
      view.file.path,
      v.subpath,
      v.display
    );
    return `${v.embed && link[0] !== '!' ? '!' : ''}${link}`;
  }

  return `${v.embed ? '!' : ''}[[${v.path}${v.display ? `|${v.display}` : ''}]]`;
}

export function anyToString(v: any, stateManager: StateManager): string {
  if (v == null) return '';
  if (isPlainObject(v) && v.value) v = v.value;
  if (v == null) return '';
  if (typeof v === 'string') return v;
  if (v instanceof TFile) return v.path;
  if (Array.isArray(v)) {
    return v.map((v2) => anyToString(v2, stateManager)).join(' ');
  }
  if (v.rrule) return v.toText();
  return `${v}`;
}

function pageDataToString(data: PageData, stateManager: StateManager): string {
  return anyToString(data.value, stateManager);
}

export function MetadataValue({ data, propertyKey, searchQuery }: MetadataValueProps) {
  const { view, stateManager } = useContext(KanbanContext);

  const renderChild = (v: any, sep?: string) => {
    const link = getLinkFromObj(v, view);
    const str = anyToString(v, stateManager);
    const isMatch = searchQuery && str.toLocaleLowerCase().contains(searchQuery);

    let content: ComponentChild;
    if (link || data.containsMarkdown) {
      content = (
        <MarkdownRenderer
          className="inline"
          markdownString={link ? link : str}
          searchQuery={searchQuery}
        />
      );
    } else if (isMatch) {
      content = <span className="is-search-match">{str}</span>;
    } else {
      content = str;
    }

    // Primary: VDOM-managed style prop — survives re-renders reliably
    const ppStyle = getPrettyPropertiesStyle(propertyKey, str);

    return (
      <>
        <span
          className={c('meta-pill')}
          {...ppDataAttrs(propertyKey, str)}
          style={ppStyle}
          ref={(el: HTMLSpanElement | null) => enhanceWithPrettyProperties(el, propertyKey, str)}
        >
          {content}
        </span>
        {sep ? <span>{sep}</span> : null}
      </>
    );
  };

  if (Array.isArray(data.value)) {
    return (
      <span className={classcat([c('meta-value'), 'mod-array'])}>
        {data.value.map((v, i, arr) => {
          return renderChild(v, i < arr.length - 1 ? ', ' : undefined);
        })}
      </span>
    );
  }

  return <span className={classcat([c('meta-value')])}>{renderChild(data.value)}</span>;
}

export interface MetadataTableProps {
  metadata: { [k: string]: PageData } | null;
  order?: string[];
  searchQuery?: string;
}

export const MetadataTable = memo(function MetadataTable({
  metadata,
  order,
  searchQuery,
}: MetadataTableProps) {
  const { stateManager } = useContext(KanbanContext);

  if (!metadata) return null;
  if (!order?.length) order = Object.keys(metadata);

  return (
    <table className={c('meta-table')}>
      <tbody>
        {order.map((k) => {
          const data = metadata[k];
          if (!data) return null;

          const isSearchMatch =
            searchQuery && (data.label || k).toLocaleLowerCase().includes(searchQuery);

          let valuePill: string | undefined;
          try {
            valuePill = pageDataToString(data, stateManager);
          } catch {
            valuePill = undefined;
          }

          return (
            <tr key={k} className={c('meta-row')}>
              {!data.shouldHideLabel && (
                <td
                  className={classcat([
                    c('meta-key'),
                    {
                      'is-search-match': isSearchMatch,
                    },
                  ])}
                  data-property-key={k}
                >
                  <span>{data.label || k}</span>
                </td>
              )}
              <td colSpan={data.shouldHideLabel ? 2 : 1} className={c('meta-value-wrapper')}>
                {k === 'tags' ? (
                  <Tags searchQuery={searchQuery} tags={data.value as string[]} alwaysShow />
                ) : (
                  <MetadataValue data={data} propertyKey={k} searchQuery={searchQuery} />
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
});
