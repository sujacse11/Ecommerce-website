import React, { useState } from 'react';
import { Bot, X, Send, Sparkles } from 'lucide-react';
import api from '../api/axios';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am your AI Shopping Assistant. Ask me about order tracking, product search, or return policies!' }
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (customText = null) => {
    const text = customText || input;
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { sender: 'user', text }]);
    if (!customText) setInput('');
    setLoading(true);

    try {
      const res = await api.post('/chatbot/chat/', { message: text });
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: res.data.response, products: res.data.products }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Sorry, I encountered an issue connecting to the server. Please try again.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 font-bold transition-all hover:scale-105"
        >
          <Bot className="w-6 h-6" />
          <span className="text-sm pr-1">AI Assistant</span>
        </button>
      ) : (
        <div className="bg-white w-80 sm:w-96 h-[480px] rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-500 to-indigo-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm">
              <Sparkles className="w-5 h-5" />
              <span>Aura AI Shopping Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:opacity-80">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Action Chips */}
          <div className="bg-slate-50 p-2 flex gap-1.5 overflow-x-auto border-b border-slate-100 text-xs">
            <button onClick={() => sendMessage('Track order')} className="px-2.5 py-1 bg-white border border-slate-200 rounded-full whitespace-nowrap hover:bg-sky-50 hover:text-sky-600">
              📦 Track Order
            </button>
            <button onClick={() => sendMessage('Return policy')} className="px-2.5 py-1 bg-white border border-slate-200 rounded-full whitespace-nowrap hover:bg-sky-50 hover:text-sky-600">
              🔄 Return Policy
            </button>
            <button onClick={() => sendMessage('Recommend laptop')} className="px-2.5 py-1 bg-white border border-slate-200 rounded-full whitespace-nowrap hover:bg-sky-50 hover:text-sky-600">
              💻 Search Laptops
            </button>
          </div>

          {/* Message List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] text-xs rounded-2xl px-3.5 py-2.5 ${
                    m.sender === 'user'
                      ? 'bg-sky-500 text-white rounded-br-none'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  {m.text}
                </div>
                {m.products && (
                  <div className="mt-2 space-y-1 w-full">
                    {m.products.map((p) => (
                      <div key={p.id} className="bg-white p-2 border border-slate-200 rounded-xl text-xs flex justify-between">
                        <span className="font-semibold line-clamp-1">{p.title}</span>
                        <span className="text-sky-600 font-bold">${p.price}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && <div className="text-xs text-slate-400 italic">Thinking...</div>}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:bg-white focus:border-sky-500 outline-none"
            />
            <button
              type="submit"
              className="bg-sky-500 hover:bg-sky-600 text-white p-2.5 rounded-xl transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;
