'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const t = useTranslations('chat.message');
  const [copied, setCopied] = React.useState(false);
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} px-4 py-2`}>
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[80%] min-w-0`}>
        {/* Message bubble */}
        <div
          className={`${
            isUser ? 'chat-message-user' : 'chat-message-ai'
          } transition-standard`}
          style={isUser ? {
            backgroundColor: '#1a1a1a',
            color: '#ffffff',
            border: '1px solid #e0e0e0',
            maxWidth: '100%',
            width: 'fit-content',
          } : undefined}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap break-words" style={{ margin: 0, maxWidth: '100%' }}>{message.content}</p>
          ) : (
            <div className="prose prose-sm max-w-none dark:prose-invert break-words">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-2 mt-1 px-2 text-xs text-[var(--md-sys-color-on-surface-variant)]">
          <span>{formatDate(message.timestamp)}</span>
          
          {!isUser && message.confidence !== undefined && (
            <span className="flex items-center gap-1">
              • {t('confidence')}: {Math.round(message.confidence * 100)}%
            </span>
          )}
          
          {!isUser && message.sources_used !== undefined && (
            <span>• {t('sources')}: {message.sources_used}</span>
          )}

          {!isUser && (
            <button
              onClick={handleCopy}
              className="ml-2 p-1 rounded hover:bg-[var(--md-sys-color-surface-variant)] transition-standard"
              title="Copy message"
            >
              {copied ? (
                <Check className="w-3 h-3 text-green-600" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          )}
        </div>

        {/* Rephrased query indicator */}
        {!isUser && message.rephrased_query && (
          <div className="mt-1 px-2 text-xs text-[var(--md-sys-color-on-surface-variant)] italic">
            {t('rephrasedQuery')}: "{message.rephrased_query}"
          </div>
        )}
      </div>
    </div>
  );
}
