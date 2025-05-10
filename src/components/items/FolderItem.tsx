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

  const handleToggleFolder = () => {
    toggleFolder(folder.id);
  };

  const handleDelete = () => {
    deleteItem(folder.id);
    setIsDeleteDialogOpen(false);
  };

  const indentStyle = {
    paddingLeft: `${level * 16}px`,
  };

  return (
    <>
      <div className="relative group" style={indentStyle}>
        <div className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100">
          <button
            onClick={handleToggleFolder}
            className="mr-1 text-gray-500"
            aria-label={folder.isOpen ? 'Collapse folder' : 'Expand folder'}
          >
            {folder.isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          
          <FolderIcon className="h-5 w-5 text-amber-500 mr-2" />
          
          <span className="font-medium text-gray-800 flex-grow">{folder.title}</span>
          
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(folder)}
              aria-label="Edit folder"
            >
              <Edit className="h-4 w-4 text-gray-500" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
              aria-label="Delete folder"
            >
              <Trash className="h-4 w-4 text-red-500" />
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