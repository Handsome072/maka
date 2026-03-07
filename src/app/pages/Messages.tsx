import { useState, useEffect, useCallback } from 'react';
import { Settings, Archive, PlaneTakeoff, X } from 'lucide-react';
import { Logo } from '@/app/components/Logo';
import { HeaderRightMenu } from '../components/HeaderRightMenu';
import { LanguageModal } from '../components/LanguageModal';
import { BecomeHostModal } from '../components/BecomeHostModal';
import { AuthModal } from '../components/AuthModal';
import { ConversationList } from '../components/messaging/ConversationList';
import { ChatThread } from '../components/messaging/ChatThread';
import { useAuth } from '../context/AuthContext';
import {
  messagesApi,
  type Conversation,
  type ChatMessage,
  type ConversationFilter,
} from '../services/api';

export function Messages({ onNavigate, isHost }: { onNavigate?: (page: any) => void; isHost?: boolean }) {
  const { user } = useAuth();
  const currentUserId = user?.id ?? 0;

  // Conversations state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(true);

  // Selected conversation
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Filters & search
  const [activeFilter, setActiveFilter] = useState<ConversationFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [reportProblem, setReportProblem] = useState(false);

  // Header menu state
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showBecomeHostModal, setShowBecomeHostModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-12 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <button onClick={() => onNavigate?.('home')} className="cursor-pointer">
                <Logo className="h-10 md:h-12 w-auto" />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setShowSettingsModal(true)}
              >
                <Settings className="w-5 h-5" style={{ color: '#222222' }} />
              </button>
              <HeaderRightMenu
                showMenuDropdown={showMenuDropdown}
                setShowMenuDropdown={setShowMenuDropdown}
                setShowLanguageModal={setShowLanguageModal}
                setShowBecomeHostModal={setShowBecomeHostModal}
                onAuthClick={() => setShowAuthModal(true)}
                onClientSpaceClick={() => onNavigate?.('client-space')}
                onMessagesClick={() => {}}
                isHost={isHost}
                onAnnoncesClick={() => onNavigate?.('annonces')}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Messages Content */}
      <div className="px-4 sm:px-6 lg:px-12">
        <div className="flex h-[calc(100vh-73px)]">
          {/* Left Sidebar - Conversations List */}
          <div
            className={`w-full md:w-[380px] border-r border-gray-200 flex-col bg-white ${
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

          {/* Right Side - Chat Area */}
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
      </div>

      {/* Modal Paramètres de messagerie */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full relative">
            <button onClick={() => setShowSettingsModal(false)} className="absolute top-6 right-6">
              <X className="w-5 h-5" style={{ color: '#222222' }} />
            </button>
            <h3 className="text-xl mb-6 pr-8" style={{ fontWeight: 600, color: '#222222' }}>
              Paramètres de messagerie
            </h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-4 flex items-center gap-4 hover:bg-gray-50 rounded-lg transition-colors text-left">
                <Archive className="w-5 h-5" style={{ color: '#222222' }} />
                <span className="text-base" style={{ color: '#222222' }}>Messages archivés</span>
              </button>
              <button
                className="w-full px-4 py-4 flex items-center gap-4 hover:bg-gray-50 rounded-lg transition-colors text-left"
                onClick={() => {
                  setShowSettingsModal(false);
                  setShowFeedbackModal(true);
                }}
              >
                <PlaneTakeoff className="w-5 h-5" style={{ color: '#222222' }} />
                <span className="text-base" style={{ color: '#222222' }}>Envoyer des remarques</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Envoyer des remarques */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full relative">
            <button
              onClick={() => {
                setShowFeedbackModal(false);
                setFeedbackText('');
                setReportProblem(false);
              }}
              className="absolute top-6 right-6"
            >
              <X className="w-5 h-5" style={{ color: '#222222' }} />
            </button>
            <h3 className="text-2xl mb-2 pr-8" style={{ fontWeight: 600, color: '#222222' }}>
              Racontez-nous plus en détail
            </h3>
            <p className="text-sm mb-6" style={{ color: '#717171' }}>
              Racontez-nous votre expérience. Quels sont les points positifs ? Qu'est-ce qui aurait pu être amélioré ?
            </p>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gray-900 mb-4"
            />
            <label className="flex items-center gap-3 mb-6 cursor-pointer">
              <input
                type="checkbox"
                checked={reportProblem}
                onChange={(e) => setReportProblem(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-gray-900 focus:ring-2 focus:ring-gray-900"
              />
              <span className="text-sm" style={{ color: '#222222' }}>Je signale un problème</span>
            </label>
            <button
              className="w-full px-6 py-3 rounded-lg text-base cursor-not-allowed"
              style={{ fontWeight: 600, backgroundColor: '#EBEBEB', color: '#B0B0B0' }}
              disabled
            >
              Envoyer
            </button>
          </div>
        </div>
      )}

      {showLanguageModal && (
        <LanguageModal isOpen={showLanguageModal} onClose={() => setShowLanguageModal(false)} />
      )}

      {showBecomeHostModal && (
        <BecomeHostModal
          isOpen={showBecomeHostModal}
          onClose={() => setShowBecomeHostModal(false)}
          onSelectOption={(option) => {
            if (option === 'logement') onNavigate?.('host-onboarding');
            else if (option === 'experience') onNavigate?.('experience-onboarding');
            setShowBecomeHostModal(false);
          }}
        />
      )}

      {showAuthModal && (
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
}
