import React, { createContext, useContext, ReactNode, useState } from 'react';
import { useStorage } from '../hooks/useStorage';
import { useClipboard } from '../hooks/useClipboard';
import { Item } from '../types';
import { getFolderOptions } from '../utils/folderUtils';

interface ShortcutsContextType {
  items: Item[];
  addItem: ReturnType<typeof useStorage>['addItem'];
  updateItem: ReturnType<typeof useStorage>['updateItem'];
  deleteItem: ReturnType<typeof useStorage>['deleteItem'];
  toggleFolder: ReturnType<typeof useStorage>['toggleFolder'];
  copyToClipboard: ReturnType<typeof useClipboard>['copyToClipboard'];
  hasCopied: boolean;
  copiedItemId: string | null;
  getFolderOptions: (currentFolderId?: string) => ReturnType<typeof getFolderOptions>;
  importItems: (items: Item[]) => void;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  searchResults: Item[];
  isSearching: boolean;
  needsFile: boolean;
  pickFile: () => Promise<void>;
}

const ShortcutsContext = createContext<ShortcutsContextType | undefined>(undefined);

export const ShortcutsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { items, addItem, updateItem, deleteItem, toggleFolder, importItems: importToStorage, needsFile, pickFile } = useStorage();
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
        needsFile,
        pickFile,
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

