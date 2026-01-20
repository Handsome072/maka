import { useState, useCallback } from 'react';
import { Search, Settings, Send, Archive, PlaneTakeoff, X, ArrowLeft } from 'lucide-react';
import { Logo } from '@/app/components/Logo';

interface Conversation {
  id: string;
  name: string;
  phone: string;
  lastMessage: string;
  date: string;
  avatar: string;
  unread?: boolean;
}

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  time: string;
}

export function Messages({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [reportProblem, setReportProblem] = useState(false);

  // State pour gérer les messages dynamiquement
  const [dynamicMessages, setDynamicMessages] = useState<{ [conversationId: string]: Message[] }>({});

  // Mock conversations
  const conversations: Conversation[] = [
    {
      id: '1',
      name: 'Année ambony',
      phone: '+261 38 70 844 09',
      lastMessage: 'Vous avez reçu ***',
      date: '13/11/2025',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      unread: true
    },
    {
      id: '2',
      name: 'Oki Mieva',
      phone: '+261 32 62 064 77',
      lastMessage: 'Oki Mieva hianareo pour vos rep...',
      date: '13/11/2025',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
    },
    {
      id: '3',
      name: 'Fatouma',
      phone: '+261 34 74 918 85',
      lastMessage: 'Fa jaina no razava',
      date: '12/11/2025',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
    },
    {
      id: '4',
      name: 'Samy',
      phone: '+261 33 02 149 82',
      lastMessage: 'Okay mosy izany',
      date: '11/11/2025',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
    },
    {
      id: '5',
      name: 'Jay ok',
      phone: '+261 34 44 327 19',
      lastMessage: 'Jay ok le Merci',
      date: '10/11/2025',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
    }
  ];

  // Messages mock initiaux (préservés pour la démo)
  const mockMessages: Message[] = [
    { id: '1', text: 'Salama tompoko', sender: 'other', time: '14:40' },
    { id: '2', text: 'Izao dia développera fa ietiko ato tao malahatra ambrany de niho sabo hitady fianakaviana raha ofana mlay son dalar', sender: 'other', time: '14:51' },
    { id: '3', text: 'rahi ny tao tena ngona mishaka toa ... mora to ming client masoany raako', sender: 'me', time: '14:53' },
    { id: '4', text: 'shora, tsandrony lagy ny habeo... tao noity he.fana ntoany relho avy', sender: 'me', time: '14:53' },
    { id: '5', text: 'Frontend : ReactJs sy Angular', sender: 'other', time: '14:55' },
    { id: '6', text: 'Backend: FastAPI, SpringBoot,Laravel', sender: 'other', time: '14:55' },
    { id: '7', text: 'Base de données : MongoDB,Leotheque,sql', sender: 'other', time: '14:55' },
    { id: '8', text: 'Izao eto efa amasaky superiority.fa afaka misandra raha mioy technologie vaoasa', sender: 'other', time: '14:55' },
    { id: '9', text: 'da ok ery, mbeng no raha may', sender: 'me', time: '14:57' },
    { id: '10', text: 'eto tana nga?', sender: 'me', time: '14:58' },
    { id: '11', text: 'Okay , nakiria ary 💛', sender: 'other', time: '15:00' },
    { id: '12', text: 'Heny', sender: 'other', time: '15:00' },
    { id: '13', text: 'eto tana nga?', sender: 'other', time: '15:00' },
    { id: '14', text: 'Ahy Fanakievaza iabi Je afaka manakiny rahia thara', sender: 'other', time: '15:00' },
    { id: '15', text: 'yah', sender: 'me', time: '15:02' },
    { id: '16', text: 'mbeng zo za nifi may ee', sender: 'me', time: '15:02' },
    { id: '17', text: 'fa za zao fitea ngisari mbera', sender: 'me', time: '15:02' },
    { id: '18', text: 'Okay mbsy izany', sender: 'other', time: '15:03' }
  ];

  // Combiner les messages mock avec les messages dynamiques
  const messages: Message[] = selectedConversation ? [
    ...mockMessages,
    ...(dynamicMessages[selectedConversation] || [])
  ] : [];

  // Fonction pour envoyer un message
  const handleSendMessage = useCallback(() => {
    if (!messageText.trim() || !selectedConversation) return;

    const newMessage: Message = {
      id: `dynamic-${Date.now()}`,
      text: messageText.trim(),
      sender: 'me',
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };

    setDynamicMessages(prev => ({
      ...prev,
      [selectedConversation]: [...(prev[selectedConversation] || []), newMessage]
    }));

    setMessageText('');
  }, [messageText, selectedConversation]);

  const hasMessages = conversations.length > 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-12 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <button
                onClick={() => onNavigate?.('home')}
                className="cursor-pointer"
              >
                <Logo />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm" style={{ fontWeight: 500, color: '#222222' }}>Devenir hôte</span>
              <button className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Messages Content */}
      {!hasMessages ? (
        /* Empty State */
        <div className="px-4 sm:px-6 lg:px-12 pt-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl" style={{ fontWeight: 600, color: '#222222' }}>Messages</h1>
              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Search className="w-5 h-5" style={{ color: '#222222' }} />
                </button>
                <button
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  onClick={() => setShowSettingsModal(true)}
                >
                  <Settings className="w-5 h-5" style={{ color: '#222222' }} />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-3 mb-12">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-5 py-2 rounded-full text-sm transition-colors ${activeTab === 'all'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                style={{ fontWeight: 600 }}
              >
                Tout
              </button>
              <button
                onClick={() => setActiveTab('unread')}
                className={`px-5 py-2 rounded-full text-sm transition-colors ${activeTab === 'unread'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                style={{ fontWeight: 600 }}
              >
                Non lus
              </button>
            </div>

            {/* Empty State Icon and Text */}
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-24 h-24 border-2 border-gray-300 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-xl mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                Vous n'avez aucun message
              </h3>
              <p className="text-sm text-center max-w-xs" style={{ color: '#717171' }}>
                Lorsque vous recevrez un nouveau message, il apparaîtra ici.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Messages List and Chat */
        <div className="px-4 sm:px-6 lg:px-12">
          <div className="flex h-[calc(100vh-73px)]">
            {/* Left Sidebar - Conversations List */}
            <div className={`w-full md:w-[380px] border-r border-gray-200 flex-col bg-white ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
              <div className="px-6 pt-6 pb-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl" style={{ fontWeight: 600, color: '#222222' }}>Messages</h1>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <Search className="w-5 h-5" style={{ color: '#222222' }} />
                    </button>
                    <button
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      onClick={() => setShowSettingsModal(true)}
                    >
                      <Settings className="w-5 h-5" style={{ color: '#222222' }} />
                    </button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-5 py-2 rounded-full text-sm transition-colors ${activeTab === 'all'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    style={{ fontWeight: 600 }}
                  >
                    Tout
                  </button>
                  <button
                    onClick={() => setActiveTab('unread')}
                    className={`px-5 py-2 rounded-full text-sm transition-colors ${activeTab === 'unread'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    style={{ fontWeight: 600 }}
                  >
                    Non lus
                  </button>
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`w-full px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors border-b border-gray-100 ${selectedConversation === conv.id ? 'bg-gray-100' : ''
                      }`}
                  >
                    <img
                      src={conv.avatar}
                      alt={conv.name}
                      className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 text-left overflow-hidden">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="text-base truncate" style={{ fontWeight: 600, color: '#222222' }}>
                          {conv.name}
                        </h3>
                        <span className="text-xs ml-2 flex-shrink-0" style={{ color: '#717171' }}>
                          {conv.date}
                        </span>
                      </div>
                      <p className="text-sm flex items-center gap-2 mb-1" style={{ color: '#717171' }}>
                        {conv.phone}
                        <span className="text-xs">📱</span>
                        {conv.unread && <span className="text-xs">✅</span>}
                        <span className="text-xs">{conv.date.split('/')[0]}/{conv.date.split('/')[1]}</span>
                      </p>
                      <p className="text-sm truncate" style={{ color: '#717171' }}>
                        {conv.lastMessage}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Side - Chat Area */}
            <div className={`flex-1 flex-col bg-white ${!selectedConversation ? 'hidden md:flex' : 'flex'}`}>
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedConversation(null)}
                        className="md:hidden p-1 mr-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <ArrowLeft className="w-6 h-6" style={{ color: '#222222' }} />
                      </button>
                      <img
                        src={conversations.find(c => c.id === selectedConversation)?.avatar}
                        alt=""
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="text-lg" style={{ fontWeight: 600, color: '#222222' }}>
                          {conversations.find(c => c.id === selectedConversation)?.name}
                        </h3>
                        <p className="text-sm" style={{ color: '#717171' }}>
                          {conversations.find(c => c.id === selectedConversation)?.phone}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm" style={{ color: '#717171' }}>13/11/2025</span>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto px-6 py-4 bg-white">
                    <div className="space-y-3">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] px-4 py-2 rounded-lg ${msg.sender === 'me'
                              ? 'bg-black text-white'
                              : 'bg-gray-100 text-gray-900'
                              }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                            <span className={`text-xs mt-1 block ${msg.sender === 'me' ? 'text-gray-300' : 'text-gray-500'
                              }`}>
                              {msg.time}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="px-6 py-4 border-t border-gray-200">
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Écrire un message..."
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!messageText.trim()}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${messageText.trim()
                          ? 'bg-black hover:bg-gray-800'
                          : 'bg-gray-300 cursor-not-allowed'
                          }`}
                      >
                        <Send className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>
                </>
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
      )}

      {/* Modal Paramètres de messagerie */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full relative">
            {/* Bouton X pour fermer */}
            <button
              onClick={() => setShowSettingsModal(false)}
              className="absolute top-6 right-6"
            >
              <X className="w-5 h-5" style={{ color: '#222222' }} />
            </button>

            {/* Titre */}
            <h3 className="text-xl mb-6 pr-8" style={{ fontWeight: 600, color: '#222222' }}>
              Paramètres de messagerie
            </h3>

            {/* Options */}
            <div className="space-y-2">
              {/* Messages archivés */}
              <button className="w-full px-4 py-4 flex items-center gap-4 hover:bg-gray-50 rounded-lg transition-colors text-left">
                <Archive className="w-5 h-5" style={{ color: '#222222' }} />
                <span className="text-base" style={{ color: '#222222' }}>
                  Messages archivés
                </span>
              </button>

              {/* Envoyer des remarques */}
              <button
                className="w-full px-4 py-4 flex items-center gap-4 hover:bg-gray-50 rounded-lg transition-colors text-left"
                onClick={() => {
                  setShowSettingsModal(false);
                  setShowFeedbackModal(true);
                }}
              >
                <PlaneTakeoff className="w-5 h-5" style={{ color: '#222222' }} />
                <span className="text-base" style={{ color: '#222222' }}>
                  Envoyer des remarques
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Envoyer des remarques */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full relative">
            {/* Bouton X pour fermer */}
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

            {/* Titre */}
            <h3 className="text-2xl mb-2 pr-8" style={{ fontWeight: 600, color: '#222222' }}>
              Racontez-nous plus en détail
            </h3>

            {/* Sous-titre */}
            <p className="text-sm mb-6" style={{ color: '#717171' }}>
              Racontez-nous votre expérience. Quels sont les points positifs ? Qu'est-ce qui aurait pu être amélioré ?
            </p>

            {/* Textarea */}
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gray-900 mb-4"
              placeholder=""
            />

            {/* Checkbox */}
            <label className="flex items-center gap-3 mb-6 cursor-pointer">
              <input
                type="checkbox"
                checked={reportProblem}
                onChange={(e) => setReportProblem(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-gray-900 focus:ring-2 focus:ring-gray-900"
              />
              <span className="text-sm" style={{ color: '#222222' }}>
                Je signale un problème
              </span>
            </label>

            {/* Bouton Envoyer */}
            <button
              className="w-full px-6 py-3 rounded-lg text-base cursor-not-allowed"
              style={{
                fontWeight: 600,
                backgroundColor: '#EBEBEB',
                color: '#B0B0B0'
              }}
              disabled
            >
              Envoyer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}