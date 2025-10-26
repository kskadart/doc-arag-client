'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

import { MessageSquare, Plus, Trash2 } from 'lucide-react';

import { ChatSession } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface ChatHistoryProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onNewChat: () => void;
}

export function ChatHistory({
  sessions,
  currentSessionId,
  onSelectSession,
  onDeleteSession,
  onNewChat,
}: ChatHistoryProps) {
  const t = useTranslations('chat.sidebar');

  return (
    <div className="w-64 h-full bg-[var(--md-sys-color-surface)] border-r border-[var(--md-sys-color-outline)] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[var(--md-sys-color-outline)]">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] rounded-full hover:shadow-[var(--md-sys-elevation-2)] transition-standard"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">{t('newChat')}</span>
        </button>
      </div>

      {/* Session list */}
      <div className="flex-1 overflow-y-auto p-2">
        {sessions.length === 0 ? (
          <div className="text-center text-[var(--md-sys-color-on-surface-variant)] text-sm mt-8">
            {t('history')}
          </div>
        ) : (
          <div className="space-y-1">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`group relative flex items-start gap-2 p-3 rounded-lg cursor-pointer transition-standard ${
                  currentSessionId === session.id
                    ? 'bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)]'
                    : 'hover:bg-[var(--md-sys-color-surface-variant)]'
                }`}
                onClick={() => onSelectSession(session.id)}
              >
                <MessageSquare className="w-4 h-4 mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {session.title &&
                    session.title !== '' &&
                    session.title !== 'New Chat' &&
                    session.title !== 'Новый чат'
                      ? session.title
                      : t('newChat')}
                  </p>
                  <p className="text-xs text-[var(--md-sys-color-on-surface-variant)] mt-1">
                    {formatDate(session.updated_at)}
                  </p>
                  <p className="text-xs text-[var(--md-sys-color-on-surface-variant)]">
                    {session.messages.length} messages
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-[var(--md-sys-color-error)] hover:text-white transition-standard"
                  title="Delete chat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
