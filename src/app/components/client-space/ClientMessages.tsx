'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { ConversationList } from '@/app/components/messaging/ConversationList';
import { ChatThread } from '@/app/components/messaging/ChatThread';
import {
  messagesApi,
  type Conversation,
  type ChatMessage,
  type ConversationFilter,
} from '@/app/services/api';

export function ClientMessages() {
  const { user } = useAuth();
  const currentUserId = user?.id ?? 0;
  const searchParams = useSearchParams();

  // Conversations state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(true);

  // Selected conversation - init from URL param
  const conversationParam = searchParams?.get('conversation');
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(
    conversationParam ? parseInt(conversationParam, 10) : null
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Filters & search
  const [activeFilter, setActiveFilter] = useState<ConversationFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId) || null;

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      setLoadingConversations(true);
      const res = await messagesApi.getConversations({
        role: 'guest',
        filter: activeFilter,
        search: searchQuery || undefined,
      });
      setConversations(res.conversations);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setConversations([]);
    } finally {
      setLoadingConversations(false);
    }
  }, [activeFilter, searchQuery]);

  useEffect(() => {
    if (currentUserId) fetchConversations();
  }, [fetchConversations, currentUserId]);

  // Fetch messages
  useEffect(() => {
    if (!selectedConversationId) {
      setMessages([]);
      return;
    }

    let cancelled = false;

    async function loadMessages() {
      try {
        setLoadingMessages(true);
        const res = await messagesApi.getMessages(selectedConversationId!);
        if (!cancelled) {
          setMessages(res.messages);
          if (res.conversation.unread_count > 0) {
            await messagesApi.markAsRead(selectedConversationId!);
            setConversations((prev) =>
              prev.map((c) =>
                c.id === selectedConversationId ? { ...c, unread_count: 0 } : c
              )
            );
            window.dispatchEvent(new Event('unread-count-changed'));
          }
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
      } finally {
        if (!cancelled) setLoadingMessages(false);
      }
    }

    loadMessages();
    return () => { cancelled = true; };
  }, [selectedConversationId]);

  // Send message
  const handleSendMessage = useCallback(async (text: string) => {
    if (!selectedConversationId) return;
    try {
      const res = await messagesApi.sendMessage(selectedConversationId, text);
      setMessages((prev) => [...prev, res.data]);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === selectedConversationId
            ? {
                ...c,
                last_message: {
                  text: res.data.text || '',
                  sender_id: res.data.sender_id,
                  created_at: res.data.created_at,
                  has_image: !!res.data.image_url,
                },
                updated_at: res.data.created_at,
              }
            : c
        )
      );
    } catch (err) {
      console.error('Error sending message:', err);
    }
  }, [selectedConversationId]);

  // Send image
  const handleSendImage = useCallback(async (file: File, text?: string) => {
    if (!selectedConversationId) return;
    try {
      const res = await messagesApi.sendImage(selectedConversationId, file, text);
      setMessages((prev) => [...prev, res.data]);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === selectedConversationId
            ? {
                ...c,
                last_message: {
                  text: res.data.text || '',
                  sender_id: res.data.sender_id,
                  created_at: res.data.created_at,
                  has_image: !!res.data.image_url,
                },
                updated_at: res.data.created_at,
              }
            : c
        )
      );
    } catch (err) {
      console.error('Error sending image:', err);
    }
  }, [selectedConversationId]);

  // Actions
  const handleMarkAsRead = useCallback(async (convId: number) => {
    try {
      await messagesApi.markAsRead(convId);
      setConversations((prev) =>
        prev.map((c) => (c.id === convId ? { ...c, unread_count: 0 } : c))
      );
      window.dispatchEvent(new Event('unread-count-changed'));
    } catch (err) {
      console.error('Error:', err);
    }
  }, []);

  const handleMarkAsUnread = useCallback(async (convId: number) => {
    try {
      await messagesApi.markAsUnread(convId);
      setConversations((prev) =>
        prev.map((c) => (c.id === convId ? { ...c, unread_count: 1 } : c))
      );
      window.dispatchEvent(new Event('unread-count-changed'));
    } catch (err) {
      console.error('Error:', err);
    }
  }, []);

  const handleArchive = useCallback(async (convId: number) => {
    try {
      await messagesApi.archiveConversation(convId);
      setConversations((prev) => prev.filter((c) => c.id !== convId));
      if (selectedConversationId === convId) setSelectedConversationId(null);
    } catch (err) {
      console.error('Error:', err);
    }
  }, [selectedConversationId]);

  return (
    <div className="flex h-[calc(100vh-2rem)] lg:h-screen bg-white -m-4 md:-m-6 lg:-m-8 rounded-xl lg:rounded-none overflow-hidden border border-gray-200 lg:border-0">
      {/* Conversation List */}
      <div
        className={`w-full md:w-[360px] border-r border-gray-200 flex-col bg-white flex-shrink-0 ${
          selectedConversationId ? 'hidden md:flex' : 'flex'
        }`}
      >
        {loadingConversations ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
          </div>
        ) : (
          <ConversationList
            conversations={conversations}
            selectedId={selectedConversationId}
            onSelect={setSelectedConversationId}
            currentUserId={currentUserId}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            showHostFilters={false}
            onMarkAsRead={handleMarkAsRead}
            onMarkAsUnread={handleMarkAsUnread}
            onArchive={handleArchive}
          />
        )}
      </div>

      {/* Chat Thread */}
      <div
        className={`flex-1 flex-col bg-white ${
          !selectedConversationId ? 'hidden md:flex' : 'flex'
        }`}
      >
        {selectedConversation ? (
          <ChatThread
            conversation={selectedConversation}
            messages={messages}
            currentUserId={currentUserId}
            onSendMessage={handleSendMessage}
            onSendImage={handleSendImage}
            onBack={() => setSelectedConversationId(null)}
            loading={loadingMessages}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 border-2 border-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <p className="text-base" style={{ color: '#717171' }}>
                Sélectionnez une conversation
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
