import React, { useState } from 'react';
import { Bookmark, Upload, Plus, Menu, X, Download } from 'lucide-react';
import Button from '../common/Button';
import { ItemType } from '../../types';
import ImportModal from '../modals/ImportModal';
import ExportModal from '../modals/ExportModal';
import { useShortcuts } from '../../context/ShortcutsContext';

interface HeaderProps {
  onAddItem: (type: ItemType) => void;
}

const Header: React.FC<HeaderProps> = ({ onAddItem }) => {
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { importItems, items } = useShortcuts();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-3 py-2 flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-blue-500 text-white p-1.5 rounded mr-2">
            <Bookmark className="h-4 w-4" />
          </div>
          <h1 className="text-lg font-semibold text-gray-800">Shortcuts</h1>
        </div>
        
        {/* Desktop navigation */}
        <div className="hidden md:flex space-x-2">
          <Button
            onClick={() => setShowImportModal(true)}
            variant="ghost"
            size="sm"
            className="text-gray-600"
          >
            <Upload className="h-4 w-4 mr-1" />
            Import
          </Button>
          <Button
            onClick={() => setShowExportModal(true)}
            variant="ghost"
            size="sm"
            className="text-gray-600"
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          <Button
            onClick={() => onAddItem('link')}
            variant="primary"
            size="sm"
            className="bg-slate-700 hover:bg-slate-800"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Link
          </Button>
          <Button
            onClick={() => onAddItem('snippet')}
            variant="secondary"
            size="sm"
            className="bg-teal-600 text-white hover:bg-teal-700"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Snippet
          </Button>
          <Button
            onClick={() => onAddItem('folder')}
            variant="outline"
            size="sm"
            className="text-gray-600 hover:bg-gray-50"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Folder
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
              <X className="h-5 w-5 text-gray-700" /> : 
              <Menu className="h-5 w-5 text-gray-700" />
            }
          </Button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-50 shadow-sm animate-fadeIn">
          <div className="container mx-auto p-2 space-y-2">
            <Button
              onClick={() => {
                onAddItem('link');
                setMobileMenuOpen(false);
              }}
              variant="primary"
              size="sm"
              className="bg-slate-700 hover:bg-slate-800 w-full justify-start"
            >
              <Plus className="h-3.5 w-3.5 mr-2" />
              Add Link
            </Button>
            <Button
              onClick={() => {
                onAddItem('snippet');
                setMobileMenuOpen(false);
              }}
              variant="secondary"
              size="sm"
              className="bg-teal-600 text-white hover:bg-teal-700 w-full justify-start"
            >
              <Plus className="h-3.5 w-3.5 mr-2" />
              Add Snippet
            </Button>
            <Button
              onClick={() => {
                onAddItem('folder');
                setMobileMenuOpen(false);
              }}
              variant="outline"
              size="sm"
              className="text-gray-600 hover:bg-gray-50 w-full justify-start"
            >
              <Plus className="h-3.5 w-3.5 mr-2" />
              Add Folder
            </Button>
            <div className="flex space-x-2 pt-1">
              <Button
                onClick={() => {
                  setShowImportModal(true);
                  setMobileMenuOpen(false);
                }}
                variant="ghost"
                size="sm"
                className="text-gray-600 flex-1"
              >
                <Upload className="h-3.5 w-3.5 mr-1" />
                Import
              </Button>
              <Button
                onClick={() => {
                  setShowExportModal(true);
                  setMobileMenuOpen(false);
                }}
                variant="ghost"
                size="sm"
                className="text-gray-600 flex-1"
              >
                <Download className="h-3.5 w-3.5 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </div>
      )}

      {showImportModal && (
        <ImportModal
          onClose={() => setShowImportModal(false)}
          onImport={importItems}
        />
      )}

      {showExportModal && (
        <ExportModal
          items={items}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </header>
  );
};

export default Header;