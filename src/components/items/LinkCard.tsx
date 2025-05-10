import React, { useState } from 'react';
import { ExternalLink, Edit, Trash, Globe } from 'lucide-react';
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
  const [isHovered, setIsHovered] = useState(false);

  const handleOpen = () => {
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  const handleDelete = () => {
    deleteItem(link.id);
    setIsDeleteDialogOpen(false);
  };

  // Function to get favicon URL
  const getFaviconUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`;
    } catch (e) {
      return null;
    }
  };

  // Extract domain from URL for display
  const getDomainFromUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch (e) {
      return url;
    }
  };

  const faviconUrl = getFaviconUrl(link.url);
  const domain = getDomainFromUrl(link.url);

  return (
    <>
      <Card 
        className={`relative group transform transition-all duration-200 ${isHovered ? 'scale-102 shadow-md' : ''} hover:border-blue-300`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(link)}
            aria-label="Edit"
            className="bg-gray-100 hover:bg-gray-200 rounded-full p-1"
          >
            <Edit className="h-4 w-4 text-gray-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDeleteDialogOpen(true)}
            aria-label="Delete"
            className="bg-gray-100 hover:bg-gray-200 hover:bg-red-100 hover:text-red-600 rounded-full p-1"
          >
            <Trash className="h-4 w-4 text-gray-600 hover:text-red-600" />
          </Button>
        </div>
        
        <div className="flex items-start">
          <div className="bg-gray-100 rounded-lg p-2 mr-3 flex-shrink-0">
            {faviconUrl ? (
              <img 
                src={faviconUrl} 
                alt="Website favicon" 
                className="w-8 h-8 rounded-md" 
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  document.getElementById(`fallback-icon-${link.id}`)?.style.setProperty('display', 'block');
                }}
              />
            ) : (
              <Globe className="h-8 w-8 text-blue-500" id={`fallback-icon-${link.id}`} />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-800 truncate text-base">{link.title}</h3>
            <div className="text-xs text-gray-500 mt-1 truncate flex items-center" title={link.url}>
              <Globe className="h-3 w-3 text-gray-400 mr-1 inline" />
              {domain}
            </div>
          </div>
        </div>
        
        <Button
          variant="primary"
          size="sm"
          onClick={handleOpen}
          className="mt-4 bg-blue-600 hover:bg-blue-700 transition-colors"
          fullWidth
        >
          <ExternalLink className="h-4 w-4 mr-1" />
          Open Link
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