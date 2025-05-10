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
        className="relative group mb-1" 
        style={indentStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          className={`
            flex items-center py-2 px-3 rounded-lg
            ${folder.isOpen ? 'bg-amber-50 border-l-2 border-amber-300' : 'hover:bg-gray-50 border-l-2 border-transparent'} 
            transition-all duration-200
          `}
        >
          <button
            onClick={handleToggleFolder}
            className={`mr-1 rounded-full p-1 transition-colors ${isHovered ? 'bg-gray-100 text-gray-700' : 'text-gray-500'}`}
            aria-label={folder.isOpen ? 'Collapse folder' : 'Expand folder'}
          >
            {folder.isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          
          <div className={`flex items-center justify-center h-6 w-6 rounded-md mr-2 ${folder.isOpen ? 'bg-amber-200' : 'bg-amber-100'}`}>
            <FolderIcon className="h-4 w-4 text-amber-600" />
          </div>
          
          <span className={`font-medium ${folder.isOpen ? 'text-amber-900' : 'text-gray-800'} flex-grow`}>
            {folder.title}
          </span>
          
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(folder)}
              aria-label="Edit folder"
              className="rounded-full p-1 hover:bg-amber-100"
            >
              <Edit className="h-3.5 w-3.5 text-gray-600" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
              aria-label="Delete folder"
              className="rounded-full p-1 hover:bg-red-100"
            >
              <Trash className="h-3.5 w-3.5 text-gray-600 hover:text-red-600" />
            </Button>
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