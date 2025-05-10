import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Folder as FolderIcon, Edit, Trash } from 'lucide-react';
import Button from '../common/Button';
import { Folder } from '../../types';
import { useShortcuts } from '../../context/ShortcutsContext';
import ConfirmDialog from '../common/ConfirmDialog';

interface FolderItemProps {
  folder: Folder;
  onEdit: (item: Folder) => void;
  level?: number;
}

const FolderItem: React.FC<FolderItemProps> = ({ folder, onEdit, level = 0 }) => {
  const { toggleFolder, deleteItem } = useShortcuts();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleToggleFolder = () => {
    toggleFolder(folder.id);
  };

  const handleDelete = () => {
    deleteItem(folder.id);
    setIsDeleteDialogOpen(false);
  };

  const indentStyle = {
    paddingLeft: `${level * 16 + 8}px`,
  };

  return (
    <>
      <div 
        className="relative group" 
        style={indentStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          className={`
            flex items-center py-2.5 px-3 rounded-md
            ${folder.isOpen ? 'bg-gray-100' : 'hover:bg-gray-50'} 
            transition-all duration-150
          `}
        >
          <button
            onClick={handleToggleFolder}
            className="mr-2 text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label={folder.isOpen ? 'Collapse folder' : 'Expand folder'}
          >
            {folder.isOpen ? (
              <ChevronDown className="h-4.5 w-4.5" />
            ) : (
              <ChevronRight className="h-4.5 w-4.5" />
            )}
          </button>
          
          <div className={`flex items-center justify-center h-7 w-7 rounded-md mr-2.5 ${folder.isOpen ? 'bg-slate-200' : 'bg-slate-100'}`}>
            <FolderIcon className="h-4 w-4 text-slate-600" />
          </div>
          
          <span className={`text-base font-medium ${folder.isOpen ? 'text-slate-900' : 'text-gray-800'} flex-grow`}>
            {folder.title}
          </span>
          
          <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(folder)}
              aria-label="Edit folder"
              className="p-1 text-gray-400 hover:text-gray-700 focus:outline-none"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsDeleteDialogOpen(true)}
              aria-label="Delete folder"
              className="p-1 ml-1.5 text-gray-400 hover:text-red-500 focus:outline-none"
            >
              <Trash className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete Folder"
        message={`Are you sure you want to delete "${folder.title}" and all its contents?`}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </>
  );
};

export default FolderItem;