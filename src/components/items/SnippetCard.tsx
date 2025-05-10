import React, { useState } from 'react';
import { Code, Copy, Check, Edit, Trash, ChevronDown, ChevronUp } from 'lucide-react';
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
  const previewContent = snippet.content.length > 80
    ? `${snippet.content.substring(0, 80)}...`
    : snippet.content;

  return (
    <>
      <Card className="group hover:shadow-sm transition-all duration-200 border-gray-100">
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(snippet)}
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
            <h3 className="font-medium text-gray-600 truncate text-base">{snippet.title}</h3>
          </div>
        </div>
        
        <div 
          className="mt-2 font-mono text-xs bg-gray-50 p-2 rounded border border-gray-100 overflow-hidden cursor-pointer"
          onClick={toggleContent}
        >
          <div className="flex justify-end">
            <span className="text-purple-400">
              {isContentVisible ? 
                <ChevronUp className="h-3 w-3" /> : 
                <ChevronDown className="h-3 w-3" />
              }
            </span>
          </div>
          <pre 
            className={`whitespace-pre-wrap text-gray-700 text-xs transition-all duration-300 ${isContentVisible ? 'max-h-60' : 'max-h-12 overflow-hidden'}`}
            style={{ overflowY: 'auto' }}
          >
            {isContentVisible ? snippet.content : previewContent}
          </pre>
        </div>
        
        <Button
          variant="secondary"
          size="sm"
          onClick={handleCopy}
          className={`mt-2 ${isCopied ? 'bg-green-500 text-white' : 'bg-teal-600 text-white hover:bg-teal-700'} transition-colors text-xs`}
          fullWidth
        >
          {isCopied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
          {isCopied ? 'Copied' : 'Copy'}
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