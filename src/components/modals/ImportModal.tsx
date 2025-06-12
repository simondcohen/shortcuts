import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import Button from '../common/Button';
import { Item } from '../../types';

interface ImportModalProps {
  onClose: () => void;
  onImport: (items: Item[]) => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ onClose, onImport }) => {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  const formatInstructions = `Basic Structure
The file must be a JSON array of objects. Each object represents an item with the following properties:

• type (required): Must be "link", "snippet", or "folder"
• title (required): The display name of the item
• parentId (optional): ID of the parent folder, or null for root level
• id (optional): Unique identifier (generated if missing)
• url (required for links): The URL to open
• content (required for snippets): The snippet text
• isOpen (optional, folders only): Whether the folder starts expanded

Validation Rules
• Unknown keys are ignored
• Items with invalid parentId are placed at root level
• Duplicate IDs are automatically regenerated
• Non-http(s) URLs are skipped

Examples
1. Folder with a link inside:
[
  {
    "type": "folder",
    "title": "My Folder",
    "id": "f-1",
    "isOpen": true
  },
  {
    "type": "link",
    "title": "Example Link",
    "url": "https://example.com",
    "parentId": "f-1"
  }
]

2. Simple snippet at root:
[
  {
    "type": "snippet",
    "title": "Quick Note",
    "content": "Remember to check this later"
  }
]

Tip: Items can appear in any order - the importer resolves parent-child relationships after parsing.`;

  const handleCopyInstructions = async () => {
    try {
      await navigator.clipboard.writeText(formatInstructions);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    } catch {
      setError('Failed to copy instructions');
    }
  };

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
    } catch {
      setError('Failed to read from clipboard');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] flex flex-col">
        <h2 className="text-xl font-semibold mb-4">Import Items</h2>
        
        <div className="flex-1 overflow-auto pr-2 -mr-2">
          <div className="mb-6">
            <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
              <h3 className="text-sm font-medium text-gray-700">JSON Format</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyInstructions}
                  className="flex items-center whitespace-nowrap"
                >
                  {hasCopied ? (
                    <>
                      <Check className="h-4 w-4 mr-1.5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1.5" />
                      Copy Instructions
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center whitespace-nowrap"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1.5" />
                      Collapse
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1.5" />
                      Expand
                    </>
                  )}
                </Button>
              </div>
            </div>
            {isExpanded && (
              <div className="bg-gray-50 p-4 rounded-md text-sm space-y-4 overflow-x-auto">
                <div>
                  <p className="font-medium mb-2">Basic Structure</p>
                  <p className="text-gray-600 mb-2">The file must be a JSON array of objects. Each object represents an item with the following properties:</p>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li><code>type</code> (required): Must be "link", "snippet", or "folder"</li>
                    <li><code>title</code> (required): The display name of the item</li>
                    <li><code>parentId</code> (optional): ID of the parent folder, or null for root level</li>
                    <li><code>id</code> (optional): Unique identifier (generated if missing)</li>
                    <li><code>url</code> (required for links): The URL to open</li>
                    <li><code>content</code> (required for snippets): The snippet text</li>
                    <li><code>isOpen</code> (optional, folders only): Whether the folder starts expanded</li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium mb-2">Validation Rules</p>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li>Unknown keys are ignored</li>
                    <li>Items with invalid parentId are placed at root level</li>
                    <li>Duplicate IDs are automatically regenerated</li>
                    <li>Non-http(s) URLs are skipped</li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium mb-2">Examples</p>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-600 mb-1">Folder with a link inside:</p>
                      <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
{`[
  {
    "type": "folder",
    "title": "My Folder",
    "id": "f-1",
    "isOpen": true
  },
  {
    "type": "link",
    "title": "Example Link",
    "url": "https://example.com",
    "parentId": "f-1"
  }
]`}
                      </pre>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Simple snippet at root:</p>
                      <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
{`[
  {
    "type": "snippet",
    "title": "Quick Note",
    "content": "Remember to check this later"
  }
]`}
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="text-gray-600 italic">
                  <p>Tip: Items can appear in any order - the importer resolves parent-child relationships after parsing.</p>
                </div>
              </div>
            )}
          </div>

          <div className="mb-6">
            <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
              <label htmlFor="jsonInput" className="text-sm font-medium text-gray-700">
                Paste JSON Data
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePaste}
                className="whitespace-nowrap"
              >
                Paste from Clipboard
              </Button>
            </div>
            <textarea
              id="jsonInput"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="w-full h-40 p-3 border rounded-md font-mono text-sm resize-y min-h-[8rem]"
              placeholder="Paste your JSON data here..."
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm mb-4 p-2 bg-red-50 rounded border border-red-200">
              {error}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleImport}
            className="min-w-[80px]"
          >
            Import
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImportModal; 