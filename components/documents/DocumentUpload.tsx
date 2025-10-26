'use client';

import React, { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import { AlertCircle, FileText, Upload, X } from 'lucide-react';

import { apiClient } from '@/lib/api';
import { formatFileSize } from '@/lib/utils';

import { TaskProgress } from './TaskProgress';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
];

interface DocumentUploadProps {
  onUploadComplete: () => void;
}

export function DocumentUpload({ onUploadComplete }: DocumentUploadProps) {
  const t = useTranslations('documents.upload');
  const tCommon = useTranslations('common');

  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return t('errors.unsupportedType');
    }
    if (file.size > MAX_FILE_SIZE) {
      return t('errors.tooLarge', { size: formatFileSize(MAX_FILE_SIZE) });
    }
    return null;
  };

  const handleFileSelect = (selectedFile: File) => {
    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      return;
    }
    setFile(selectedFile);
    setError(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      // Upload file
      const uploadResponse = await apiClient.uploadDocument(file);

      // Trigger embedding generation
      const embeddingResponse = await apiClient.generateEmbeddings(uploadResponse.file_id);
      setTaskId(embeddingResponse.task_id);
    } catch (err: any) {
      setError(err.detail || t('errors.uploadFailed'));
      setUploading(false);
    }
  };

  const handleTaskComplete = () => {
    setUploading(false);
    setFile(null);
    setTaskId(null);
    onUploadComplete();
  };

  const handleTaskError = (error: string) => {
    setError(error);
    setUploading(false);
    setTaskId(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Upload area */}
      {!taskId && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-3 border-dashed rounded-3xl p-12 text-center transition-all duration-300 ${
            isDragging
              ? 'border-blue-500 bg-blue-50 shadow-xl scale-105'
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50 bg-white shadow-lg'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0];
              if (selectedFile) handleFileSelect(selectedFile);
            }}
            className="hidden"
          />

          {!file ? (
            <>
              <Upload className="w-20 h-20 mx-auto mb-6 text-blue-500" />
              <p className="text-xl font-semibold text-gray-900 mb-2">{t('dropZone')}</p>
              <p className="text-base text-gray-600 mb-6">{t('orClick')}</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                {t('chooseFile')}
              </button>
              <p className="text-sm text-gray-500 mt-6">
                {t('formats', { size: formatFileSize(MAX_FILE_SIZE) })}
              </p>
            </>
          ) : (
            <div className="flex items-center justify-center gap-4 bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
              <FileText className="w-12 h-12 text-blue-600" />
              <div className="flex-1 text-left min-w-0">
                <p className="font-semibold text-gray-900 truncate">{file.name}</p>
                <p className="text-sm text-gray-600 mt-1">{formatFileSize(file.size)}</p>
              </div>
              <button
                onClick={() => setFile(null)}
                className="p-2 rounded-full hover:bg-blue-200 transition-all duration-200 flex-shrink-0"
              >
                <X className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Upload button */}
      {file && !taskId && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="px-10 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:scale-100"
          >
            {uploading ? tCommon('uploading') : t('uploadButton')}
          </button>
        </div>
      )}

      {/* Task progress */}
      {taskId && (
        <TaskProgress taskId={taskId} onComplete={handleTaskComplete} onError={handleTaskError} />
      )}
    </div>
  );
}
