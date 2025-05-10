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
  const [isHovered, setIsHovered] = useState(false);

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
      <Card 
        className={`relative group transform transition-all duration-200 ${isHovered ? 'scale-102 shadow-md' : ''} hover:border-purple-300`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(snippet)}
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
          <div className="bg-purple-100 rounded-lg p-2 mr-3 flex-shrink-0">
            <Code className="h-8 w-8 text-purple-600" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-800 truncate text-base">{snippet.title}</h3>
            <div className="text-xs text-gray-500 mt-1 flex items-center">
              <span className="bg-gray-200 rounded-full px-2 py-0.5 text-gray-600">
                {snippet.content.length} chars
              </span>
            </div>
          </div>
        </div>
        
        <div 
          className="mt-3 font-mono text-xs bg-gray-50 p-3 rounded-md border border-gray-200 overflow-hidden cursor-pointer transition-all duration-200 hover:border-purple-200"
          onClick={toggleContent}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-500 font-sans">Code snippet</span>
            <span className="text-purple-500">
              {isContentVisible ? 
                <ChevronUp className="h-4 w-4" /> : 
                <ChevronDown className="h-4 w-4" />
              }
            </span>
          </div>
          <pre 
            className={`whitespace-pre-wrap text-gray-800 transition-all duration-300 ${isContentVisible ? 'max-h-96' : 'max-h-16 overflow-hidden'}`}
            style={{ overflowY: 'auto' }}
          >
            {isContentVisible ? snippet.content : previewContent}
          </pre>
        </div>
        
        <div className="flex space-x-2 mt-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCopy}
            className={`flex-1 ${isCopied ? 'bg-green-600 text-white' : 'bg-purple-600 text-white hover:bg-purple-700'} transition-colors`}
            icon={isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          >
            {isCopied ? 'Copied!' : 'Copy to Clipboard'}
          </Button>
        </div>
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