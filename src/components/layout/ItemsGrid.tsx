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
      <div className="p-8 text-center">
        <p className="text-gray-500">No items in this section</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {items.map((item) => {
        if (item.type === 'link') {
          return <LinkCard key={item.id} link={item} onEdit={onEdit} />;
        } else if (item.type === 'snippet') {
          return <SnippetCard key={item.id} snippet={item} onEdit={onEdit} />;
        }
        return null;
      })}
    </div>
  );
};

export default ItemsGrid;