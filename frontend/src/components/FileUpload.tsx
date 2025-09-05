import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { ApiService } from '../services/api';
import type { ExtractedText, SupportedFormat } from '../types';

interface FileUploadProps {
  onFileProcessed: (extractedText: ExtractedText) => void;
  onError: (error: string) => void;
  onProcessingStart: () => void;
  isProcessing: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileProcessed,
  onError,
  onProcessingStart,
  isProcessing
}) => {
  const [supportedFormats, setSupportedFormats] = useState<SupportedFormat[]>([]);
  const [dragActive, setDragActive] = useState(false);

  // Load supported formats on component mount
  React.useEffect(() => {
    const loadSupportedFormats = async () => {
      try {
        const response = await ApiService.getSupportedFormats();
        setSupportedFormats(response.supportedFormats);
      } catch (error) {
        console.error('Failed to load supported formats:', error);
      }
    };
    loadSupportedFormats();
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setDragActive(false);
    onProcessingStart();

    try {
      const extractedText = await ApiService.uploadFile(file);
      onFileProcessed(extractedText);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to process file');
    }
  }, [onFileProcessed, onError, onProcessingStart]);

  const { getRootProps, getInputProps, isDragReject, fileRejections } = useDropzone({
    onDrop,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: isProcessing
  });

  const getDropzoneClassName = () => {
    let baseClasses = "relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer";
    
    if (isProcessing) {
      return baseClasses + " border-secondary-300 bg-secondary-50 cursor-not-allowed";
    }
    
    if (isDragReject || fileRejections.length > 0) {
      return baseClasses + " border-red-300 bg-red-50 hover:bg-red-100";
    }
    
    if (dragActive) {
      return baseClasses + " border-primary-400 bg-primary-50";
    }
    
    return baseClasses + " border-secondary-300 bg-white hover:border-primary-400 hover:bg-primary-50";
  };

  const getIcon = () => {
    if (isProcessing) {
      return <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>;
    }
    
    if (isDragReject || fileRejections.length > 0) {
      return <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />;
    }
    
    return <Upload className="h-12 w-12 text-secondary-500 mx-auto" />;
  };

  const getText = () => {
    if (isProcessing) {
      return (
        <div>
          <p className="text-lg font-medium text-secondary-700">Processing your document...</p>
          <p className="text-sm text-secondary-500 mt-2">Please wait while we extract the text</p>
        </div>
      );
    }
    
    if (isDragReject || fileRejections.length > 0) {
      return (
        <div>
          <p className="text-lg font-medium text-red-700">Invalid file type</p>
          <p className="text-sm text-red-500 mt-2">Please upload a PDF, DOCX, or TXT file</p>
        </div>
      );
    }
    
    return (
      <div>
        <p className="text-lg font-medium text-secondary-700">
          {dragActive ? 'Drop your document here' : 'Upload your document'}
        </p>
        <p className="text-sm text-secondary-500 mt-2">
          Drag and drop a file here, or click to select
        </p>
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div {...getRootProps()} className={getDropzoneClassName()}>
        <input {...getInputProps()} />
        
        <div className="space-y-4">
          {getIcon()}
          {getText()}
        </div>
      </div>

      {/* File rejection errors */}
      {fileRejections.length > 0 && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-red-800">File rejected</h4>
              <ul className="mt-1 text-sm text-red-700">
                {fileRejections.map(({ file, errors }) => (
                  <li key={file.name}>
                    <strong>{file.name}:</strong> {errors.map(e => e.message).join(', ')}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Supported formats info */}
      {supportedFormats.length > 0 && (
        <div className="mt-6 p-4 bg-secondary-50 rounded-lg">
          <div className="flex items-start">
            <FileText className="h-5 w-5 text-secondary-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-secondary-800 mb-2">Supported formats</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-secondary-600">
                {supportedFormats.map((format) => (
                  <div key={format.type} className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                    {format.type} ({format.extension})
                  </div>
                ))}
              </div>
              <p className="text-xs text-secondary-500 mt-2">
                Maximum file size: 10MB • Minimum: 10 words
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


