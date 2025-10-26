'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import { ChevronLeft, ChevronRight, FileX, Loader2 } from 'lucide-react';

import { apiClient } from '@/lib/api';
import { UploadedFileResponse } from '@/lib/types';

import { DocumentCard } from './DocumentCard';

interface DocumentListProps {
  refreshTrigger?: number;
}

export function DocumentList({ refreshTrigger = 0 }: DocumentListProps) {
  const t = useTranslations('documents');
  const _tCommon = useTranslations('common');

  const [documents, setDocuments] = useState<UploadedFileResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 12;

  const totalPages = Math.ceil(total / pageSize);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.listDocuments(page, pageSize);
      setDocuments(response.files);
      setTotal(response.total);
    } catch (err: any) {
      setError(err.detail || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchDocuments();
  }, [page, refreshTrigger, fetchDocuments]);

  const handleDelete = async (fileId: string) => {
    try {
      await apiClient.deleteDocument(fileId);
      fetchDocuments(); // Refresh the list
    } catch (err: any) {
      setError(err.detail || 'Failed to delete document');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--md-sys-color-primary)]" />
      </div>
    );
  }

  if (error) {
    const displayError =
      error === 'Service is unavailable. Please check your connection.'
        ? t('error.serviceUnavailable')
        : error;

    return (
      <div
        className="flex items-center justify-center"
        style={{ minHeight: '60vh', paddingTop: '0', marginTop: '-15vh' }}
      >
        <div className="flex flex-col items-center text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6">
            <FileX className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3" style={{ color: '#1a1a1a' }}>
            {t('error.title')}
          </h3>
          <p className="text-base mb-6" style={{ color: '#595959' }}>
            {displayError}
          </p>
          <button
            onClick={fetchDocuments}
            className="py-3 rounded-lg font-medium transition-colors duration-200 hover:opacity-90"
            style={{
              backgroundColor: '#1a1a1a',
              color: '#ffffff',
              paddingLeft: '2.1rem',
              paddingRight: '2.1rem',
            }}
          >
            {t('error.retry')}
          </button>
        </div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <FileX className="w-16 h-16 text-[var(--md-sys-color-on-surface-variant)] mb-4" />
        <h3 className="text-xl font-medium text-[var(--md-sys-color-on-surface)] mb-2">
          {t('empty.title')}
        </h3>
        <p className="text-[var(--md-sys-color-on-surface-variant)]">{t('empty.description')}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Document grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {documents.map((doc) => (
          <DocumentCard key={doc.file_id} document={doc} onDelete={handleDelete} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-full hover:bg-[var(--md-sys-color-surface-variant)] transition-standard disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--md-sys-color-on-surface)]">
              Page {page} of {totalPages}
            </span>
            <span className="text-xs text-[var(--md-sys-color-on-surface-variant)]">
              ({total} total)
            </span>
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-full hover:bg-[var(--md-sys-color-surface-variant)] transition-standard disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
