import { useState, useEffect } from 'react';
import { getItems, saveItems } from '../utils/storage';
import { Item, Link, Snippet, Folder } from '../types';
import { generateId } from '../utils/storage';
import { wouldCreateLoop, getAllChildIds } from '../utils/folderUtils';

export const useLocalStorage = () => {
  const [items, setItems] = useState<Item[]>([]);

  // Load items from local storage on initial render
  useEffect(() => {
    const storedItems = getItems();
    setItems(storedItems);
  }, []);

  // Save items to local storage whenever they change
  useEffect(() => {
    if (items.length > 0) {
      saveItems(items);
    }
  }, [items]);

  // Add a new item
  const addItem = (item: Omit<Link | Snippet | Folder, 'id' | 'createdAt'>) => {
    const newItem: Item = {
      ...item,
      id: generateId(),
      createdAt: Date.now(),
    };
    
    // Prevent folder loops
    if (item.type === 'folder' && wouldCreateLoop(items, newItem.id, item.parentId)) {
      throw new Error('This would create a folder loop');
    }
    
    setItems(prevItems => [...prevItems, newItem]);
    return newItem;
  };

  // Update an existing item
  const updateItem = (itemId: string, updates: Partial<Omit<Item, 'id' | 'type'>>) => {
    setItems(prevItems => {
      const updatedItems = prevItems.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, ...updates };
          
          // Prevent folder loops
          if (
            item.type === 'folder' && 
            'parentId' in updates && 
            wouldCreateLoop(prevItems, item.id, updates.parentId as string | null)
          ) {
            throw new Error('This would create a folder loop');
          }
          
          return updatedItem;
        }
        return item;
      });
      
      return updatedItems;
    });
  };

  // Delete an item and all its children
  const deleteItem = (itemId: string) => {
    setItems(prevItems => {
      const childIds = getAllChildIds(prevItems, itemId);
      return prevItems.filter(item => item.id !== itemId && !childIds.includes(item.id));
    });
  };

  // Toggle folder open/closed state
  const toggleFolder = (folderId: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === folderId && item.type === 'folder'
          ? { ...item, isOpen: !item.isOpen }
          : item
      )
    );
  };

  // Import multiple items
  const importItems = (newItems: Item[]) => {
    const existingIds = new Set(items.map(item => item.id));
    const idMap = new Map<string, string>(); // Map to track ID changes
    const processedItems: Item[] = [];

    // First pass: Process items and keep IDs when possible
    for (const raw of newItems) {
      const originalId = raw.id;
      const needsNewId = !originalId || existingIds.has(originalId);
      const newId = needsNewId ? generateId() : originalId;
      
      // Track ID changes
      if (needsNewId) {
        idMap.set(originalId, newId);
      }

      // Process based on item type
      if (raw.type === 'folder') {
        const item = { ...raw } as any;
        
        // Ensure folders always have isOpen property
        if (item.isOpen === undefined) {
          item.isOpen = true;  // default for imported folders
        }
        
        processedItems.push({
          ...item,
          id: newId,
          createdAt: item.createdAt || Date.now(),
        } as Folder);
      } else if (raw.type === 'link') {
        processedItems.push({
          ...raw,
          id: newId,
          createdAt: raw.createdAt || Date.now(),
        } as Link);
      } else if (raw.type === 'snippet') {
        processedItems.push({
          ...raw,
          id: newId,
          createdAt: raw.createdAt || Date.now(),
        } as Snippet);
      }
    }

    // Second pass: Update parentIds if the parent's ID was changed
    const finalItems: Item[] = [];
    for (const item of processedItems) {
      if (item.parentId && idMap.has(item.parentId)) {
        const newParentId = idMap.get(item.parentId)!;
        
        if (item.type === 'folder') {
          finalItems.push({
            ...item,
            parentId: newParentId
          } as Folder);
        } else if (item.type === 'link') {
          finalItems.push({
            ...item,
            parentId: newParentId
          } as Link);
        } else if (item.type === 'snippet') {
          finalItems.push({
            ...item,
            parentId: newParentId
          } as Snippet);
        }
      } else {
        finalItems.push(item);
      }
    }

    // Validate folder structure
    finalItems.forEach(item => {
      if (item.type === 'folder' && wouldCreateLoop(finalItems, item.id, item.parentId)) {
        throw new Error(`Import would create a folder loop with folder "${item.title}"`);
      }
    });

    // For testing/debug purposes
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      const folder = finalItems.find(item => item.type === 'folder');
      if (folder) {
        const children = finalItems.filter(item => item.parentId === folder.id);
        console.log('Import test - Folder:', folder);
        console.log('Import test - Children:', children);
      }
    }

    setItems(prevItems => [...prevItems, ...finalItems]);
    
    return { importedItems: finalItems, idMap };
  };

  return {
    items,
    addItem,
    updateItem,
    deleteItem,
    toggleFolder,
    importItems,
  };
};