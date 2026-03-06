// русский
import { Lang } from './en';

const lang: Partial<Lang> = {
  // main.ts
  'Open as kanban board': 'Открыть как Kanban-доску',
  'Create new board': 'Создать новую доску',
  'Archive completed cards in active board': 'Архивировать завершённые карточки в активной доске',
  'Error: current file is not a Kanban board': 'Ошибка: текущий файл не является Kanban-доской',
  'Convert empty note to Kanban': 'Конвертировать пустую заметку в Kanban',
  'Error: cannot create Kanban, the current note is not empty':
    'Ошибка: невозможно создать Kanban, текущая заметка не пуста',
  'New kanban board': 'Новая Kanban-доска',
  'Untitled Kanban': 'Безымянная Kanban-доска',
  'Toggle between Kanban and markdown mode': 'Переключиться между Kanban и markdown режимами',

  // KanbanView.tsx
  'Open as markdown': 'Открыть как markdown',
  'Open board settings': 'Открыть настройки доски',
  'Archive completed cards': 'Архивировать завершённые карточки',
  'Something went wrong': 'Что-то пошло не так',
  'You may wish to open as markdown and inspect or edit the file.':
    'Вы можете открыть файл как markdown и проверить или отредактировать его.',
  'Are you sure you want to archive all completed cards on this board?':
    'Вы уверены, что хотите архивировать все завершёённые карточки в этой доске?',

  // parser.ts
  Complete: 'Выполнено',
  Archive: 'Архивировать',
  'Invalid Kanban file: problems parsing frontmatter':
    'Неверный файл Kanban: не удаётся парсинг frontmatter',
  "I don't know how to interpret this line:": 'Я не знаю, как интерпретировать эту строку:',
  Untitled: 'Без имени', // auto-created column

  // settingHelpers.ts
  'Note: No template plugins are currently enabled.':
    'Примечание: В настоящее время ни один плагин шаблона не включен.',
  default: 'по умолчанию',
  'Search...': 'Найти...',

  // Settings.ts
  'New line trigger': 'Триггер новой строки',
  'Select whether Enter or Shift+Enter creates a new line. The opposite of what you choose will create and complete editing of cards and lists.':
    'Выберите, будет ли создаваться новая строка с помощью Enter или Shift+Enter. Противоположность тому, что вы выберете, позволит создать и завершить редактирование карточек и списков.',
  'Shift + Enter': 'Shift + Enter',
  Enter: 'Enter',
  'Prepend / append new cards': 'Положение новых карточек',
  'This setting controls whether new cards are added to the beginning or end of the list.':
    'Эта настройка управляет положением новых карточек, в начале или в конце списка.',
  Prepend: 'В начале',
  'Prepend (compact)': 'В начале (компактно)',
  Append: 'В конце',
  'These settings will take precedence over the default Kanban board settings.':
    'Эти настройки будут иметь приоритет над настройками доски Kanban по умолчанию.',
  'Set the default Kanban board settings. Settings can be overridden on a board-by-board basis.':
    'Установите настройки доски Kanban по умолчанию. Настройки можно переопределить для каждой доски.',
  'Note template': 'Шаблон заметки',
  'This template will be used when creating new notes from Kanban cards.':
    'Этот шаблон будет использоваться при создании новых заметок из карточек Kanban.',
  'No template': 'Нет шаблона',
  'Note folder': 'Директория заметок',
  'Notes created from Kanban cards will be placed in this folder. If blank, they will be placed in the default location for this vault.':
    'В эту папку будут помещены заметки, созданные из карточек Kanban. Если поле пустое, они будут помещены в папку по умолчанию для этого хранилища.',
  'Default folder': 'Директория по умолчанию',
  'List width': 'Ширина списка',
  'Enter a number to set the list width in pixels.':
    'Введите число, чтобы установить ширину списка в пикселях.',
  'Maximum number of archived cards': 'Максимальное количество архивированных карточек',
  "Archived cards can be viewed in markdown mode. This setting will begin removing old cards once the limit is reached. Setting this value to -1 will allow a board's archive to grow infinitely.":
    'Архивированные карточки можно просмотреть в режиме markdown. Эта настройка начнет удалять старые карточки после достижения лимита. Установка этого значения на -1 позволит архиву доски расти бесконечно.',
  'Display card checkbox': 'Показывать флажок карточки',
  'When toggled, a checkbox will be displayed with each card':
    'Когда включено, для каждой карточки будет показан флажок',
  'Reset to default': 'Сбросить настройки',
  'Hide card counts in list titles': 'Скрыть счётчики карточек в заголовках списка',
  'When toggled, card counts are hidden from the list title':
    'Когда включено, счётчики карточек скрыты в заголовках списка',
  'Kanban Plugin': 'Плагин Kanban',

  'Linked Page Metadata': 'Метаданные связанных страниц',
  'Display metadata for the first note linked within a card. Specify which metadata keys to display below. An optional label can be provided, and labels can be hidden altogether.':
    'Отображение метаданных для первой заметки, связанной с карточкой. Ниже укажите, какие ключи метаданных отображать. Можно указать дополнительную метку, либо скрыть метки полностью.',
  'Board Header Buttons': 'Кнопки заголовка доски',
  Tag: 'Метка',

  // MetadataSettings.tsx
  'Metadata key': 'Ключ метаданных',
  'Display label': 'Показать ярылк',
  'Hide label': 'Спрятать ярлык',
  'Drag to rearrange': 'Потяните, чтобы переупорядочить',
  Delete: 'Удалить',
  'Add key': 'Добавить ключ',
  'Field contains markdown': 'Поле содержит markdown',

  // components/Item/Item.tsx
  'More options': 'Больше настроек',
  Cancel: 'Отмена',

  // components/Item/ItemContent.tsx

  // components/Item/ItemForm.tsx
  'Card title...': 'Заголовок карточки...',
  'Add card': 'Добавить карточку',
  'Add a card': 'Добавить карточку',

  // components/Item/ItemMenu.ts
  'Edit card': 'Редактировать карточку',
  'New note from card': 'Новая заметка из карточки',
  'Archive card': 'Архивировать карточку',
  'Delete card': 'Удалить карточку',
  'Duplicate card': 'Дублировать карточку',
  'Split card': 'Разделить карточку',
  'Copy link to card': 'Скопировать ссылку на карточку',
  'Insert card before': 'Вставить карточку до',
  'Insert card after': 'Вставить карточку после',
  'Add label': 'Добавить ярлык',
  'Move to top': 'Переместить вверх',
  'Move to bottom': 'Переместить вниз',

  // components/Lane/LaneForm.tsx
  'Enter list title...': 'Введите заголовок списка...',
  'Mark cards in this list as complete': 'Отметить карточки в этом списке как завершённые',
  'Add list': 'Добавить список',
  'Add a list': 'Добавить список',

  // components/Lane/LaneHeader.tsx
  'Move list': 'Переместить список',
  Close: 'Закрыть',

  // components/Lane/LaneMenu.tsx
  'Are you sure you want to delete this list and all its cards?':
    'Вы уверены, что хотите удалить этот список и все его карточки?',
  'Yes, delete list': 'Да, удалить список',
  'Are you sure you want to archive this list and all its cards?':
    'Вы уверены, что хотите архивировать этот список и все его карточки?',
  'Yes, archive list': 'Да, архивировать список',
  'Are you sure you want to archive all cards in this list?':
    'Вы уверены, что хотите архивировать все карточки в этом списке?',
  'Yes, archive cards': 'Да, архивировать карточки',
  'Edit list': 'Редактировать список',
  'Archive cards': 'Архивировать карточки',
  'Archive list': 'Архивировать список',
  'Delete list': 'Удалить список',
  'Insert list before': 'Вставить список до',
  'Insert list after': 'Вставить список после',
  'Sort by card text': 'Сортировать по тексту карточки',

  // components/helpers/renderMarkdown.ts
  'Unable to find': 'Невозможно найти',
  'Open in default app': 'Открыть в приложении по умолчанию',

  // components/Editor/MarkdownEditor.tsx
  Submit: 'Сохранить',
};

export default lang;
