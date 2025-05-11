export type ItemType = 'link' | 'snippet' | 'folder';

export interface BaseItem {
  id: string;
  title: string;
  type: ItemType;
  parentId: string | null; // null means root level
  createdAt: number;
}

export interface Link extends BaseItem {
  type: 'link';
  url: string;
}

export interface Snippet extends BaseItem {
  type: 'snippet';
  content: string;
  url?: string;  // Optional URL for the snippet
}

export interface Folder extends BaseItem {
  type: 'folder';
  isOpen: boolean;
}

export type Item = Link | Snippet | Folder;