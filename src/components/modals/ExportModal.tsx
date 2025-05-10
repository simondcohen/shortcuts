import React, { useState } from 'react';
import { Download, Clipboard, Check } from 'lucide-react';
import Button from '../common/Button';
import { Item } from '../../types';

interface ExportModalProps {
  items: Item[];
  onClose: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ items, onClose }) => {
  const [copied, setCopied] = useState(false);
  
  const jsonData = JSON.stringify(items, null, 2);
  
  const handleDownload = () => {
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shortcuts-export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(jsonData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Export Data</h2>
        
        <p className="text-gray-600 mb-6">
          Export your shortcuts as a JSON file or copy the data to your clipboard.
        </p>
        
        <div className="space-y-4">
          <Button
            onClick={handleDownload}
            variant="primary"
            size="md"
            className="bg-blue-600 hover:bg-blue-700 w-full justify-center"
          >
            <Download className="h-5 w-5 mr-2" />
            Download JSON File
          </Button>
          
          <Button
            onClick={handleCopyToClipboard}
            variant="outline"
            size="md"
            className="text-gray-700 hover:bg-gray-100 w-full justify-center"
          >
            {copied ? (
              <>
                <Check className="h-5 w-5 mr-2" />
                Copied to Clipboard
              </>
            ) : (
              <>
                <Clipboard className="h-5 w-5 mr-2" />
                Copy to Clipboard
              </>
            )}
          </Button>
        </div>
        
        <div className="mt-6 text-right">
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal; 