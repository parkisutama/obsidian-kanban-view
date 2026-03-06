/**
 * Tests for linked-page metadata extraction via getLinkedPageMetadata.
 *
 * Verifies that both tags AND non-tag properties (status, priority, etc.)
 * are correctly extracted from a linked file's frontmatter cache.
 */

import { describe, expect, it, vi } from 'vitest';
import { TFile } from 'obsidian';
import { getLinkedPageMetadata } from 'src/parsers/common';
import { astToUnhydratedBoard } from 'src/parsers/formats/list';
import { parseMarkdown } from 'src/parsers/parseMarkdown';
import { createMockStateManager } from 'tests/helpers/mockStateManager';
import { DataKey } from 'src/components/types';

function makeDataKey(metadataKey: string, label = ''): DataKey {
    return {
        metadataKey,
        label: label || metadataKey,
        shouldHideLabel: false,
        containsMarkdown: false,
    };
}

describe('getLinkedPageMetadata', () => {
    it('returns empty when metadata-keys is empty', () => {
        const sm = createMockStateManager({ settings: { 'metadata-keys': [] } }) as any;
        const file = new TFile('linked.md');
        const result = getLinkedPageMetadata(sm, file);
        expect(result).toEqual({});
    });

    it('returns empty when linkedFile is null', () => {
        const sm = createMockStateManager({
            settings: { 'metadata-keys': [makeDataKey('tags')] },
        }) as any;
        const result = getLinkedPageMetadata(sm, null);
        expect(result).toEqual({});
    });

    it('returns empty when cache is null', () => {
        const sm = createMockStateManager({
            settings: { 'metadata-keys': [makeDataKey('tags')] },
        }) as any;
        // getFileCache returns null by default in mock
        const file = new TFile('linked.md');
        const result = getLinkedPageMetadata(sm, file);
        expect(result).toEqual({});
    });

    it('extracts tags from cache.tags (inline body tags)', () => {
        const sm = createMockStateManager({
            settings: { 'metadata-keys': [makeDataKey('tags')] },
        }) as any;

        const file = new TFile('linked.md');

        // Mock getFileCache to return body tags
        sm.app.metadataCache.getFileCache = (_f: TFile) => ({
            tags: [
                { tag: '#project', position: {} },
                { tag: '#important', position: {} },
            ],
        });

        const result = getLinkedPageMetadata(sm, file);
        expect(result.fileMetadata).toBeDefined();
        expect(result.fileMetadata!.tags).toBeDefined();
        expect(result.fileMetadata!.tags.value).toEqual(['#important', '#project']);
        expect(result.fileMetadataOrder).toContain('tags');
    });

    it('extracts non-tag frontmatter properties (status, priority)', () => {
        const sm = createMockStateManager({
            settings: {
                'metadata-keys': [
                    makeDataKey('status'),
                    makeDataKey('priority'),
                ],
            },
        }) as any;

        const file = new TFile('linked.md');

        sm.app.metadataCache.getFileCache = (_f: TFile) => ({
            frontmatter: {
                status: 'active',
                priority: 'high',
            },
        });

        const result = getLinkedPageMetadata(sm, file);

        expect(result.fileMetadata).toBeDefined();
        expect(result.fileMetadataOrder).toEqual(['status', 'priority']);
        expect(result.fileMetadata!.status.value).toBe('active');
        expect(result.fileMetadata!.priority.value).toBe('high');
    });

    it('extracts BOTH tags and non-tag properties together', () => {
        const sm = createMockStateManager({
            settings: {
                'metadata-keys': [
                    makeDataKey('tags'),
                    makeDataKey('status'),
                    makeDataKey('priority'),
                ],
            },
        }) as any;

        const file = new TFile('linked.md');

        sm.app.metadataCache.getFileCache = (_f: TFile) => ({
            tags: [{ tag: '#work', position: {} }],
            frontmatter: {
                tags: ['project'],
                status: 'in-progress',
                priority: 'medium',
            },
        });

        const result = getLinkedPageMetadata(sm, file);

        expect(result.fileMetadata).toBeDefined();
        expect(result.fileMetadataOrder).toEqual(['tags', 'status', 'priority']);

        // Tags should include both inline and frontmatter tags
        expect(result.fileMetadata!.tags.value).toContain('#work');
        expect(result.fileMetadata!.tags.value).toContain('#project');

        // Non-tag properties
        expect(result.fileMetadata!.status.value).toBe('in-progress');
        expect(result.fileMetadata!.priority.value).toBe('medium');
    });

    it('skips properties with null/undefined/empty values', () => {
        const sm = createMockStateManager({
            settings: {
                'metadata-keys': [
                    makeDataKey('status'),
                    makeDataKey('empty_str'),
                    makeDataKey('null_val'),
                    makeDataKey('undef_val'),
                    makeDataKey('empty_arr'),
                ],
            },
        }) as any;

        const file = new TFile('linked.md');

        sm.app.metadataCache.getFileCache = (_f: TFile) => ({
            frontmatter: {
                status: 'active',
                empty_str: '',
                null_val: null,
                // undef_val not present => undefined
                empty_arr: [],
            },
        });

        const result = getLinkedPageMetadata(sm, file);

        expect(result.fileMetadata).toBeDefined();
        expect(result.fileMetadataOrder).toEqual(['status']);
        expect(result.fileMetadata!.status.value).toBe('active');
        expect(result.fileMetadata!.empty_str).toBeUndefined();
        expect(result.fileMetadata!.null_val).toBeUndefined();
        expect(result.fileMetadata!.undef_val).toBeUndefined();
        expect(result.fileMetadata!.empty_arr).toBeUndefined();
    });

    it('handles array property values', () => {
        const sm = createMockStateManager({
            settings: {
                'metadata-keys': [makeDataKey('assignees')],
            },
        }) as any;

        const file = new TFile('linked.md');

        sm.app.metadataCache.getFileCache = (_f: TFile) => ({
            frontmatter: {
                assignees: ['Alice', 'Bob'],
            },
        });

        const result = getLinkedPageMetadata(sm, file);

        expect(result.fileMetadata).toBeDefined();
        expect(result.fileMetadata!.assignees.value).toEqual(['Alice', 'Bob']);
    });

    it('handles number and boolean property values', () => {
        const sm = createMockStateManager({
            settings: {
                'metadata-keys': [
                    makeDataKey('count'),
                    makeDataKey('done'),
                ],
            },
        }) as any;

        const file = new TFile('linked.md');

        sm.app.metadataCache.getFileCache = (_f: TFile) => ({
            frontmatter: {
                count: 42,
                done: false,
            },
        });

        const result = getLinkedPageMetadata(sm, file);

        expect(result.fileMetadata).toBeDefined();
        expect(result.fileMetadata!.count.value).toBe(42);
        expect(result.fileMetadata!.done.value).toBe(false);
    });

    it('resolves wikilink string values to TFile when possible', () => {
        const sm = createMockStateManager({
            settings: {
                'metadata-keys': [makeDataKey('project')],
            },
        }) as any;

        const linkedFile = new TFile('linked.md');
        const projectFile = new TFile('projects/MyProject.md');

        sm.app.metadataCache.getFileCache = (_f: TFile) => ({
            frontmatter: {
                project: '[[MyProject]]',
            },
            frontmatterLinks: [
                { key: 'project', link: 'MyProject', original: '[[MyProject]]' },
            ],
        });

        sm.app.metadataCache.getFirstLinkpathDest = (link: string, _source: string) => {
            if (link === 'MyProject') return projectFile;
            return null;
        };

        const result = getLinkedPageMetadata(sm, linkedFile);

        expect(result.fileMetadata).toBeDefined();
        expect(result.fileMetadata!.project.value).toBe(projectFile);
    });

    it('keeps wikilink string when file cannot be resolved', () => {
        const sm = createMockStateManager({
            settings: {
                'metadata-keys': [makeDataKey('project')],
            },
        }) as any;

        const file = new TFile('linked.md');

        sm.app.metadataCache.getFileCache = (_f: TFile) => ({
            frontmatter: {
                project: '[[NonExistent]]',
            },
            frontmatterLinks: [
                { key: 'project', link: 'NonExistent', original: '[[NonExistent]]' },
            ],
        });

        sm.app.metadataCache.getFirstLinkpathDest = () => null;

        const result = getLinkedPageMetadata(sm, file);

        expect(result.fileMetadata).toBeDefined();
        // Value should still be the string, not resolved to TFile
        expect(result.fileMetadata!.project.value).toBe('[[NonExistent]]');
    });

    it('matches frontmatter keys case-insensitively', () => {
        const sm = createMockStateManager({
            settings: {
                'metadata-keys': [
                    makeDataKey('Status'),
                    makeDataKey('PRIORITY'),
                ],
            },
        }) as any;

        const file = new TFile('linked.md');

        sm.app.metadataCache.getFileCache = (_f: TFile) => ({
            frontmatter: {
                status: 'active',
                priority: 'high',
            },
        });

        const result = getLinkedPageMetadata(sm, file);

        expect(result.fileMetadata).toBeDefined();
        expect(result.fileMetadataOrder).toEqual(['Status', 'PRIORITY']);
        expect(result.fileMetadata!.Status.value).toBe('active');
        expect(result.fileMetadata!.PRIORITY.value).toBe('high');
    });

    it('matches frontmatter keys when YAML has uppercase and config has lowercase', () => {
        const sm = createMockStateManager({
            settings: {
                'metadata-keys': [makeDataKey('status')],
            },
        }) as any;

        const file = new TFile('linked.md');

        sm.app.metadataCache.getFileCache = (_f: TFile) => ({
            frontmatter: {
                Status: 'active',
            },
        });

        const result = getLinkedPageMetadata(sm, file);

        expect(result.fileMetadata).toBeDefined();
        expect(result.fileMetadata!.status.value).toBe('active');
    });

    it('resolves wikilink with case-insensitive key matching', () => {
        const sm = createMockStateManager({
            settings: {
                'metadata-keys': [makeDataKey('Project')],
            },
        }) as any;

        const linkedFile = new TFile('linked.md');
        const projectFile = new TFile('projects/MyProject.md');

        sm.app.metadataCache.getFileCache = (_f: TFile) => ({
            frontmatter: {
                project: '[[MyProject]]',
            },
            frontmatterLinks: [
                { key: 'project', link: 'MyProject', original: '[[MyProject]]' },
            ],
        });

        sm.app.metadataCache.getFirstLinkpathDest = (link: string, _source: string) => {
            if (link === 'MyProject') return projectFile;
            return null;
        };

        const result = getLinkedPageMetadata(sm, linkedFile);

        expect(result.fileMetadata).toBeDefined();
        expect(result.fileMetadata!.Project.value).toBe(projectFile);
    });

    it('handles Tags with different casing', () => {
        const sm = createMockStateManager({
            settings: {
                'metadata-keys': [makeDataKey('Tags')],
            },
        }) as any;

        const file = new TFile('linked.md');

        sm.app.metadataCache.getFileCache = (_f: TFile) => ({
            tags: [{ tag: '#inline', position: {} }],
            frontmatter: {
                tags: ['yaml-tag'],
            },
        });

        const result = getLinkedPageMetadata(sm, file);

        expect(result.fileMetadata).toBeDefined();
        expect(result.fileMetadata!.tags).toBeDefined();
        expect(result.fileMetadata!.tags.value).toContain('#inline');
        expect(result.fileMetadata!.tags.value).toContain('#yaml-tag');
    });
});

