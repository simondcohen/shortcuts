import React, { useState, useEffect } from 'react';
import { useShortcuts } from '../../context/ShortcutsContext';
import Button from '../common/Button';
import { Item, ItemType, Link as LinkItem, Snippet, Folder as FolderItem } from '../../types';
import { ExternalLink, Code, Folder as FolderIcon } from 'lucide-react';

interface ItemFormProps {
  type: ItemType;
  onClose: () => void;
  editItem?: Item;
  parentId?: string | null;
}

const ItemForm: React.FC<ItemFormProps> = ({ type, onClose, editItem, parentId: initialParentId }) => {
  const { addItem, updateItem, getFolderOptions } = useShortcuts();
  
  const [title, setTitle] = useState(editItem?.title || '');
  const [url, setUrl] = useState((editItem?.type === 'link' ? editItem.url : ''));
  const [content, setContent] = useState((editItem?.type === 'snippet' ? editItem.content : ''));
  const [snippetUrl, setSnippetUrl] = useState((editItem?.type === 'snippet' && 'url' in editItem) ? editItem.url || '' : '');
  const [parentId, setParentId] = useState<string | null>(editItem?.parentId || initialParentId || null);
  const [error, setError] = useState<string | null>(null);
  
  const folderOptions = getFolderOptions(editItem?.id);
  
  useEffect(() => {
    if (editItem) {
      setTitle(editItem.title);
      if (editItem.type === 'link') {
        setUrl(editItem.url);
      } else if (editItem.type === 'snippet') {
        setContent(editItem.content);
        if ('url' in editItem) {
          setSnippetUrl(editItem.url || '');
        }
      }
      setParentId(editItem.parentId);
    } else if (initialParentId) {
      setParentId(initialParentId);
    }
  }, [editItem, initialParentId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      if (!title.trim()) {
        setError('Title is required');
        return;
      }
      
      if (type === 'link' && !url.trim()) {
        setError('URL is required');
        return;
      }
      
      if (type === 'snippet' && !content.trim()) {
        setError('Content is required');
        return;
      }
      
      const itemData = {
        title: title.trim(),
        type,
        parentId,
        ...(type === 'link' ? { url: url.trim() } : {}),
        ...(type === 'snippet' ? { 
          content: content.trim(),
          ...(snippetUrl.trim() ? { url: snippetUrl.trim() } : {})
        } : {}),
        ...(type === 'folder' ? { isOpen: true } : {}),
      };
      
      if (editItem) {
        updateItem(editItem.id, itemData);
      } else {
        addItem(itemData as Omit<LinkItem | Snippet | FolderItem, 'id' | 'createdAt'>);
      }
      
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };
  
  const getIcon = () => {
    switch (type) {
      case 'link':
        return <ExternalLink className="h-5 w-5" />;
      case 'snippet':
        return <Code className="h-5 w-5" />;
      case 'folder':
        return <FolderIcon className="h-5 w-5" />;
      default:
        return null;
    }
  };
  
  const getTitle = () => {
    if (editItem) {
      return `Edit ${type}`;
    }
    return `Add new ${type}`;
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg max-w-2xl w-full mx-auto">
      <div className="flex items-center mb-4">
        <span className="mr-2 text-blue-500">{getIcon()}</span>
        <h2 className="text-xl font-semibold">{getTitle()}</h2>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter a title"
          />
        </div>
        
        {type === 'link' && (
          <div className="mb-4">
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
              URL
            </label>
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com"
            />
          </div>
        )}
        
        {type === 'snippet' && (
          <>
            <div className="mb-4">
              <label htmlFor="snippetUrl" className="block text-sm font-medium text-gray-700 mb-1">
                URL (optional)
              </label>
              <input
                type="text"
                id="snippetUrl"
                value={snippetUrl}
                onChange={(e) => setSnippetUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={15}
                placeholder="Enter your snippet text"
              />
            </div>
          </>
        )}
        
        <div className="mb-4">
          <label htmlFor="parentId" className="block text-sm font-medium text-gray-700 mb-1">
            Folder
          </label>
          <select
            id="parentId"
            value={parentId === null ? '' : parentId}
            onChange={(e) => setParentId(e.target.value === '' ? null : e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {folderOptions.map((option) => (
              <option key={option.value || 'root'} value={option.value || ''}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant={type === 'link' ? 'primary' : type === 'snippet' ? 'secondary' : 'outline'}>
            {editItem ? 'Save changes' : 'Add'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ItemForm;