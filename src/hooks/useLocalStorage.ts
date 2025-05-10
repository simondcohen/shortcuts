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
    // Add IDs and timestamps to imported items
    const processedItems = newItems.map(item => {
      const baseItem = {
        ...item,
        id: generateId(),
        createdAt: Date.now(),
      };

      // Ensure folder items have isOpen property
      if (item.type === 'folder') {
        return {
          ...baseItem,
          isOpen: (item as Folder).isOpen ?? true,
        };
      }

      return baseItem;
    });

    // Validate folder structure
    processedItems.forEach(item => {
      if (item.type === 'folder' && wouldCreateLoop(processedItems, item.id, item.parentId)) {
        throw new Error(`Import would create a folder loop with folder "${item.title}"`);
      }
    });

    setItems(prevItems => [...prevItems, ...processedItems]);
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