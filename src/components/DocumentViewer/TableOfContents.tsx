import React from 'react';
import { TableOfContentsItem } from '../../utils/documentFormatters';

interface TableOfContentsProps {
  items: TableOfContentsItem[];
  activeId?: string;
  onItemClick: (id: string) => void;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ 
  items, 
  activeId,
  onItemClick 
}) => {
  const renderItem = (item: TableOfContentsItem, depth: number = 0) => {
    const isActive = item.id === activeId;
    const paddingLeft = 16 + depth * 16;

    return (
      <div key={item.id}>
        <button
          onClick={() => onItemClick(item.id)}
          className={`
            w-full text-left px-4 py-2 text-sm transition-all duration-150
            hover:bg-gray-700 hover:text-white
            ${isActive ? 'bg-gray-700 text-white border-l-2 border-blue-500' : 'text-gray-400'}
          `}
          style={{ paddingLeft: `${paddingLeft}px` }}
        >
          {item.title}
        </button>
        {item.children.length > 0 && (
          <div>
            {item.children.map((child) => renderItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className="w-64 bg-gray-800 border-r border-gray-700 overflow-y-auto">
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
          Table of Contents
        </h3>
      </div>
      <div className="py-2">
        {items.length > 0 ? (
          items.map((item) => renderItem(item))
        ) : (
          <p className="px-4 py-2 text-sm text-gray-500">No headings found</p>
        )}
      </div>
    </nav>
  );
};