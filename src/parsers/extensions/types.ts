import { Parent } from 'mdast';
import { FileMetadata } from 'src/components/types';

import { FileAccessor } from '../helpers/parser';

export interface ValueNode extends Parent {
  value: string;
}

export interface FileNode extends ValueNode {
  fileAccessor: FileAccessor;
  fileMetadata?: FileMetadata;
  fileMetadataOrder?: string[];
}
