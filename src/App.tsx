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
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header onAddItem={handleAddItem} />
        <MainContent showFormType={showFormType} onCloseForm={handleCloseForm} />
      </div>
    </ShortcutsProvider>
  );
}

export default App;