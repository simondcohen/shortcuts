import { useState } from 'react';
import { ShortcutsProvider, useShortcuts } from './context/ShortcutsContext';
import Header from './components/layout/Header';
import MainContent from './components/layout/MainContent';
import { ItemType } from './types';
import FilePickerModal from './components/modals/FilePickerModal';

function AppShell({ showFormType, onAddItem, onCloseForm }: { showFormType: ItemType | null; onAddItem: (t: ItemType) => void; onCloseForm: () => void }) {
  const { needsFile, pickFile } = useShortcuts();
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {needsFile && <FilePickerModal onPick={pickFile} />}
      <Header onAddItem={onAddItem} />
      <MainContent showFormType={showFormType} onCloseForm={onCloseForm} />
      <footer className="py-3 text-center text-xs text-gray-400 border-t border-gray-100">
        <div className="container mx-auto px-4">Shortcuts App</div>
      </footer>
    </div>
  );
}

function App() {
  const [showFormType, setShowFormType] = useState<ItemType | null>(null);

  const handleAddItem = (type: ItemType) => {
    setShowFormType(type);
  };

  const handleCloseForm = () => {
    setShowFormType(null);
  };

  return (
    <ShortcutsProvider>
      <AppShell showFormType={showFormType} onAddItem={handleAddItem} onCloseForm={handleCloseForm} />
    </ShortcutsProvider>
  );
}

export default App;
