import React from 'react';
import { Item } from '../../types';
import LinkCard from '../items/LinkCard';
import SnippetCard from '../items/SnippetCard';

interface ItemsGridProps {
  items: Item[];
  onEdit: (item: Item) => void;
}

const ItemsGrid: React.FC<ItemsGridProps> = ({ items, onEdit }) => {
  if (items.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-lg border border-gray-200 shadow-sm">
        <p className="text-gray-500">No items in this section</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {items.map((item) => (
        <div key={item.id} className="transform transition-transform hover:translate-y-[-2px]">
          {item.type === 'link' && <LinkCard link={item} onEdit={onEdit} />}
          {item.type === 'snippet' && <SnippetCard snippet={item} onEdit={onEdit} />}
        </div>
      ))}
    </div>
  );
};

export default ItemsGrid;