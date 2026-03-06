// 简体中文
import { Lang } from './en';

const lang: Partial<Lang> = {
  // main.ts
  'Open as kanban board': '打开为看板',
  'Create new board': '创建新看板',
  'Archive completed cards in active board': '在当前看板中归档已完成卡片',
  'Error: current file is not a Kanban board': '错误：当前文件不是看板文件',
  'Convert empty note to Kanban': '转换空白笔记为看板',
  'Error: cannot create Kanban, the current note is not empty':
    '错误：无法转换当前文件，当前笔记不是空白笔记',
  'New kanban board': '新看板',
  'Untitled Kanban': '未命名看板',
  'Toggle between Kanban and markdown mode': '在看板和 Markdown 模式之间进行切换',

  // KanbanView.tsx
  'Open as markdown': '打开为 Markdown 文件',
  'Open board settings': '打开看板设置',
  'Archive completed cards': '归档已完成卡片',
  'Something went wrong': '出了点问题',
  'You may wish to open as markdown and inspect or edit the file.':
    '你可能希望以 Markdown 方式打开，并检查或编辑该文件。',
  'Are you sure you want to archive all completed cards on this board?':
    '你确定要将这个板块上所有已完成的卡片归档吗？',

  // parser.ts
  Complete: '完成',
  Archive: '归档',
  'Invalid Kanban file: problems parsing frontmatter':
    '无效的看板文件：解析 frontmatter 时出现问题',
  "I don't know how to interpret this line:": '我不知道如何解读这句话：',
  Untitled: '未命名', // auto-created column

  // settingHelpers.ts
  'Note: No template plugins are currently enabled.': '注意：当前没有启用模板插件',
  default: '默认',
  'Search...': '搜索……',

  // Settings.ts
  'New line trigger': '换行触发器',
  'Select whether Enter or Shift+Enter creates a new line. The opposite of what you choose will create and complete editing of cards and lists.':
    '选择 Enter 或是 Shift+Enter 来创建新行, 未选用的快捷键将被用于创建卡片和列，以及完成卡片、列的编辑。',
  'Shift + Enter': 'Shift + Enter',
  Enter: 'Enter',
  'Prepend / append new cards': '追加新卡片',
  'This setting controls whether new cards are added to the beginning or end of the list.':
    '设置新卡片追加到列头部或尾部。',
  Prepend: '头部',
  'Prepend (compact)': '头部 (紧凑)',
  Append: '尾部',
  'These settings will take precedence over the default Kanban board settings.':
    '当前看板设置将会覆盖默认的看板设置。',
  'Set the default Kanban board settings. Settings can be overridden on a board-by-board basis.':
    '更改默认的看板设置。为每个看板单独进行设置将覆盖默认设置。',
  'Note template': '笔记模板',
  'This template will be used when creating new notes from Kanban cards.':
    '从看板卡片创建新笔记时会使用该模板。',
  'No template': '没有模板',
  'Note folder': '笔记存放位置',
  'Notes created from Kanban cards will be placed in this folder. If blank, they will be placed in the default location for this vault.':
    '从看板卡片创建的笔记会放置到该文件夹中。如果为空，笔记将会放置到 Obsidian 的默认文件存放位置。',
  'Default folder': '默认文件夹',
  'List width': '列宽',
  'Enter a number to set the list width in pixels.': '输入一个像素值来设置列的宽度',
  'Maximum number of archived cards': '单个看板内已归档卡片的最大数量',
  "Archived cards can be viewed in markdown mode. This setting will begin removing old cards once the limit is reached. Setting this value to -1 will allow a board's archive to grow infinitely.":
    '已归档卡片可以在 Markdown 模式下查看。该设置将使已归档卡片在达到最大数量时删除旧卡。设置为 -1 可以永久保留所有归档卡片。',
  'Display card checkbox': '展示卡片复选框',
  'When toggled, a checkbox will be displayed with each card': '打开时，复选框会出现在每张卡片上',
  'Reset to default': '还原初始设置',
  'Hide card counts in list titles': '在列标题上隐藏卡片计数',
  'When toggled, card counts are hidden from the list title': '打开时，列标题上的卡片计数将隐藏',
  'Kanban Plugin': '看板插件',
  'Linked Page Metadata': '连接的页面元数据',
  'Display metadata for the first note linked within a card. Specify which metadata keys to display below. An optional label can be provided, and labels can be hidden altogether.':
    '展示卡片中第一个连接所对应的笔记元数据。请在下方指定哪些元数据可以展示。你可以选择展示哪些标志，所有标志都可以被隐藏。',
  'Board Header Buttons': '板头按钮',

  // MetadataSettings.tsx
  'Metadata key': '元数据参数名',
  'Display label': '展示标志',
  'Hide label': '隐藏标志',
  'Drag to rearrange': '拖动以重排顺序',
  Delete: '删除',
  'Add key': '添加参数名',
  'Field contains markdown': '字段包含 Markdown',

  // components/Item/Item.tsx
  'More options': '更多选项',
  Cancel: '取消',

  // components/Item/ItemContent.tsx

  // components/Item/ItemForm.tsx
  'Card title...': '卡片标题……',
  'Add card': '添加',
  'Add a card': '添加卡片',

  // components/Item/ItemMenu.ts
  'Edit card': '编辑卡片',
  'New note from card': '从卡片新建笔记',
  'Archive card': '归档卡片',
  'Delete card': '删除卡片',
  'Duplicate card': '复制卡片',
  'Split card': '分离卡片',
  'Copy link to card': '复制链接至卡片',
  'Insert card before': '在上方插入卡片',
  'Insert card after': '在下方插入卡片',
  'Move to top': '移到顶部',
  'Move to bottom': '移至底部',

  // components/Lane/LaneForm.tsx
  'Enter list title...': '输入新的列标题……',
  'Mark cards in this list as complete': '将该列设置为完成列',
  'Add list': '添加',
  'Add a list': '添加列',

  // components/Lane/LaneHeader.tsx
  'Move list': '移动列',
  Close: '关闭',

  // components/Lane/LaneMenu.tsx
  'Are you sure you want to delete this list and all its cards?':
    '你确定你要删除整列以及该列下所有卡片吗？',
  'Yes, delete list': '是，删除列',
  'Are you sure you want to archive this list and all its cards?':
    '你确定你要归档整列以及该列下所有卡片吗？',
  'Yes, archive list': '是, 归档列',
  'Are you sure you want to archive all cards in this list?': '你确认你要归档当前列的所有卡片吗？',
  'Yes, archive cards': '是，归档所有卡片',
  'Edit list': '编辑列',
  'Archive cards': '归档卡片',
  'Archive list': '归档列',
  'Delete list': '删除列',
  'Insert list before': '在上方插入列',
  'Insert list after': '在下方插入列',
  'Sort by card text': '以卡片文本排序',

  // components/helpers/renderMarkdown.ts
  'Unable to find': '无法找到',
  'Open in default app': '在默认应用中打开',

  // components/Editor/MarkdownEditor.tsx
  Submit: '提交',
};

export default lang;
