'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { TaskStatusResponse } from '@/lib/types';

interface TaskProgressProps {
  taskId: string;
  onComplete: () => void;
  onError: (error: string) => void;
}

export function TaskProgress({ taskId, onComplete, onError }: TaskProgressProps) {
  const t = useTranslations('documents.progress');
  const tCommon = useTranslations('common');
  
  const [status, setStatus] = useState<TaskStatusResponse | null>(null);

  useEffect(() => {
    const pollTask = async () => {
      try {
        await apiClient.pollTaskStatus(
          taskId,
          (taskStatus) => {
            setStatus(taskStatus);
          },
          2000
        );
        onComplete();
      } catch (error: any) {
        onError(error.message || 'Failed to process document');
      }
    };

    pollTask();
  }, [taskId, onComplete, onError]);

  if (!status) {
    return (
      <div className="mt-6 p-6 bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline)] rounded-2xl">
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-[var(--md-sys-color-primary)]" />
          <p className="text-[var(--md-sys-color-on-surface)]">{tCommon('loading')}</p>
        </div>
      </div>
    );
  }

  const progress =
    status.total_chunks > 0
      ? (status.chunks_processed / status.total_chunks) * 100
      : 0;

  return (
    <div className="mt-6 p-6 bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline)] rounded-2xl">
      {/* Status header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {status.status === 'completed' && (
            <CheckCircle className="w-6 h-6 text-green-600" />
          )}
          {status.status === 'failed' && (
            <XCircle className="w-6 h-6 text-red-600" />
          )}
          {status.status === 'processing' && (
            <Loader2 className="w-6 h-6 animate-spin text-[var(--md-sys-color-primary)]" />
          )}
          <div>
            <p className="font-medium text-[var(--md-sys-color-on-surface)]">
              {status.status === 'completed' && t('complete')}
              {status.status === 'failed' && t('error')}
              {status.status === 'processing' && t('processing')}
            </p>
            <p className="text-sm text-[var(--md-sys-color-on-surface-variant)]">
              {status.message}
            </p>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      {status.status === 'processing' && (
        <div>
          <div className="w-full bg-[var(--md-sys-color-surface-variant)] rounded-full h-2 mb-2 overflow-hidden">
            <div
              className="bg-[var(--md-sys-color-primary)] h-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-[var(--md-sys-color-on-surface-variant)] text-center">
            {t('chunks', { current: status.chunks_processed, total: status.total_chunks })} ({Math.round(progress)}%)
          </p>
        </div>
      )}

      {/* Completed state */}
      {status.status === 'completed' && (
        <div className="text-center text-sm text-green-600 dark:text-green-400">
          {t('complete')}
        </div>
      )}

      {/* Failed state */}
      {status.status === 'failed' && (
        <div className="text-center text-sm text-red-600 dark:text-red-400">
          {status.message}
        </div>
      )}
    </div>
  );
}
