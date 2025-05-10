import React, { useState } from 'react';
import { ShortcutsProvider } from './context/ShortcutsContext';
import Header from './components/layout/Header';
import MainContent from './components/layout/MainContent';
import { ItemType } from './types';

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
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
        <Header onAddItem={handleAddItem} />
        <MainContent showFormType={showFormType} onCloseForm={handleCloseForm} />
        <footer className="bg-white border-t border-gray-200 py-3 text-center text-sm text-gray-500">
          <div className="container mx-auto px-4">
            Shortcuts App – Save and organize your links and snippets
          </div>
        </footer>
      </div>
    </ShortcutsProvider>
  );
}

export default App;