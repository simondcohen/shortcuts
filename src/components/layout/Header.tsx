import React from 'react';
import { Bookmark } from 'lucide-react';
import Button from '../common/Button';

interface HeaderProps {
  onAddItem: (type: 'link' | 'snippet' | 'folder') => void;
}

const Header: React.FC<HeaderProps> = ({ onAddItem }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Bookmark className="h-6 w-6 text-blue-500 mr-2" />
          <h1 className="text-xl font-semibold text-gray-900">Shortcuts</h1>
        </div>
        
        <div className="flex space-x-2">
          <div className="hidden sm:flex space-x-2">
            <Button
              onClick={() => onAddItem('link')}
              variant="primary"
              size="sm"
            >
              Add Link
            </Button>
            <Button
              onClick={() => onAddItem('snippet')}
              variant="secondary"
              size="sm"
            >
              Add Snippet
            </Button>
            <Button
              onClick={() => onAddItem('folder')}
              variant="outline"
              size="sm"
            >
              Add Folder
            </Button>
          </div>
          
          {/* Mobile dropdown */}
          <div className="sm:hidden relative group">
            <Button variant="primary" size="sm">
              Add New +
            </Button>
            <div className="absolute right-0 top-full mt-1 bg-white shadow-lg rounded-md py-2 hidden group-hover:block w-40">
              <button
                onClick={() => onAddItem('link')}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Add Link
              </button>
              <button
                onClick={() => onAddItem('snippet')}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Add Snippet
              </button>
              <button
                onClick={() => onAddItem('folder')}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Add Folder
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;