import React, { useState } from 'react';
import { useShortcuts } from '../../context/ShortcutsContext';
import ItemsGrid from './ItemsGrid';
import FolderList from './FolderList';
import ItemForm from '../forms/ItemForm';
import { Item, ItemType } from '../../types';

interface MainContentProps {
  showFormType: ItemType | null;
  onCloseForm: () => void;
}

const MainContent: React.FC<MainContentProps> = ({ showFormType, onCloseForm }) => {
  const { items } = useShortcuts();
  const [editItem, setEditItem] = useState<Item | undefined>(undefined);
  
  const handleEdit = (item: Item) => {
    setEditItem(item);
  };
  
  const handleCloseForm = () => {
    setEditItem(undefined);
    onCloseForm();
  };

  const renderItems = (filteredItems: Item[]) => {
    return <ItemsGrid items={filteredItems} onEdit={handleEdit} />;
  };

  return (
    <main className="container mx-auto flex-grow">
      {/* Render form modal if add or edit is active */}
      {(showFormType || editItem) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <ItemForm 
            type={editItem?.type || showFormType!} 
            onClose={handleCloseForm}
            editItem={editItem}
          />
        </div>
      )}
      
      {/* Root level items */}
      <div className="mt-4">
        <FolderList
          parentId={null}
          items={items}
          onEdit={handleEdit}
          renderItems={renderItems}
        />
      </div>
    </main>
  );
};

export default MainContent;