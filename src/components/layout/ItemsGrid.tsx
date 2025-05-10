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
      <div className="p-6 text-center text-gray-400 text-sm">
        No items in this section
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
      {items.map((item) => (
        <div key={item.id}>
          {item.type === 'link' && <LinkCard link={item} onEdit={onEdit} />}
          {item.type === 'snippet' && <SnippetCard snippet={item} onEdit={onEdit} />}
        </div>
      ))}
    </div>
  );
};

export default ItemsGrid;