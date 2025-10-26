'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import { Home } from 'lucide-react';

import { ChatHistory } from '@/components/chat/ChatHistory';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ThinkingIndicator } from '@/components/chat/ThinkingIndicator';
import { apiClient } from '@/lib/api';
import { Link } from '@/lib/navigation';
import { ApiError, ChatMessage as ChatMessageType, ChatSession } from '@/lib/types';
import { generateId, storage } from '@/lib/utils';

const SESSIONS_KEY = 'arag_chat_sessions';
const CURRENT_SESSION_KEY = 'arag_current_session';

export default function ChatPage() {
  const t = useTranslations('chat');
  const tCommon = useTranslations('common');

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [_error, _setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentSession = sessions.find((s) => s.id === currentSessionId);

  // Load sessions from localStorage
  useEffect(() => {
    const savedSessions = storage.get<ChatSession[]>(SESSIONS_KEY, []);
    const savedCurrentId = storage.get<string | null>(CURRENT_SESSION_KEY, null);

    setSessions(savedSessions);

    if (savedCurrentId && savedSessions.some((s) => s.id === savedCurrentId)) {
      setCurrentSessionId(savedCurrentId);
    } else if (savedSessions.length > 0) {
      setCurrentSessionId(savedSessions[0].id);
    }
  }, []);

  // Save sessions to localStorage
  useEffect(() => {
    if (sessions.length > 0) {
      storage.set(SESSIONS_KEY, sessions);
    }
  }, [sessions]);

  // Save current session ID
  useEffect(() => {
    if (currentSessionId) {
      storage.set(CURRENT_SESSION_KEY, currentSessionId);
    }
  }, [currentSessionId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages]);

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: generateId(),
      title: '', // Empty title will show translated "New Chat"
      messages: [],
      created_at: new Date(),
      updated_at: new Date(),
    };

    setSessions([newSession, ...sessions]);
    setCurrentSessionId(newSession.id);
    _setError(null);
  };

  const updateSessionTitle = (sessionId: string, firstMessage: string) => {
    setSessions(
      sessions.map((s) =>
        s.id === sessionId
          ? { ...s, title: firstMessage.slice(0, 50) + (firstMessage.length > 50 ? '...' : '') }
          : s
      )
    );
  };

  const addMessage = (sessionId: string, message: ChatMessageType) => {
    setSessions(
      sessions.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              messages: [...s.messages, message],
              updated_at: new Date(),
            }
          : s
      )
    );
  };

  const deleteSession = (sessionId: string) => {
    const newSessions = sessions.filter((s) => s.id !== sessionId);
    setSessions(newSessions);

    if (currentSessionId === sessionId) {
      setCurrentSessionId(newSessions.length > 0 ? newSessions[0].id : null);
    }
  };

  const handleSendMessage = async (content: string) => {
    let sessionId = currentSessionId;

    // Create new session if none exists
    if (!sessionId) {
      const newSession: ChatSession = {
        id: generateId(),
        title: '',
        messages: [],
        created_at: new Date(),
        updated_at: new Date(),
      };

      setSessions([newSession, ...sessions]);
      sessionId = newSession.id;
      setCurrentSessionId(sessionId);
    }

    const userMessage: ChatMessageType = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    // Add user message immediately and persist to localStorage
    setSessions((prevSessions) => {
      const updated = prevSessions.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              messages: [...s.messages, userMessage],
              title: s.title || content.slice(0, 50) + (content.length > 50 ? '...' : ''),
              updated_at: new Date(),
            }
          : s
      );
      return updated;
    });

    setLoading(true);
    _setError(null);

    try {
      const response = await apiClient.query({
        query: content,
        domain: 'DefaultDocuments',
        max_iterations: 2,
      });

      const assistantMessage: ChatMessageType = {
        id: generateId(),
        role: 'assistant',
        content: response.answer,
        timestamp: new Date(),
        confidence: response.confidence,
        sources_used: response.sources_used,
        rephrased_query: response.rephrased_query || undefined,
      };

      // Add assistant response
      setSessions((prevSessions) =>
        prevSessions.map((s) =>
          s.id === sessionId
            ? {
                ...s,
                messages: [...s.messages, assistantMessage],
                updated_at: new Date(),
              }
            : s
        )
      );
    } catch (err) {
      const apiError = err as ApiError;
      let errorDetail = apiError.detail || 'Unknown error';

      // Extra protection: sanitize any HTML that might have slipped through
      if (errorDetail.includes('<!DOCTYPE html>') || errorDetail.includes('<html')) {
        errorDetail = 'Service is unavailable. Please check your connection.';
      }

      // Use specific translation for service unavailable
      const errorMsg =
        errorDetail === 'Service is unavailable. Please check your connection.'
          ? t('serviceUnavailable')
          : t('error', { error: errorDetail });

      _setError(errorDetail);

      const errorMessage: ChatMessageType = {
        id: generateId(),
        role: 'assistant',
        content: errorMsg,
        timestamp: new Date(),
      };

      // Add error message to chat
      setSessions((prevSessions) =>
        prevSessions.map((s) =>
          s.id === sessionId
            ? {
                ...s,
                messages: [...s.messages, errorMessage],
                updated_at: new Date(),
              }
            : s
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[var(--md-sys-color-background)]">
      {/* Sidebar */}
      <ChatHistory
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={setCurrentSessionId}
        onDeleteSession={deleteSession}
        onNewChat={createNewSession}
      />

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface)]">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 rounded-full hover:bg-[var(--md-sys-color-surface-variant)] transition-standard"
              title={tCommon('home')}
            >
              <Home className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-semibold text-[var(--md-sys-color-on-surface)]">
              {currentSession?.title &&
              currentSession.title !== '' &&
              currentSession.title !== 'New Chat' &&
              currentSession.title !== 'Новый чат'
                ? currentSession.title
                : t('sidebar.newChat')}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/documents"
              className="py-2 border-2 border-[var(--md-sys-color-outline)] text-[var(--md-sys-color-primary)] rounded-full hover:bg-[var(--md-sys-color-surface-variant)] transition-standard"
              style={{ paddingLeft: '1.05rem', paddingRight: '1.05rem' }}
            >
              {t('goToDocuments')}
            </Link>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto py-6">
          {!currentSession || currentSession.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <h2 className="text-2xl font-semibold text-[var(--md-sys-color-on-surface)] mb-4">
                {t('welcome.title')}
              </h2>
              <p className="text-[var(--md-sys-color-on-surface-variant)] max-w-md">
                {t('welcome.description')}
              </p>
            </div>
          ) : (
            <>
              {currentSession.messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {loading && <ThinkingIndicator message={t('thinking')} />}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        {currentSession !== undefined && (
          <ChatInput
            onSend={handleSendMessage}
            disabled={loading}
            placeholder={
              currentSession.messages.length === 0 ? t('input.placeholder') : t('input.followUp')
            }
          />
        )}
      </div>
    </div>
  );
}
