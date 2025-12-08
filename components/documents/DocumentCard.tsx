'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

import { Calendar, FileText, HardDrive, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { UploadedFileResponse } from '@/lib/types';
import { formatDate, formatFileSize } from '@/lib/utils';

interface DocumentCardProps {
  document: UploadedFileResponse;
  onDelete: (fileId: string) => void;
}

export function DocumentCard({ document, onDelete }: DocumentCardProps) {
  const t = useTranslations('documents');
  const tCommon = useTranslations('common');

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(document.file_id);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting document:', error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 shadow-md hover:shadow-xl hover:border-blue-400 transition-all duration-300 hover:scale-[1.02]">
        {/* Header */}
        <div className="flex items-start justify-between mb-4 gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0 overflow-hidden">
            <FileText className="w-10 h-10 text-[var(--md-sys-color-primary)] flex-shrink-0" />
            <div className="flex-1 min-w-0 overflow-hidden">
              <h3
                className="font-medium text-[var(--md-sys-color-on-surface)] break-words line-clamp-2"
                title={document.filename}
              >
                {document.filename}
              </h3>
              <p className="text-xs text-[var(--md-sys-color-on-surface-variant)] mt-2 break-words">
                {document.content_type}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-standard flex-shrink-0"
            title={t('card.delete')}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        {/* Metadata */}
        <div className="space-y-2 text-sm text-[var(--md-sys-color-on-surface-variant)]">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4" />
            <span>{formatFileSize(document.size_bytes)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(document.last_modified)}</span>
          </div>
        </div>

        {/* Additional metadata if available */}
        {Object.keys(document.metadata).length > 0 && (
          <div className="mt-4 pt-4 border-t border-[var(--md-sys-color-outline)]">
            <p className="text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] mb-2">
              {tCommon('metadata')}:
            </p>
            <div className="space-y-1">
              {Object.entries(document.metadata).map(([key, value]) => (
                <div key={key} className="text-xs text-[var(--md-sys-color-on-surface-variant)]">
                  <span className="font-medium">{key}:</span> {value}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title={t('delete.title')}
      >
        <div className="space-y-4">
          <p className="text-[var(--md-sys-color-on-surface)]">
            {t.rich('delete.message', {
              filename: document.filename,
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </p>
          <p className="text-sm text-[var(--md-sys-color-on-surface-variant)]">
            {t('delete.warning')}
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="text" onClick={() => setShowDeleteModal(false)} disabled={deleting}>
              {tCommon('cancel')}
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? tCommon('deleting') : tCommon('delete')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
