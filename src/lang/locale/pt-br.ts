// Português do Brasil
// Brazilian Portuguese
import { Lang } from './en';

const lang: Partial<Lang> = {
  // main.ts
  'Create new board': 'Criar um novo quadro',
  'Archive completed cards in active board': 'Arquivar cartões concluídos no quadro ativo',
  'Error: current file is not a Kanban board': 'Erro: o arquivo atual não é um quadro Kanban',
  'Convert empty note to Kanban': 'Converter nota vazia em Kanban',
  'Error: cannot create Kanban, the current note is not empty':
    'Erro: não é possível criar o quadro Kanban, a nota atual não está vazia',
  'Untitled Kanban': 'Kanban sem título',
  'Toggle between Kanban and markdown mode': 'Alternar entre os modos Kanban e Markdown',

  // KanbanView.tsx
  'Open as markdown': 'Abrir como markdown',
  'Open board settings': 'Abrir configurações do quadro Kanban',
  'Archive completed cards': 'Arquivar cartões concluídos',

  // parser.ts
  Complete: 'Concluído',
  Archive: 'Arquivado',

  // settingHelpers.ts
  'Note: No template plugins are currently enabled.':
    'Nota: Não há plug-ins de modelo habilitados no momento.',
  default: 'padrão',
  'Search...': 'Pesquisar...',

  // Settings.ts
  'These settings will take precedence over the default Kanban board settings.':
    'Essas configurações sobrescreverão as configurações padrão do quadro Kanban',
  'Set the default Kanban board settings. Settings can be overridden on a board-by-board basis.':
    'Defina as configurações padrão do quadro Kanban. Cada quadro Kanban pode ter sua própria configuração.',
  'Note template': 'Modelo de nota',
  'This template will be used when creating new notes from Kanban cards.':
    'Este modelo será usado quando uma nova nota Kanban for criada.',
  'No template': 'Sem modelo',
  'Note folder': 'Pasta de notas',
  'Notes created from Kanban cards will be placed in this folder. If blank, they will be placed in the default location for this vault.':
    'As notas criadas pelos links dos cartões Kanban serão colocadas nesta pasta. Se estiver em branco, serão colocadas no local configurado como padrão deste cofre.',
  'Default folder': 'Pasta padrão',
  'Maximum number of archived cards': 'Quantidade máxima de cartões arquivados',
  "Archived cards can be viewed in markdown mode. This setting will begin removing old cards once the limit is reached. Setting this value to -1 will allow a board's archive to grow infinitely.":
    'Os cartões arquivados podem ser vistos no modo Markdown. Esta configuração excluirá os cartões antigos assim que o limite for atingido. Inserir o valor -1 retira o limite para cartões arquivados.',
  'Display card checkbox': 'Exibe uma caixa de seleção do cartão',
  'When toggled, a checkbox will be displayed with each card':
    'Quando ativada, uma caixa de seleção será exibida em cada cartão.',
  'Reset to default': 'Redefinir configurações padrão',
  'Kanban Plugin': 'Plugin Kanban',
  'Linked Page Metadata': "Metadados de páginas 'lincadas'",
  'Display metadata for the first note linked within a card. Specify which metadata keys to display below. An optional label can be provided, and labels can be hidden altogether.':
    "Exibe metadados para a primeira nota 'lincada' em um cartão. Especifique abaixo quais metadados serão exibidos. Um rótulo opcional pode ser fornecido e os rótulos podem ser ocultados completamente.",

  // MetadataSettings.tsx
  'Metadata key': 'Metadado',
  'Display label': 'Descrição personalizada',
  'Hide label': 'Ocultar',
  'Drag to rearrange': 'Arraste para reorganizar',
  Delete: 'Excluir',
  'Add key': 'Adicionar metadado',

  // components/Item/Item.tsx
  'More options': 'Mais opções',
  Cancel: 'Cancelar',

  // components/Item/ItemContent.tsx

  // components/Item/ItemForm.tsx
  'Card title...': 'Título do item...',
  'Add card': 'Adicionar Item',
  'Add a card': 'Adicione um cartão',

  // components/Item/ItemMenu.ts
  'Edit card': 'Editar cartão',
  'New note from card': 'Nova nota do cartão',
  'Archive card': 'Arquivar cartão',
  'Delete card': 'Excluir cartão',
  'Duplicate card': 'Duplicate card',

  // components/Lane/LaneForm.tsx
  'Enter list title...': 'Insira o título da lista...',
  'Mark cards in this list as complete': 'Marcar os itens nesta lista como concluídos',
  'Add list': 'Adicionar lista',
  'Add a list': 'Adicionar uma lista',

  // components/Lane/LaneHeader.tsx
  'Move list': 'Mover lista',
  Close: 'Fechar',

  // components/Lane/LaneMenu.tsx
  'Are you sure you want to delete this list and all its cards?':
    'Tem certeza de que deseja excluir esta lista e todos os seus cartões?',
  'Yes, delete list': 'Sim, excluir esta lista',
  'Are you sure you want to archive this list and all its cards?':
    'Tem certeza de que deseja arquivar esta lista e todos os seus cartões?',
  'Yes, archive list': 'Sim, arquivar esta lista',
  'Are you sure you want to archive all cards in this list?':
    'Tem certeza de que deseja arquivar todos os cartões desta lista?',
  'Yes, archive cards': 'Sim, arquivar cartões',
  'Edit list': 'Editar lista',
  'Archive cards': 'Arquivar cartões',
  'Archive list': 'Arquivar lista',
  'Delete list': 'Excluir lista',
};

export default lang;
