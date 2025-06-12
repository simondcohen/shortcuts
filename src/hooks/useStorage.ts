import { useState, useEffect, useRef } from 'react';
import { Item, Link, Snippet, Folder } from '../types';
import { getItems as getLocalItems, saveItems as saveLocalItems, generateId } from '../utils/storage';
import {
  isFileSystemSupported,
  getStoredHandle,
  storeHandle,
  pickFile,
  readFileItems,
  writeFileItems,
} from '../utils/fileStorage';
import { wouldCreateLoop, getAllChildIds } from '../utils/folderUtils';

const mergeItems = (localItems: Item[], fileItems: Item[]): Item[] => {
  const map = new Map<string, Item>();
  fileItems.forEach(i => map.set(i.id, i));
  localItems.forEach(i => {
    if (!map.has(i.id)) {
      map.set(i.id, i);
    }
  });
  return Array.from(map.values());
};

export const useStorage = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [needsFile, setNeedsFile] = useState(false);
  const fileHandleRef = useRef<FileSystemFileHandle | null>(null);
  const lastModifiedRef = useRef<number>(0);
  const pollRef = useRef<number>();

  useEffect(() => {
    const init = async () => {
      if (isFileSystemSupported()) {
        const handle = await getStoredHandle();
        if (handle) {
          fileHandleRef.current = handle;
          const { items: fileItems, lastModified } = await readFileItems(handle);
          setItems(fileItems);
          lastModifiedRef.current = lastModified;
          startPolling();
        } else {
          const local = getLocalItems();
          setItems(local);
          setNeedsFile(true);
        }
      } else {
        const local = getLocalItems();
        setItems(local);
      }
    };
    init();
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const startPolling = () => {
    if (!fileHandleRef.current) return;
    pollRef.current = window.setInterval(async () => {
      if (!fileHandleRef.current) return;
      try {
        const file = await fileHandleRef.current.getFile();
        if (file.lastModified > lastModifiedRef.current) {
          const text = await file.text();
          const fileItems: Item[] = text ? JSON.parse(text) : [];
          setItems(prev => mergeItems(prev, fileItems));
          saveLocalItems(fileItems);
          lastModifiedRef.current = file.lastModified;
        }
      } catch (e) {
        console.error(e);
      }
    }, 1500);
  };

  const ensureFile = async () => {
    if (fileHandleRef.current) return;
    const handle = await pickFile();
    if (!handle) return;
    fileHandleRef.current = handle;
    await storeHandle(handle);
    const { items: fileItems, lastModified } = await readFileItems(handle);
    setItems(fileItems);
    lastModifiedRef.current = lastModified;
    startPolling();
  };

  const saveAll = async (newItems: Item[]) => {
    setItems(newItems);
    if (fileHandleRef.current) {
      try {
        const lm = await writeFileItems(fileHandleRef.current, newItems);
        lastModifiedRef.current = lm;
      } catch (e) {
        console.error(e);
      }
    }
    saveLocalItems(newItems);
  };

  const addItem = (item: Omit<Link | Snippet | Folder, 'id' | 'createdAt'>) => {
    let newItem: Item;
    if (item.type === 'folder') {
      newItem = {
        ...(item as Folder),
        id: generateId(),
        createdAt: Date.now(),
        isOpen: (item as Folder).isOpen ?? true,
      } as Folder;
    } else {
      newItem = { ...item, id: generateId(), createdAt: Date.now() } as Item;
    }
    if (item.type === 'folder' && wouldCreateLoop(items, newItem.id, item.parentId)) {
      throw new Error('This would create a folder loop');
    }
    saveAll([...items, newItem]);
    return newItem;
  };

  const updateItem = (itemId: string, updates: Partial<Omit<Item, 'id' | 'type'>>) => {
    const updated = items.map(item => {
      if (item.id === itemId) {
        const upd = { ...item, ...updates } as Item;
        if (
          item.type === 'folder' &&
          'parentId' in updates &&
          wouldCreateLoop(items, item.id, updates.parentId as string | null)
        ) {
          throw new Error('This would create a folder loop');
        }
        return upd;
      }
      return item;
    });
    saveAll(updated);
  };

  const deleteItem = (itemId: string) => {
    const childIds = getAllChildIds(items, itemId);
    const remaining = items.filter(item => item.id !== itemId && !childIds.includes(item.id));
    saveAll(remaining);
  };

  const toggleFolder = (folderId: string) => {
    const updated = items.map(item =>
      item.id === folderId && item.type === 'folder' ? { ...item, isOpen: !item.isOpen } : item
    );
    saveAll(updated);
  };

  const importItems = (newItems: Item[]) => {
    const existingIds = new Set(items.map(i => i.id));
    const idMap = new Map<string, string>();
    const processed: Item[] = [];
    for (const raw of newItems) {
      const origId = raw.id;
      const needsNew = !origId || existingIds.has(origId);
      const newId = needsNew ? generateId() : origId;
      if (needsNew) idMap.set(origId, newId);
      if (raw.type === 'folder') {
        const item = raw as Folder;
        processed.push({
          ...item,
          id: newId,
          isOpen: item.isOpen ?? true,
          createdAt: item.createdAt || Date.now(),
        });
      } else if (raw.type === 'link') {
        const item = raw as Link;
        processed.push({ ...item, id: newId, createdAt: item.createdAt || Date.now() });
      } else if (raw.type === 'snippet') {
        const item = raw as Snippet;
        processed.push({ ...item, id: newId, createdAt: item.createdAt || Date.now() });
      }
    }
    const final: Item[] = [];
    for (const item of processed) {
      if (item.parentId && idMap.has(item.parentId)) {
        final.push({ ...item, parentId: idMap.get(item.parentId)! });
      } else {
        final.push(item);
      }
    }
    final.forEach(item => {
      if (item.type === 'folder' && wouldCreateLoop(final, item.id, item.parentId)) {
        throw new Error(`Import would create a folder loop with folder "${item.title}"`);
      }
    });
    saveAll([...items, ...final]);
  };

  return {
    items,
    addItem,
    updateItem,
    deleteItem,
    toggleFolder,
    importItems,
    needsFile,
    pickFile: ensureFile,
  };
};