describe('Full board parse — linked page metadata integration', () => {
    it('items with [[wikilink]] get fileMetadata for tags AND properties', () => {
        const linkedFile = new TFile('ProjectA.md');

        const sm = createMockStateManager({
            settings: {
                'metadata-keys': [
                    makeDataKey('tags'),
                    makeDataKey('status'),
                    makeDataKey('priority'),
                ],
            },
        }) as any;

        // Mock: resolve [[ProjectA]] to the TFile
        sm.app.metadataCache.getFirstLinkpathDest = (link: string, _source: string) => {
            if (link === 'ProjectA') return linkedFile;
            return null;
        };

        // Mock: return metadata for ProjectA.md
        sm.app.metadataCache.getFileCache = (f: TFile) => {
            if (f === linkedFile) {
                return {
                    tags: [{ tag: '#inline-tag', position: { start: {}, end: {} } }],
                    frontmatter: {
                        tags: ['frontmatter-tag'],
                        status: 'active',
                        priority: 'high',
                    },
                };
            }
            return null;
        };

        const md = '## To Do\n- [ ] [[ProjectA]]\n';
        const { ast, settings, frontmatter } = parseMarkdown(sm, md, {});
        const board = astToUnhydratedBoard(sm, settings, frontmatter, ast, md);

        expect(board.children).toHaveLength(1);
        const lane = board.children[0];
        expect(lane.children).toHaveLength(1);

        const item = lane.children[0];
        const meta = item.data.metadata;

        // fileMetadata should exist and have tags, status, priority
        expect(meta.fileMetadata).toBeDefined();
        expect(meta.fileMetadataOrder).toEqual(['tags', 'status', 'priority']);

        // Tags
        expect(meta.fileMetadata!.tags).toBeDefined();
        expect(meta.fileMetadata!.tags.value).toContain('#inline-tag');
        expect(meta.fileMetadata!.tags.value).toContain('#frontmatter-tag');

        // Non-tag properties
        expect(meta.fileMetadata!.status).toBeDefined();
        expect(meta.fileMetadata!.status.value).toBe('active');

        expect(meta.fileMetadata!.priority).toBeDefined();
        expect(meta.fileMetadata!.priority.value).toBe('high');
    });

    it('items without wikilinks have no fileMetadata', () => {
        const sm = createMockStateManager({
            settings: {
                'metadata-keys': [
                    makeDataKey('status'),
                ],
            },
        }) as any;

        const md = '## To Do\n- [ ] Plain task\n';
        const { ast, settings, frontmatter } = parseMarkdown(sm, md, {});
        const board = astToUnhydratedBoard(sm, settings, frontmatter, ast, md);

        const item = board.children[0].children[0];
        expect(item.data.metadata.fileMetadata).toBeUndefined();
    });
});
