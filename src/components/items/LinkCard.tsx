import React, { useState } from 'react';
import { ExternalLink, Edit, Trash } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { Link } from '../../types';
import { useShortcuts } from '../../context/ShortcutsContext';
import ConfirmDialog from '../common/ConfirmDialog';

interface LinkCardProps {
  link: Link;
  onEdit: (item: Link) => void;
}

const LinkCard: React.FC<LinkCardProps> = ({ link, onEdit }) => {
  const { deleteItem } = useShortcuts();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleOpen = () => {
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  const handleDelete = () => {
    deleteItem(link.id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <Card className="relative group">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <span className="text-blue-500 mr-2">
              <ExternalLink className="h-5 w-5" />
            </span>
            <h3 className="font-medium text-gray-800 truncate">{link.title}</h3>
          </div>
          
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(link)}
              aria-label="Edit"
            >
              <Edit className="h-4 w-4 text-gray-500" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
              aria-label="Delete"
            >
              <Trash className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
        
        <div className="text-sm text-gray-500 mt-1 truncate" title={link.url}>
          {link.url}
        </div>
        
        <Button
          variant="primary"
          size="sm"
          onClick={handleOpen}
          className="mt-3"
          fullWidth
        >
          Open
        </Button>
      </Card>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete Link"
        message={`Are you sure you want to delete "${link.title}"?`}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </>
  );
};

export default LinkCard;