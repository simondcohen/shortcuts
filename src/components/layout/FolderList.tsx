import React, { ReactNode } from 'react';
import FolderItem from '../items/FolderItem';
import { Item, Folder } from '../../types';
import { useShortcuts } from '../../context/ShortcutsContext';

interface FolderListProps {
  parentId: string | null;
  items: Item[];
  onEdit: (item: Item) => void;
  level?: number;
  renderItems: (items: Item[]) => ReactNode;
}

const FolderList: React.FC<FolderListProps> = ({ 
  parentId, 
  items, 
  onEdit, 
  level = 0,
  renderItems
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

  return (
    <>
      {/* Render non-folder items */}
      {currentItems.length > 0 && renderItems(currentItems)}
      
      {/* Render folders */}
      {folders.map((folder) => (
        <div key={folder.id}>
          <FolderItem
            folder={folder as Folder}
            onEdit={onEdit}
            level={level}
          />
          
          {/* Recursively render folder contents if open */}
          {(folder as Folder).isOpen && (
            <div className="ml-2">
              <FolderList
                parentId={folder.id}
                items={allItems}
                onEdit={onEdit}
                level={level + 1}
                renderItems={renderItems}
              />
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default FolderList;