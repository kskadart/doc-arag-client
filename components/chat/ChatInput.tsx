'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = 'Ask a question about your documents...',
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-3 p-4 bg-[var(--md-sys-color-surface)] border-t border-[var(--md-sys-color-outline)]"
    >
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={2}
          className="w-full px-4 py-3 pr-12 rounded-lg border-2 border-[var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface)] text-[var(--md-sys-color-on-surface)] focus:border-[var(--md-sys-color-primary)] focus:outline-none resize-none transition-standard disabled:bg-gray-100 disabled:text-gray-500"
        />
        <div className="absolute right-3 bottom-3 text-xs text-[var(--md-sys-color-on-surface-variant)]">
          {message.length > 0 && `${message.length}`}
        </div>
      </div>
      
      <button
        type="submit"
        disabled={disabled || !message.trim()}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] hover:shadow-[var(--md-sys-elevation-2)] active:shadow-[var(--md-sys-elevation-1)] transition-standard disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
        title="Send message (Enter)"
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  );
}

