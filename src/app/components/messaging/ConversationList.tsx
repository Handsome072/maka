import { Search, Archive, MailOpen, Mail, MoreHorizontal } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import type { Conversation, ConversationFilter } from '@/app/services/api';

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  currentUserId: number;
  // Search
  searchQuery: string;
  onSearchChange: (query: string) => void;
  // Filters (host mode)
  activeFilter: ConversationFilter;
  onFilterChange: (filter: ConversationFilter) => void;
  showHostFilters?: boolean;
  // Actions
  onMarkAsRead?: (id: number) => void;
  onMarkAsUnread?: (id: number) => void;
  onArchive?: (id: number) => void;
}

const HOST_FILTERS: { key: ConversationFilter; label: string }[] = [
  { key: 'all', label: 'Tout' },
  { key: 'pending', label: 'Demandes' },
  { key: 'upcoming', label: 'A venir' },
  { key: 'active', label: 'En cours' },
  { key: 'past', label: 'Passés' },
];

const GUEST_FILTERS: { key: ConversationFilter; label: string }[] = [
  { key: 'all', label: 'Tout' },
];

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) {
    return date.toLocaleDateString('fr-FR', { weekday: 'short' });
  }
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
}

function getOtherParticipant(conversation: Conversation, currentUserId: number) {
  return conversation.host.id === currentUserId ? conversation.guest : conversation.host;
}

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
  currentUserId,
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  showHostFilters = false,
  onMarkAsRead,
  onMarkAsUnread,
  onArchive,
}: ConversationListProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [contextMenuId, setContextMenuId] = useState<number | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filters = showHostFilters ? HOST_FILTERS : GUEST_FILTERS;

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
        setContextMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl md:text-2xl" style={{ fontWeight: 600, color: '#222222' }}>
            {showHostFilters ? 'Boîte de réception' : 'Messages'}
          </h1>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Search className="w-5 h-5" style={{ color: '#222222' }} />
          </button>
        </div>

        {/* Search bar */}
        {showSearch && (
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Rechercher par nom ou annonce..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => onFilterChange(f.key)}
              className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                activeFilter === f.key
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={{ fontWeight: 600 }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="w-16 h-16 border-2 border-gray-300 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <p className="text-sm text-center" style={{ color: '#717171' }}>
              {searchQuery ? 'Aucun résultat trouvé' : 'Aucune conversation'}
            </p>
          </div>
        ) : (
          conversations.map((conv) => {
            const other = getOtherParticipant(conv, currentUserId);
            const isSelected = selectedId === conv.id;
            const isUnread = conv.unread_count > 0;

            return (
              <div key={conv.id} className="relative group">
                <button
                  onClick={() => onSelect(conv.id)}
                  className={`w-full px-6 py-4 flex items-start gap-4 hover:bg-gray-50 transition-colors border-b border-gray-100 text-left ${
                    isSelected ? 'bg-gray-100' : ''
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    {other.profile_photo_url ? (
                      <img
                        src={other.profile_photo_url}
                        alt={other.first_name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm" style={{ fontWeight: 600 }}>
                        {other.first_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {isUnread && (
                      <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-white" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-0.5">
                      <h3
                        className="text-sm truncate"
                        style={{ fontWeight: isUnread ? 700 : 500, color: '#222222' }}
                      >
                        {other.first_name} {other.last_name}
                      </h3>
                      <span className="text-xs ml-2 flex-shrink-0" style={{ color: '#717171' }}>
                        {conv.last_message ? formatDate(conv.last_message.created_at) : ''}
                      </span>
                    </div>
                    <p className="text-xs truncate mb-0.5" style={{ color: '#717171' }}>
                      {conv.reservation?.listing?.title || conv.listing?.title || 'Message direct'}
                    </p>
                    <p
                      className="text-sm truncate"
                      style={{ color: isUnread ? '#222222' : '#717171', fontWeight: isUnread ? 600 : 400 }}
                    >
                      {conv.last_message?.has_image && !conv.last_message.text && 'Image'}
                      {conv.last_message?.text || 'Nouvelle conversation'}
                    </p>
                  </div>
                </button>

                {/* Context menu trigger */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setContextMenuId(contextMenuId === conv.id ? null : conv.id);
                  }}
                  className="absolute top-4 right-3 p-1 rounded-full hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="w-4 h-4 text-gray-500" />
                </button>

                {/* Context menu */}
                {contextMenuId === conv.id && (
                  <div
                    ref={contextMenuRef}
                    className="absolute top-10 right-3 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden min-w-[200px]"
                  >
                    {isUnread ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onMarkAsRead?.(conv.id);
                          setContextMenuId(null);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm text-left"
                        style={{ color: '#222222' }}
                      >
                        <MailOpen className="w-4 h-4" />
                        Marquer comme lu
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onMarkAsUnread?.(conv.id);
                          setContextMenuId(null);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm text-left"
                        style={{ color: '#222222' }}
                      >
                        <Mail className="w-4 h-4" />
                        Marquer comme non lu
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onArchive?.(conv.id);
                        setContextMenuId(null);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm text-left border-t border-gray-100"
                      style={{ color: '#222222' }}
                    >
                      <Archive className="w-4 h-4" />
                      Archiver
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
