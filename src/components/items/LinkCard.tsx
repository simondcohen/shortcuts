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

  // Extract domain from URL for display
  const getDomainFromUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return url;
    }
  };

  const domain = getDomainFromUrl(link.url);

  return (
    <>
      <Card className="group hover:shadow-sm transition-all duration-200 border-gray-100">
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(link)}
            aria-label="Edit"
            className="p-1 text-gray-400 hover:text-gray-700 focus:outline-none"
          >
            <Edit className="h-3 w-3" />
          </button>
          <button
            onClick={() => setIsDeleteDialogOpen(true)}
            aria-label="Delete"
            className="p-1 ml-1 text-gray-400 hover:text-red-500 focus:outline-none"
          >
            <Trash className="h-3 w-3" />
          </button>
        </div>
        
        <div className="flex items-start">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-600 truncate text-base">{link.title}</h3>
            <div className="text-xs text-gray-400 mt-0.5 truncate" title={link.url}>
              {domain}
            </div>
          </div>
        </div>
        
        <Button
          variant="primary"
          size="sm"
          onClick={handleOpen}
          className="mt-3 bg-slate-700 hover:bg-slate-800 text-xs"
          fullWidth
        >
          <ExternalLink className="h-3 w-3 mr-1" />
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