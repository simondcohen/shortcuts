import React, { useState } from 'react';
import { Bookmark, Upload } from 'lucide-react';
import Button from '../common/Button';
import { ItemType } from '../../types';
import ImportModal from '../modals/ImportModal';
import { useShortcuts } from '../../context/ShortcutsContext';

interface HeaderProps {
  onAddItem: (type: ItemType) => void;
}

const Header: React.FC<HeaderProps> = ({ onAddItem }) => {
  const [showImportModal, setShowImportModal] = useState(false);
  const { importItems } = useShortcuts();

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
              onClick={() => setShowImportModal(true)}
              variant="outline"
              size="sm"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
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
          <div className="sm:hidden">
            <Button
              onClick={() => setShowImportModal(true)}
              variant="outline"
              size="sm"
            >
              <Upload className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {showImportModal && (
        <ImportModal
          onClose={() => setShowImportModal(false)}
          onImport={importItems}
        />
      )}
    </header>
  );
};

export default Header;