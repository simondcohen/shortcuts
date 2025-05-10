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

  // Toggle folder open/closed
  const toggleFolder = (folderId: string) => {
    setItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === folderId && item.type === 'folder') {
          return { ...item, isOpen: !(item as Folder).isOpen };
        }
        return item;
      });
    });
  };

  // Delete an item and all its children (if it's a folder)
  const deleteItem = (itemId: string) => {
    setItems(prevItems => {
      const itemToDelete = prevItems.find(item => item.id === itemId);
      
      if (!itemToDelete) {
        return prevItems;
      }
      
      let idsToRemove = [itemId];
      
      // If it's a folder, also remove all its children
      if (itemToDelete.type === 'folder') {
        const childIds = getAllChildIds(prevItems, itemId);
        idsToRemove = [...idsToRemove, ...childIds];
      }
      
      return prevItems.filter(item => !idsToRemove.includes(item.id));
    });
  };

  return {
    items,
    addItem,
    updateItem,
    deleteItem,
    toggleFolder,
  };
};