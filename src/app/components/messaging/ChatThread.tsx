import { useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { ChatMessage, Conversation } from '@/app/services/api';
import { MessageInput } from './MessageInput';

interface ChatThreadProps {
  conversation: Conversation;
  messages: ChatMessage[];
  currentUserId: number;
  onSendMessage: (text: string) => void;
  onSendImage: (file: File, text?: string) => void;
  onBack: () => void;
  loading?: boolean;
}

function formatMessageTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatMessageDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return 'Hier';
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

function groupMessagesByDate(messages: ChatMessage[]): { date: string; messages: ChatMessage[] }[] {
  const groups: { date: string; messages: ChatMessage[] }[] = [];
  let currentDate = '';

  for (const msg of messages) {
    const msgDate = new Date(msg.created_at).toDateString();
    if (msgDate !== currentDate) {
      currentDate = msgDate;
      groups.push({ date: msg.created_at, messages: [msg] });
    } else {
      groups[groups.length - 1].messages.push(msg);
    }
  }

  return groups;
}

function getOtherParticipant(conversation: Conversation, currentUserId: number) {
  return conversation.host.id === currentUserId ? conversation.guest : conversation.host;
}

export function ChatThread({
  conversation,
  messages,
  currentUserId,
  onSendMessage,
  onSendImage,
  onBack,
  loading,
}: ChatThreadProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const other = getOtherParticipant(conversation, currentUserId);
  const groupedMessages = groupMessagesByDate(messages);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
        <button
          onClick={onBack}
          className="md:hidden p-1 mr-1 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" style={{ color: '#222222' }} />
        </button>
        {other.profile_photo_url ? (
          <img
            src={other.profile_photo_url}
            alt={other.first_name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm" style={{ fontWeight: 600 }}>
            {other.first_name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-base truncate" style={{ fontWeight: 600, color: '#222222' }}>
            {other.first_name} {other.last_name}
          </h3>
          <p className="text-xs truncate" style={{ color: '#717171' }}>
            {conversation.reservation?.listing?.title || conversation.listing?.title || 'Message direct'}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {groupedMessages.map((group, groupIdx) => (
              <div key={groupIdx}>
                {/* Date separator */}
                <div className="flex items-center justify-center mb-4">
                  <span className="text-xs px-3 py-1 bg-gray-100 rounded-full" style={{ color: '#717171' }}>
                    {formatMessageDate(group.date)}
                  </span>
                </div>

                {/* Messages */}
                <div className="space-y-2">
                  {group.messages.map((msg) => {
                    const isMe = msg.sender_id === currentUserId;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-2xl ${
                            isMe
                              ? 'bg-black text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          {/* Image */}
                          {msg.image_url && (
                            <img
                              src={msg.image_url}
                              alt=""
                              className="rounded-t-2xl max-h-64 w-full object-cover"
                              style={!msg.text ? { borderRadius: '1rem 1rem 0 0' } : undefined}
                            />
                          )}

                          {/* Text */}
                          <div className="px-4 py-2">
                            {msg.text && (
                              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                            )}
                            <span
                              className={`text-xs mt-1 block ${
                                isMe ? 'text-gray-400' : 'text-gray-500'
                              }`}
                            >
                              {formatMessageTime(msg.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <MessageInput
        onSendMessage={onSendMessage}
        onSendImage={onSendImage}
        disabled={loading}
      />
    </div>
  );
}
