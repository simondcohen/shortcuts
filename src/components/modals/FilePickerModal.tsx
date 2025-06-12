import React from 'react';
import Button from '../common/Button';

interface FilePickerModalProps {
  onPick: () => void;
}

const FilePickerModal: React.FC<FilePickerModalProps> = ({ onPick }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Data File</h2>
        <p className="text-gray-600 mb-6">Choose or create a JSON file to store your shortcuts.</p>
        <div className="flex justify-end">
          <Button onClick={onPick} variant="primary">
            Choose File
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilePickerModal;
