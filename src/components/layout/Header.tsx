import React, { useState } from 'react';
import { Bookmark, Upload, Plus, Menu, X } from 'lucide-react';
import Button from '../common/Button';
import { ItemType } from '../../types';
import ImportModal from '../modals/ImportModal';
import { useShortcuts } from '../../context/ShortcutsContext';

interface HeaderProps {
  onAddItem: (type: ItemType) => void;
}

const Header: React.FC<HeaderProps> = ({ onAddItem }) => {
  const [showImportModal, setShowImportModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { importItems } = useShortcuts();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-blue-600 text-white p-2 rounded-md mr-3 shadow-sm">
            <Bookmark className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">Shortcuts</h1>
        </div>
        
        {/* Desktop navigation */}
        <div className="hidden md:flex space-x-3">
          <Button
            onClick={() => setShowImportModal(true)}
            variant="outline"
            size="sm"
            className="text-gray-700 hover:bg-gray-100"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button
            onClick={() => onAddItem('link')}
            variant="primary"
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Link
          </Button>
          <Button
            onClick={() => onAddItem('snippet')}
            variant="secondary"
            size="sm"
            className="bg-purple-600 text-white hover:bg-purple-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Snippet
          </Button>
          <Button
            onClick={() => onAddItem('folder')}
            variant="outline"
            size="sm"
            className="text-gray-700 hover:bg-gray-100"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Folder
          </Button>
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button
            onClick={toggleMobileMenu}
            variant="ghost"
            size="sm"
            className="p-1"
          >
            {mobileMenuOpen ? 
              <X className="h-6 w-6 text-gray-700" /> : 
              <Menu className="h-6 w-6 text-gray-700" />
            }
          </Button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-md animate-fadeIn">
          <div className="container mx-auto p-4 space-y-3">
            <Button
              onClick={() => {
                onAddItem('link');
                setMobileMenuOpen(false);
              }}
              variant="primary"
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 w-full justify-start"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Link
            </Button>
            <Button
              onClick={() => {
                onAddItem('snippet');
                setMobileMenuOpen(false);
              }}
              variant="secondary"
              size="sm"
              className="bg-purple-600 text-white hover:bg-purple-700 w-full justify-start"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Snippet
            </Button>
            <Button
              onClick={() => {
                onAddItem('folder');
                setMobileMenuOpen(false);
              }}
              variant="outline"
              size="sm"
              className="text-gray-700 hover:bg-gray-100 w-full justify-start"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Folder
            </Button>
            <Button
              onClick={() => {
                setShowImportModal(true);
                setMobileMenuOpen(false);
              }}
              variant="outline"
              size="sm"
              className="text-gray-700 hover:bg-gray-100 w-full justify-start"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
          </div>
        </div>
      )}

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