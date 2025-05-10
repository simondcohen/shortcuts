import React, { useState } from 'react';
import { Code, Copy, Check, Edit, Trash } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { Snippet } from '../../types';
import { useShortcuts } from '../../context/ShortcutsContext';
import ConfirmDialog from '../common/ConfirmDialog';

interface SnippetCardProps {
  snippet: Snippet;
  onEdit: (item: Snippet) => void;
}

const SnippetCard: React.FC<SnippetCardProps> = ({ snippet, onEdit }) => {
  const { copyToClipboard, hasCopied, copiedItemId, deleteItem } = useShortcuts();
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleCopy = () => {
    copyToClipboard(snippet.content, snippet.id);
  };

  const toggleContent = () => {
    setIsContentVisible(!isContentVisible);
  };

  const handleDelete = () => {
    deleteItem(snippet.id);
    setIsDeleteDialogOpen(false);
  };

  const isCopied = hasCopied && copiedItemId === snippet.id;

  // Truncate content for preview
  const previewContent = snippet.content.length > 100
    ? `${snippet.content.substring(0, 100)}...`
    : snippet.content;

  return (
    <>
      <Card className="relative group">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <span className="text-purple-500 mr-2">
              <Code className="h-5 w-5" />
            </span>
            <h3 className="font-medium text-gray-800 truncate">{snippet.title}</h3>
          </div>
          
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(snippet)}
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
        
        <div 
          className="mt-2 font-mono text-xs bg-gray-50 p-2 rounded border border-gray-200 overflow-hidden cursor-pointer"
          onClick={toggleContent}
        >
          <pre className={`whitespace-pre-wrap ${isContentVisible ? '' : 'max-h-16 overflow-hidden'}`}>
            {isContentVisible ? snippet.content : previewContent}
          </pre>
          {!isContentVisible && snippet.content.length > 100 && (
            <div className="text-xs text-blue-500 mt-1">Click to expand</div>
          )}
        </div>
        
        <Button
          variant="secondary"
          size="sm"
          onClick={handleCopy}
          className="mt-3"
          fullWidth
          icon={isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        >
          {isCopied ? 'Copied!' : 'Copy'}
        </Button>
      </Card>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete Snippet"
        message={`Are you sure you want to delete "${snippet.title}"?`}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </>
  );
};

export default SnippetCard;