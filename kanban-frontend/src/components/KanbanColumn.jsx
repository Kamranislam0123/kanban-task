import React from 'react';
import KanbanCard from './KanbanCard';

const KanbanColumn = ({ title, items, onAttachmentClick }) => {
  return (
    <div className="flex-shrink-0 w-80 bg-gray-200 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-700 text-center">
        {title}
      </h2>
      <div className="space-y-3 max-h-[calc(100vh-10rem)] overflow-y-auto">
        {items.map(item => (
          <KanbanCard
            key={item.id}
            task={item}
            onAttachmentClick={onAttachmentClick}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;
