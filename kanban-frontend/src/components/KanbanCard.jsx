import React, { useEffect, useState } from 'react';

const KanbanCard = ({ task, onAttachmentClick }) => {
  const [attachmentCount, setAttachmentCount] = useState(() => {
    const savedCount = localStorage.getItem(`attachmentCount-${task.id}`);
    return savedCount ? JSON.parse(savedCount) : 0;
  });

  useEffect(() => {
    const fetchAttachmentCount = async () => {
      try {
        const response = await fetch(`http://localhost:3000/file-count?taskId=${task.id}`);
        const data = await response.json();
        setAttachmentCount(data.count);
        localStorage.setItem(`attachmentCount-${task.id}`, JSON.stringify(data.count));
      } catch (error) {
        console.error('Error fetching attachment count:', error);
      }
    };

    fetchAttachmentCount();

    const handleAttachmentUpdate = (event) => {
      if (event.detail.taskId === task.id) {
        setAttachmentCount(event.detail.count);
        localStorage.setItem(`attachmentCount-${task.id}`, JSON.stringify(event.detail.count));
      }
    };

    window.addEventListener('attachmentUpdate', handleAttachmentUpdate);

    return () => {
      window.removeEventListener('attachmentUpdate', handleAttachmentUpdate);
    };
  }, [task.id]);

  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <img
            src={task.clientImage || 'https://via.placeholder.com/150'}
            alt="Client"
            className="w-8 h-8 rounded-full mr-2"
          />
          <div>
            <p className="text-sm font-medium text-gray-800">{task.clientName || 'Client Name'}</p>
            <p className="text-xs text-gray-500">{task.assignee}</p>
          </div>
        </div>
        <div className="text-sm text-gray-500 flex items-center">
          <img
            src="https://via.placeholder.com/30"
            alt="Demo User"
            className="w-6 h-6 rounded-full mr-2"
          />
          <span className='font-bold'>Sadik Istiak</span>
        </div>
      </div>

      <div className="flex flex-col mb-3">
        <p className="text-sm font-medium text-gray-800 mb-1">
          {task.title || 'Demo Task Title'}
        </p>
        <p className="text-sm text-gray-600 mb-0">
          {'Lorem ipsum dolor sit amet.'}
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {task.participants && task.participants.length > 0 ? (
            task.participants.map((participant, index) => (
              <img
                key={index}
                src={participant.image || 'https://via.placeholder.com/150'}
                alt="Participant"
                className="w-6 h-6 rounded-full border-2 border-white -ml-2"
                style={{ zIndex: task.participants.length - index }}
              />
            ))
          ) : (
            <>
              <img
                src="https://via.placeholder.com/150"
                alt="Demo Participant 1"
                className="w-6 h-6 rounded-full border-2 border-white -ml-2"
              />
              <img
                src="https://via.placeholder.com/150"
                alt="Demo Participant 2"
                className="w-6 h-6 rounded-full border-2 border-white -ml-2"
              />
            </>
          )}
          <span className="ml-2 text-sm text-gray-600">{task.participants ? `${task.participants.length}+` : '12+'}</span>
        </div>

        <div className="flex items-center space-x-3 text-gray-600 text-xs">
          <div className="flex items-center">
            <i className="far fa-comment-dots"></i>
            <span className="ml-1">{task.commentsCount || 0}</span>
          </div>
          <div className="flex items-center">
            <button 
              onClick={() => onAttachmentClick(task)}
              className="flex items-center gap-1 hover:text-blue-600 transition-colors"
            >
              <i className="fas fa-paperclip" />
              <span className="ml-1">{attachmentCount}</span>
            </button>
          </div>
          <div className="flex items-center">
            <i className="far fa-calendar-alt"></i>
            <span className="ml-1">{task.date || '12/11.2024'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanbanCard;
