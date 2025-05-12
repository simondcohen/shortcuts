import React, { createContext, useContext, ReactNode, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useClipboard } from '../hooks/useClipboard';
import { Item, ItemType } from '../types';
import { getFolderOptions } from '../utils/folderUtils';

interface ShortcutsContextType {
  items: Item[];
  addItem: ReturnType<typeof useLocalStorage>['addItem'];
  updateItem: ReturnType<typeof useLocalStorage>['updateItem'];
  deleteItem: ReturnType<typeof useLocalStorage>['deleteItem'];
  toggleFolder: ReturnType<typeof useLocalStorage>['toggleFolder'];
  copyToClipboard: ReturnType<typeof useClipboard>['copyToClipboard'];
  hasCopied: boolean;
  copiedItemId: string | null;
  getFolderOptions: (currentFolderId?: string) => ReturnType<typeof getFolderOptions>;
  importItems: (items: Item[]) => void;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  searchResults: Item[];
  isSearching: boolean;
}

const ShortcutsContext = createContext<ShortcutsContextType | undefined>(undefined);

export const ShortcutsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { items, addItem, updateItem, deleteItem, toggleFolder, importItems: importToStorage } = useLocalStorage();
  const { hasCopied, itemId: copiedItemId, copyToClipboard } = useClipboard();
  const [searchTerm, setSearchTerm] = useState<string>('');

  const getOptions = (currentFolderId?: string) => {
    return getFolderOptions(items, currentFolderId);
  };

  const importItems = (newItems: Item[]) => {
    importToStorage(newItems);
  };

  // Filter items based on search term
  const searchResults = searchTerm.trim() === '' 
    ? [] 
    : items.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );

  const isSearching = searchTerm.trim() !== '';

  return (
    <ShortcutsContext.Provider
      value={{
        items,
        addItem,
        updateItem,
        deleteItem,
        toggleFolder,
        copyToClipboard,
        hasCopied,
        copiedItemId,
        getFolderOptions: getOptions,
        importItems,
        searchTerm,
        setSearchTerm,
        searchResults,
        isSearching,
      }}
    >
      {children}
    </ShortcutsContext.Provider>
  );
};

export const useShortcuts = () => {
  const context = useContext(ShortcutsContext);
  if (!context) {
    throw new Error('useShortcuts must be used within a ShortcutsProvider');
  }
  return context;
};