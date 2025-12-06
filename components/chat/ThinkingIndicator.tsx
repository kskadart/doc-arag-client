'use client';

import React from 'react';

interface ThinkingIndicatorProps {
  message?: string;
}

export function ThinkingIndicator({ message = 'Thinking...' }: ThinkingIndicatorProps) {
  return (
    <div className="flex justify-start mb-4">
      <div className="chat-message-ai flex items-center gap-2">
        <div className="flex gap-1">
          <div
            className="w-2 h-2 bg-[var(--md-sys-color-primary)] rounded-full animate-bounce"
            style={{ animationDelay: '0ms' }}
          />
          <div
            className="w-2 h-2 bg-[var(--md-sys-color-primary)] rounded-full animate-bounce"
            style={{ animationDelay: '150ms' }}
          />
          <div
            className="w-2 h-2 bg-[var(--md-sys-color-primary)] rounded-full animate-bounce"
            style={{ animationDelay: '300ms' }}
          />
        </div>
        <span className="text-sm text-[var(--md-sys-color-on-surface-variant)]">{message}</span>
      </div>
    </div>
  );
}
