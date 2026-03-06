# Kanban View

View any markdown file as a kanban board. Headings become lanes, list items become cards.
Portable, non-destructive, zero file pollution.

This plugin is a modified fork of [Obsidian Kanban](https://github.com/mgmeyers/obsidian-kanban) by [Matthew Meyers](https://github.com/mgmeyers), adapted and extended to fit specific workflow needs.

## Features

### Multiple View Modes

Switch between three visualization modes at any time via the command palette, header buttons, or context menu:

- **Board View** — Traditional horizontal Kanban layout (Trello-style columns and cards)
- **List View** — Vertical stacked layout, ideal for mobile or compact displays
- **Table View** — Data grid with sortable columns and fuzzy filtering (TanStack React Table, from original plugin)

### Pure Markdown Format

- Boards are stored as standard markdown files — `##` headings define lanes, `- [ ]` items define cards
- No proprietary format; files remain readable and editable in any markdown editor
- Optional `kanban-plugin` frontmatter key for per-board settings
- Pure markdown boards store settings externally in data.json

### Card Operations

- Drag and drop cards within and between lanes
- Inline editing with full markdown support
- Split multi-line cards into separate cards
- Duplicate, move to top/bottom, or move to another lane
- Create linked notes from cards (with configurable templates and destination folders)
- Copy block reference links to cards
- Archive individual cards or all completed cards at once
- Configurable card checkbox display

### Lane Management

- Add, rename, reorder, and delete lanes
- Collapse/expand lanes (direction-aware: horizontal or vertical)
- Mark lanes as "completion" lanes (cards moved here are auto-completed)
- Sort cards within a lane by text, tags, or metadata fields
- Insert lanes before/after existing lanes
- Archive entire lanes with their cards

### Search and Filtering

- Real-time fuzzy search across all lanes (Ctrl/Cmd+F)
- Search highlights matching content in cards and metadata
- Fuzzy filter in table view across all columns

### Linked Page Metadata

- Display metadata from the first linked note in each card
- Configurable metadata keys with custom labels
- Support for hiding labels and rendering values as markdown

### Pretty Properties Integration

- Colored metadata pills using the [Pretty Properties](https://github.com/mnaoumov/obsidian-pretty-properties) plugin API
- Automatic color application for background and text on property values
- Real-time color updates when Pretty Properties CSS changes

### Settings System

- **Global settings** — Apply to all boards (via Settings > Plugins > Kanban View)
- **Per-board settings** — Override globals for individual boards (via board header settings icon)
- Configurable header buttons (add lane, archive, search, view switcher, settings, markdown toggle)
- External board settings manager for pure markdown boards

### Additional Features

- Ribbon icon for quick board creation
- Keyboard shortcuts (Ctrl+F for search, Escape to close forms, configurable Enter/Shift+Enter)
- Mobile-optimized interface with touch-friendly controls

## Markdown without Frontmatter

```markdown
## To Do

- [ ] First task
- [ ] Second task

## In Progress

- [ ] Current work

## Done

- [x] Completed task
```

Markdown boards can be opened as kanban via the command palette or context menu.

## Feature Comparison

Below is a comparison between this fork and the [original Obsidian Kanban](https://github.com/mgmeyers/obsidian-kanban) plugin:

| Feature | Original Kanban | Kanban View (This Fork) |
| --------- | - | - |
| **View Modes** | | |
| Board (horizontal columns) | Yes | Yes |
| List (vertical stacked) | Yes | Yes |
| Table (data grid) | Yes | Yes (TanStack React Table, from original) |
| **Architecture** | | |
| View component organization | Inline in Kanban.tsx | Extracted to BoardView, ListView, TableView files |
| Dynamic header buttons | Static | Dynamic, settings-driven |
| External board settings | No | Yes (zero file pollution for pure MD) |
| **Metadata & Properties** | | |
| Inline metadata fields | Yes | Yes (with emoji shorthand fields) |
| Linked page metadata display | Yes | Yes |
| Pretty Properties color integration | No | Yes (full API integration) |
| Metadata search highlighting | No | Yes |
| **Card Features** | | |
| Drag and drop | Yes | Yes |
| Inline editing | Yes | Yes |
| Card checkboxes | Yes | Yes |
| Split / duplicate cards | Yes | Yes |
| Create notes from cards | Yes | Yes |
| Copy block reference link | Yes | Yes |
| Archive system | Yes | Yes |
| **Lane Features** | | |
| Collapse/expand | Yes | Yes (direction-aware) |
| Sort by text/tags/metadata | Yes | Yes |
| Completion lanes | Yes | Yes |
| **Search** | | |
| Board search | Yes | Yes |
| Table fuzzy filtering | Yes | Yes |
| Search highlighting in metadata | No | Yes |
| **Table View** | | |
| TanStack React Table | Yes | Yes |
| Fuzzy sort and filter | Yes | Yes |
| Per-column sizing | Yes | Yes |
| **Date & Time** | | |
| Date picker on cards | Yes | No (removed) |
| Time support | Yes | No (removed) |
| Relative date display | Yes | No (removed) |
| **Tasks Plugin Integration** | | |
| Tasks autosuggest in cards | Yes | No (disabled) |
| Recurring tasks | Yes | No |
| Task date footer display | Yes | No |
| **Other** | | |
| Daily notes navigation | Yes | Removed |
| Native Obsidian editor in cards | Yes | Yes (extends MarkdownEditor with overrides) |
| Mobile support | Yes | Yes |
| Internationalization | Yes | Yes (inherited, partially maintained) |
| Per-board settings | Yes | Yes (+ external settings for pure MD) |
| Custom CSS classes | Yes | Yes |

### Summary of Differences

**Added in this fork:**

- Pretty Properties integration for colored metadata values
- View files extracted from Kanban.tsx into BoardView, ListView, TableView
- Dynamic header button system driven by settings
- External board settings manager for pure markdown boards
- Search query highlighting in metadata values

**Removed from original:**

- Date/time picker and date display features
- Tasks plugin integration (autosuggest disabled, recurring tasks, task date footer)
- Daily notes navigation via hotkey

## Installation

### Manual Installation

1. Download `main.js`, `styles.css`, and `manifest.json` from the latest release
2. Create a folder named `kanban-view` inside your vault's `.obsidian/plugins/` directory
3. Place the downloaded files into the `kanban-view` folder
4. Enable the plugin in Obsidian settings under Community Plugins

### Building from Source

```bash
git clone https://github.com/parkisutama/obsidian-kanban-view.git
cd obsidian-kanban-view
npm install
npm run build
```

## Acknowledgements

This plugin is a modified fork of [Obsidian Kanban](https://github.com/mgmeyers/obsidian-kanban) created by [Matthew Meyers (mgmeyers)](https://github.com/mgmeyers). The original plugin is one of the most popular Obsidian community plugins with over 2 million downloads.

This fork retains most of the original codebase, including the core markdown parsing engine, drag-and-drop system, state management architecture, lane and card operations, TanStack React Table integration, internationalization framework, and mobile support. Modifications were made to adapt the plugin to specific workflow requirements, including extracted view files, Pretty Properties integration, enhanced metadata handling, dynamic header buttons, and external board settings.

The inline metadata parser includes parsing patterns adapted from [obsidian-dataview](https://github.com/blacksmithgu/obsidian-dataview) (inline field syntax) and [obsidian-tasks](https://github.com/obsidian-tasks-group/obsidian-tasks) (emoji-shorthand fields), both licensed under MIT. These are used for metadata parsing only — there is no functional integration with either plugin.

## License

This project is licensed under the [GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.en.html), the same license as the original Obsidian Kanban plugin.
