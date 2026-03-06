// English

const en = {
  // main.ts
  'Open as kanban board': 'Kanban mode',
  'Create new board': 'Create new board',
  'Archive completed cards in active board': 'Archive completed cards in active board',
  'Error: current file is not a Kanban board': 'Error: current file is not a Kanban board',
  'Convert empty note to Kanban': 'Convert empty note to Kanban',
  'Error: cannot create Kanban, the current note is not empty':
    'Error: cannot create Kanban, the current note is not empty',
  'New kanban board': 'New kanban board',
  'Untitled Kanban': 'Untitled Kanban',
  'Toggle between Kanban and markdown mode': 'Toggle between Kanban and markdown mode',

  'Open current list as Kanban board': 'Open current list as Kanban board',

  'View as board': 'View as board',
  'View as list': 'View as list',
  'View as table': 'View as table',
  'Board view': 'Board view',

  // KanbanView.tsx
  'Open as markdown': 'Open as markdown',
  'Open board settings': 'Open board settings',
  'Archive completed cards': 'Archive completed cards',
  'Something went wrong': 'Something went wrong',
  'You may wish to open as markdown and inspect or edit the file.':
    'You may wish to open as markdown and inspect or edit the file.',
  'Are you sure you want to archive all completed cards on this board?':
    'Are you sure you want to archive all completed cards on this board?',

  // parser.ts
  Complete: 'Complete',
  Archive: 'Archive',
  'Invalid Kanban file: problems parsing frontmatter':
    'Invalid Kanban file: problems parsing frontmatter',
  "I don't know how to interpret this line:": "I don't know how to interpret this line:",
  Untitled: 'Untitled', // auto-created column

  // settingHelpers.ts
  'Note: No template plugins are currently enabled.':
    'Note: No template plugins are currently enabled.',
  default: 'default',
  'Search...': 'Search...',

  // Settings.ts
  'New line trigger': 'New line trigger',
  'Select whether Enter or Shift+Enter creates a new line. The opposite of what you choose will create and complete editing of cards and lists.':
    'Select whether Enter or Shift+Enter creates a new line. The opposite of what you choose will create and complete editing of cards and lists.',
  'Shift + Enter': 'Shift + Enter',
  Enter: 'Enter',
  'Prepend / append new cards': 'Prepend / append new cards',
  'This setting controls whether new cards are added to the beginning or end of the list.':
    'This setting controls whether new cards are added to the beginning or end of the list.',
  Prepend: 'Prepend',
  'Prepend (compact)': 'Prepend (compact)',
  Append: 'Append',
  'These settings will take precedence over the default Kanban board settings.':
    'These settings will take precedence over the default Kanban board settings.',
  'Set the default Kanban board settings. Settings can be overridden on a board-by-board basis.':
    'Set the default Kanban board settings. Settings can be overridden on a board-by-board basis.',
  'Note template': 'Note template',
  'This template will be used when creating new notes from Kanban cards.':
    'This template will be used when creating new notes from Kanban cards.',
  'No template': 'No template',
  'Note folder': 'Note folder',
  'Notes created from Kanban cards will be placed in this folder. If blank, they will be placed in the default location for this vault.':
    'Notes created from Kanban cards will be placed in this folder. If blank, they will be placed in the default location for this vault.',
  'Default folder': 'Default folder',
  'List width': 'List width',
  'Expand lists to full width in list view': 'Expand lists to full width in list view',
  'Enter a number to set the list width in pixels.':
    'Enter a number to set the list width in pixels.',
  'Maximum number of archived cards': 'Maximum number of archived cards',
  "Archived cards can be viewed in markdown mode. This setting will begin removing old cards once the limit is reached. Setting this value to -1 will allow a board's archive to grow infinitely.":
    "Archived cards can be viewed in markdown mode. This setting will begin removing old cards once the limit is reached. Setting this value to -1 will allow a board's archive to grow infinitely.",
  'Display card checkbox': 'Display card checkbox',
  'When toggled, a checkbox will be displayed with each card':
    'When toggled, a checkbox will be displayed with each card',
  'Reset to default': 'Reset to default',

  'Move tags to card footer': 'Move tags to card footer',
  "When toggled, tags will be displayed in the card's footer instead of the card's body.":
    "When toggled, tags will be displayed in the card's footer instead of the card's body.",

  'Hide card counts in list titles': 'Hide card counts in list titles',
  'When toggled, card counts are hidden from the list title':
    'When toggled, card counts are hidden from the list title',
  'Kanban Plugin': 'Kanban Plugin',
  'Tag click action': 'Tag click action',
  'Search Kanban Board': 'Search Kanban Board',
  'Search Obsidian Vault': 'Search Obsidian Vault',
  'This setting controls whether clicking the tags displayed below the card title opens the Obsidian search or the Kanban board search.':
    'This setting controls whether clicking the tags displayed below the card title opens the Obsidian search or the Kanban board search.',

  'Linked Page Metadata': 'Linked Page Metadata',
  'Inline Metadata': 'Inline Metadata',
  'Display metadata for the first note linked within a card. Specify which metadata keys to display below. An optional label can be provided, and labels can be hidden altogether.':
    'Display metadata for the first note linked within a card. Specify which metadata keys to display below. An optional label can be provided, and labels can be hidden altogether.',
  'Board Header Buttons': 'Board Header Buttons',
  Tag: 'Tag',

  // MetadataSettings.tsx
  'Metadata key': 'Metadata key',
  'Display label': 'Display label',
  'Hide label': 'Hide label',
  'Drag to rearrange': 'Drag to rearrange',
  Delete: 'Delete',
  'Add key': 'Add key',
  'Add tag': 'Add tag',
  'Field contains markdown': 'Field contains markdown',
  'Tag sort order': 'Tag sort order',
  'Set an explicit sort order for the specified tags.':
    'Set an explicit sort order for the specified tags.',

  // components/Table.tsx
  List: 'List',
  Card: 'Card',
  Tags: 'Tags',

  Priority: 'Priority',
  Recurrence: 'Recurrence',
  'Depends on': 'Depends on',
  ID: 'ID',

  // components/Item/Item.tsx
  'More options': 'More options',
  Cancel: 'Cancel',
  Done: 'Done',
  Save: 'Save',

  // components/Item/ItemContent.tsx

  // components/Item/ItemForm.tsx
  'Card title...': 'Card title...',
  'Add card': 'Add card',
  'Add a card': 'Add a card',

  // components/Item/ItemMenu.ts
  'Edit card': 'Edit card',
  'New note from card': 'New note from card',
  'Archive card': 'Archive card',
  'Delete card': 'Delete card',
  'Duplicate card': 'Duplicate card',
  'Split card': 'Split card',
  'Copy link to card': 'Copy link to card',
  'Insert card before': 'Insert card before',
  'Insert card after': 'Insert card after',
  'Add label': 'Add label',
  'Move to top': 'Move to top',
  'Move to bottom': 'Move to bottom',
  'Move to list': 'Move to list',

  // components/Lane/LaneForm.tsx
  'Enter list title...': 'Enter list title...',
  'Mark cards in this list as complete': 'Mark cards in this list as complete',
  'Add list': 'Add list',
  'Add a list': 'Add a list',

  // components/Lane/LaneHeader.tsx
  'Move list': 'Move list',
  Close: 'Close',

  // components/Lane/LaneMenu.tsx
  'Are you sure you want to delete this list and all its cards?':
    'Are you sure you want to delete this list and all its cards?',
  'Yes, delete list': 'Yes, delete list',
  'Are you sure you want to archive this list and all its cards?':
    'Are you sure you want to archive this list and all its cards?',
  'Yes, archive list': 'Yes, archive list',
  'Are you sure you want to archive all cards in this list?':
    'Are you sure you want to archive all cards in this list?',
  'Yes, archive cards': 'Yes, archive cards',
  'Edit list': 'Edit list',
  'Archive cards': 'Archive cards',
  'Archive list': 'Archive list',
  'Delete list': 'Delete list',
  'Insert list before': 'Insert list before',
  'Insert list after': 'Insert list after',
  'Sort by card text': 'Sort by card text',
  'Sort by tags': 'Sort by tags',
  'Sort by': 'Sort by',

  // components/helpers/renderMarkdown.ts
  'Unable to find': 'Unable to find',
  'Open in default app': 'Open in default app',

  // components/Editor/MarkdownEditor.tsx
  Submit: 'Submit',

};

export type Lang = typeof en;
export default en;
