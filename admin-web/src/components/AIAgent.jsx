import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Loader, Zap, CheckCircle } from 'lucide-react';
import api from '../services/api';

export default function AIAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [autoProcessing, setAutoProcessing] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await api.post('/agent/chat', {
        message: userMessage,
      });

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: response.data.response },
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Error: ' + (error.response?.data?.message || 'Failed to get response'),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const runAutoKyc = async () => {
    setAutoProcessing(true);
    setMessages(prev => [
      ...prev,
      { role: 'system', content: 'Starting automatic KYC processing...' },
    ]);

    try {
      const response = await api.post('/agent/auto-kyc');
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: response.data.result.response },
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Error processing KYC: ' + error.message },
      ]);
    } finally {
      setAutoProcessing(false);
    }
  };

  const quickActions = [
    {
      label: 'Review Pending KYC',
      prompt: 'Show me all pending KYC submissions and analyze them',
    },
    {
      label: 'Platform Health Check',
      prompt: 'Analyze current platform metrics and identify any issues',
    },
    {
      label: 'Fraud Detection',
      prompt: 'Analyze ride patterns for suspicious activity in the last week',
    },
    {
      label: 'Revenue Report',
      prompt: 'Generate a detailed revenue report for this month',
    },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center group hover:scale-110 z-50"
      >
        <Sparkles className="text-white" size={24} />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></span>
      </button>

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col z-50">
          <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-purple-500 to-blue-600 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Sparkles className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-white">AI Agent</h3>
                  <p className="text-xs text-white/80">Platform Manager</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 p-1.5 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="text-purple-600" size={32} />
                </div>
                <h4 className="font-semibold text-slate-800 mb-2">AI Agent Ready</h4>
                <p className="text-sm text-slate-500 mb-4">
                  Ask me to analyze KYC, detect fraud, or manage the platform
                </p>

                <div className="space-y-2">
                  <button
                    onClick={runAutoKyc}
                    disabled={autoProcessing}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all font-medium disabled:opacity-50"
                  >
                    {autoProcessing ? (
                      <Loader className="animate-spin" size={18} />
                    ) : (
                      <Zap size={18} />
                    )}
                    Auto-Process All KYC
                  </button>

                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setInput(action.prompt);
                          sendMessage();
                        }}
                        className="p-2 text-xs bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg transition-colors text-left font-medium border border-slate-200"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-3 ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                      : msg.role === 'system'
                      ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                      : 'bg-slate-50 text-slate-800 border border-slate-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                  <Loader className="animate-spin text-slate-400" size={20} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-slate-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask the AI agent..."
                className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-slate-50 text-sm"
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

