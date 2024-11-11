import React, { useState, useEffect } from 'react';

const AttachmentModal = ({ isOpen, onClose, task, updateTaskAttachments }) => {
  const [files, setFiles] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [totalAttachments, setTotalAttachments] = useState(0);

  useEffect(() => {
    if (task) {
      const fetchTotalAttachments = async () => {
        try {
          const response = await fetch(`http://localhost:3000/file-count?taskId=${task.id}`);
          const data = await response.json();
          setTotalAttachments(data.count);
        } catch (error) {
          console.error('Error fetching total attachments:', error);
        }
      };

      if (isOpen) {
        fetchTotalAttachments();
      }
    }
  }, [isOpen, task]);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    if (files.length > 0 && task) {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('file', file);
      });

      try {
        const response = await fetch('http://localhost:3000/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const uploadedFile = await response.json();
          if (uploadedFile && uploadedFile.filename) {
            const newAttachment = {
              originalName: uploadedFile.filename,
              extension: uploadedFile.filename.split('.').pop(),
            };
            setAttachments((prevAttachments) => [...prevAttachments, newAttachment]);
            setFiles([]); // Clear the files state
            setSuccessMessage('Attachment added successfully!');
            setTimeout(() => setSuccessMessage(''), 3000); // Clear the message after 3 seconds
            // Update the total attachments count
            setTotalAttachments(prevCount => prevCount + 1);
            // Update the task's attachments
            updateTaskAttachments(task.id, [newAttachment]);
            // Dispatch custom event to update attachment count in KanbanCard
            const event = new CustomEvent('attachmentUpdate', {
              detail: { taskId: task.id, count: totalAttachments + 1 }
            });
            window.dispatchEvent(event);
          } else {
            console.error('Unexpected response format:', uploadedFile);
          }
        } else {
          console.error('Error uploading files');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };
  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Attachments for {task?.title}</h2>
          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
              {successMessage}
            </div>
          )}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Current Attachments ({attachments.length})</h3>
            <div className="space-y-2">
              {attachments.map((file, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-gray-700">{file.originalName}</span>
                  <span className="text-gray-500 text-sm">{file.extension}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={handleUpload} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
              Upload
            </button>
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttachmentModal;
