import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import Button from '../common/Button';
import { Item } from '../../types';

interface ImportModalProps {
  onClose: () => void;
  onImport: (items: Item[]) => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ onClose, onImport }) => {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleImport = () => {
    try {
      const parsedItems = JSON.parse(jsonInput);
      
      // Validate the imported data
      if (!Array.isArray(parsedItems)) {
        throw new Error('Imported data must be an array of items');
      }

      // Validate each item
      parsedItems.forEach((item, index) => {
        if (!item.type || !['link', 'snippet', 'folder'].includes(item.type)) {
          throw new Error(`Invalid item type at index ${index}`);
        }
        if (!item.title) {
          throw new Error(`Missing title at index ${index}`);
        }
        if (item.type === 'link' && !item.url) {
          throw new Error(`Missing URL for link at index ${index}`);
        }
        if (item.type === 'snippet' && !item.content) {
          throw new Error(`Missing content for snippet at index ${index}`);
        }
      });

      onImport(parsedItems);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON format');
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setJsonInput(text);
    } catch (err) {
      setError('Failed to read from clipboard');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">Import Items</h2>
        
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">JSON Format</h3>
          <pre className="bg-gray-50 p-4 rounded-md text-sm overflow-x-auto">
{`[
  {
    "type": "link",
    "title": "Example Link",
    "url": "https://example.com",
    "parentId": null
  },
  {
    "type": "snippet",
    "title": "Example Snippet",
    "content": "Your code snippet here",
    "parentId": null
  },
  {
    "type": "folder",
    "title": "Example Folder",
    "isOpen": true,
    "parentId": null
  }
]`}
          </pre>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="jsonInput" className="text-sm font-medium text-gray-700">
              Paste JSON Data
            </label>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePaste}
            >
              Paste from Clipboard
            </Button>
          </div>
          <textarea
            id="jsonInput"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="w-full h-48 p-2 border rounded-md font-mono text-sm"
            placeholder="Paste your JSON data here..."
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm mb-4">
            {error}
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleImport}
          >
            Import
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImportModal; 