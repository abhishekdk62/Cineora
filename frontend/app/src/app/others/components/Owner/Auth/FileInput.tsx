'use client';

import React, { useState } from 'react';
import { Upload, X, CheckCircle, Loader2 } from 'lucide-react';
import { uploadKYCImage } from '@/app/others/services/ownerServices/uploadKYCImages';


interface FileUploadInputProps {
  label: string;
  folder: string;
  required?: boolean;
  accept?: string;
  onUploadComplete: (url: string) => void;
  onUploadStart?: () => void;
  onUploadError?: (error: string) => void;
  className?: string;
}

interface FileState {
  file: File | null;
  url: string | null;
  uploading: boolean;
  uploaded: boolean;
  error: string | null;
}

export default function FileUploadInput({
  label,
  folder,
  required = false,
  accept = "image/*,application/pdf",
  onUploadComplete,
  onUploadStart,
  onUploadError,
  className = ""
}: FileUploadInputProps) {
  const [fileState, setFileState] = useState<FileState>({
    file: null,
    url: null,
    uploading: false,
    uploaded: false,
    error: null
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      const error = 'File size too large. Maximum 5MB allowed.';
      setFileState({
        file,
        url: null,
        uploading: false,
        uploaded: false,
        error
      });
      onUploadError?.(error);
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      const error = 'Invalid file type. Only JPEG, PNG, and PDF files are allowed.';
      setFileState({
        file,
        url: null,
        uploading: false,
        uploaded: false,
        error
      });
      onUploadError?.(error);
      return;
    }

    setFileState({
      file,
      url: null,
      uploading: true,
      uploaded: false,
      error: null
    });

    onUploadStart?.();

    try {
      const result = await uploadKYCImage(file, folder);
      
      if (result.success && result.url) {
        setFileState({
          file,
          url: result.url,
          uploading: false,
          uploaded: true,
          error: null
        });
        onUploadComplete(result.url);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setFileState({
        file,
        url: null,
        uploading: false,
        uploaded: false,
        error: errorMessage
      });
      onUploadError?.(errorMessage);
    }

    e.target.value = '';
  };

  const removeFile = () => {
    setFileState({
      file: null,
      url: null,
      uploading: false,
      uploaded: false,
      error: null
    });
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-200 mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      
      {!fileState.file ? (
        <div className="relative">
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
            id={`upload-${folder.replace('/', '-')}`}
          />
          <label
            htmlFor={`upload-${folder.replace('/', '-')}`}
            className="flex cursor-pointer items-center w-full justify-center px-4 py-3 border border-white/20 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors duration-200"
          >
            <Upload className="w-4 h-4 mr-2" />
            Choose file
          </label>
        </div>
      ) : (
        <div className="border border-white/20 rounded-lg bg-white/5 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center flex-1 min-w-0">
              {fileState.uploading && (
                <Loader2 className="w-4 h-4 text-blue-400 mr-2 flex-shrink-0 animate-spin" />
              )}
              {fileState.uploaded && (
                <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
              )}
              {fileState.error && (
                <X className="w-4 h-4 text-red-400 mr-2 flex-shrink-0" />
              )}
              <span className="text-sm text-white truncate">
                {fileState.file.name}
              </span>
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="ml-2 text-gray-400 hover:text-white flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {fileState.uploading && (
            <p className="text-xs text-blue-400 mt-1">Uploading to cloud...</p>
          )}
          {fileState.uploaded && (
            <p className="text-xs text-green-400 mt-1">✓ Uploaded successfully</p>
          )}
          {fileState.error && (
            <p className="text-xs text-red-400 mt-1">{fileState.error}</p>
          )}
        </div>
      )}
    </div>
  );
}
