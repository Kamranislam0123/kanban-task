import React, { useState } from 'react';
import KanbanColumn from './KanbanColumn';
import AttachmentModal from './AttachmentModal';

const KanbanBoard = () => {
  const [columns, setColumns] = useState({
    todo: {
      title: 'To Do',
      items: [
        { id: 1, title: 'Task 1', attachments: [] },
        { id: 2, title: 'Task 2', attachments: [] },
        { id: 3, title: 'Task 3', attachments: [] },
        { id: 4, title: 'Task 4', attachments: [] },
        { id: 5, title: 'Task 5', attachments: [] },
        { id: 6, title: 'Task 6', attachments: [] },
        { id: 7, title: 'Task 7', attachments: [] },
        { id: 8, title: 'Task 8', attachments: [] },
        { id: 9, title: 'Task 9', attachments: [] },
        { id: 10, title: 'Task 10', attachments: [] },
        { id: 11, title: 'Task 11', attachments: [] },
        { id: 12, title: 'Task 12', attachments: [] },
        { id: 13, title: 'Task 13', attachments: [] },
        { id: 14, title: 'Task 14', attachments: [] },
        { id: 15, title: 'Task 15', attachments: [] },
        { id: 16, title: 'Task 16', attachments: [] },
        { id: 17, title: 'Task 17', attachments: [] },
        { id: 18, title: 'Task 18', attachments: [] },
        { id: 19, title: 'Task 19', attachments: [] },
        { id: 20, title: 'Task 20', attachments: [] },
      ]
    },
    inProgress: {
      title: 'In Progress',
      items: [
        { id: 21, title: 'Task 21', attachments: [] },
        { id: 22, title: 'Task 22', attachments: [] },
        { id: 23, title: 'Task 23', attachments: [] },
        { id: 24, title: 'Task 24', attachments: [] },
      ]
    },
    done: {
      title: 'Done',
      items: [
        { id: 25, title: 'Task 25', attachments: [] },
        { id: 26, title: 'Task 26', attachments: [] },
        { id: 27, title: 'Task 27', attachments: [] },
        { id: 28, title: 'Task 28', attachments: [] },
      ]
    },
    review: {
      title: 'Under Review',
      items: [
        { id: 29, title: 'Task 29', attachments: [] },
        { id: 30, title: 'Task 30', attachments: [] },
        { id: 31, title: 'Task 31', attachments: [] },
        { id: 32, title: 'Task 32', attachments: [] },
      ]
    },
    backlog: {
      title: 'Backlog',
      items: [
        { id: 33, title: 'Task 33', attachments: [] },
        { id: 34, title: 'Task 34', attachments: [] },
        { id: 35, title: 'Task 35', attachments: [] },
        { id: 36, title: 'Task 36', attachments: [] },
      ]
    }
  });

  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAttachmentClick = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const updateTaskAttachments = (taskId, newAttachments) => {
    setColumns(prev => {
      const newColumns = { ...prev };
      Object.keys(newColumns).forEach(columnKey => {
        newColumns[columnKey].items = newColumns[columnKey].items.map(item => {
          if (item.id === taskId) {
            return { ...item, attachments: [...item.attachments, ...newAttachments] };
          }
          return item;
        });
      });
      return newColumns;
    });
  };

  return (
    <div className="flex overflow-x-auto min-h-screen bg-gray-100 p-6 gap-6">
      {Object.entries(columns).map(([columnId, column]) => (
        <KanbanColumn
          key={columnId}
          title={column.title}
          items={column.items}
          onAttachmentClick={handleAttachmentClick}
        />
      ))}

      <AttachmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={selectedTask}
        updateTaskAttachments={updateTaskAttachments}
      />
    </div>
  );
};

export default KanbanBoard;
