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
      <div className="min-h-screen bg-white flex flex-col">
        <Header onAddItem={handleAddItem} />
        <MainContent showFormType={showFormType} onCloseForm={handleCloseForm} />
        <footer className="py-3 text-center text-xs text-gray-400 border-t border-gray-100">
          <div className="container mx-auto px-4">
            Shortcuts App
          </div>
        </footer>
      </div>
    </ShortcutsProvider>
  );
}

export default App;