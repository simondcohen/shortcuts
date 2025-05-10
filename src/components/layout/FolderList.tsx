import React, { ReactNode } from 'react';
import FolderItem from '../items/FolderItem';
import { Item, Folder, ItemType } from '../../types';
import { useShortcuts } from '../../context/ShortcutsContext';

interface FolderListProps {
  parentId: string | null;
  items: Item[];
  onEdit: (item: Item) => void;
  level?: number;
  renderItems: (items: Item[]) => ReactNode;
  onAddItem: (type: ItemType, parentId: string) => void;
}

const FolderList: React.FC<FolderListProps> = ({ 
  parentId, 
  items, 
  onEdit, 
  level = 0,
  renderItems,
  onAddItem
}) => {
  const { items: allItems } = useShortcuts();
  
  // Get folders at this level
  const folders = items
    .filter(item => item.type === 'folder' && item.parentId === parentId)
    .sort((a, b) => a.title.localeCompare(b.title));
  
  // Get non-folder items at this level
  const currentItems = items
    .filter(item => item.type !== 'folder' && item.parentId === parentId)
    .sort((a, b) => a.title.localeCompare(b.title));

  // If no items and no folders at root level, show empty state
  if (parentId === null && folders.length === 0 && currentItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center">
        <div className="bg-gray-50 p-4 rounded-full mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-700 mb-1">No shortcuts yet</h3>
        <p className="text-gray-500 max-w-md mb-0">
          Add your first link, code snippet, or create a folder.
        </p>
      </div>
    );
  }

  return (
    <div className={parentId === null ? 'space-y-6' : 'space-y-2'}>
      {/* Section for folders */}
      {folders.length > 0 && (
        <div className={parentId === null ? 'mb-6' : 'mb-3'}>
          {parentId === null && folders.length > 0 && (
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 pl-2">
              Folders
            </h2>
          )}
          
          <div className={parentId === null ? 'bg-white rounded-lg shadow-sm border border-gray-100' : ''}>
            {folders.map((folder) => (
              <div key={folder.id} className="mb-1">
                <FolderItem
                  folder={folder as Folder}
                  onEdit={onEdit}
                  level={level}
                  onAddItem={onAddItem}
                />
                
                {/* Recursively render folder contents if open */}
                {(folder as Folder).isOpen && (
                  <div className={`ml-2 ${level > 0 ? 'border-l-2 border-slate-100 pl-2' : ''}`}>
                    <FolderList
                      parentId={folder.id}
                      items={allItems}
                      onEdit={onEdit}
                      level={level + 1}
                      renderItems={renderItems}
                      onAddItem={onAddItem}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Section for non-folder items */}
      {currentItems.length > 0 && (
        <div>
          {parentId === null && (
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 pl-2">
              Shortcuts
            </h2>
          )}
          {renderItems(currentItems)}
        </div>
      )}
    </div>
  );
};

export default FolderList;