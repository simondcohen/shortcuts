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
  const [formParentId, setFormParentId] = useState<string | null>(null);
  const [activeFormType, setActiveFormType] = useState<ItemType | null>(showFormType);
  
  // Update active form type when prop changes
  React.useEffect(() => {
    setActiveFormType(showFormType);
    if (showFormType) {
      setFormParentId(null); // Reset parent ID when form is opened from header
    }
  }, [showFormType]);
  
  const handleEdit = (item: Item) => {
    setEditItem(item);
    setActiveFormType(item.type);
  };
  
  const handleCloseForm = () => {
    setEditItem(undefined);
    setFormParentId(null);
    setActiveFormType(null);
    onCloseForm();
  };

  const handleAddItem = (type: ItemType, parentId: string) => {
    setFormParentId(parentId);
    setActiveFormType(type);
    setEditItem(undefined);
  };

  const renderItems = (filteredItems: Item[]) => {
    return <ItemsGrid items={filteredItems} onEdit={handleEdit} />;
  };

  return (
    <main className="flex-grow">
      {/* Render form modal if add or edit is active */}
      {(activeFormType || editItem) && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md transform transition-all animate-fadeIn">
            <ItemForm 
              type={editItem?.type || activeFormType!} 
              onClose={handleCloseForm}
              editItem={editItem}
              parentId={formParentId}
            />
          </div>
        </div>
      )}
      
      {/* Main content container */}
      <div className="container mx-auto px-3 py-4 max-w-screen-xl">
        {/* Root level items */}
        <FolderList
          parentId={null}
          items={items}
          onEdit={handleEdit}
          renderItems={renderItems}
          onAddItem={handleAddItem}
        />
      </div>
    </main>
  );
};

export default MainContent;