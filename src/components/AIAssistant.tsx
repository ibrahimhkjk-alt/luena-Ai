import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, Loader2, Trash2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  role: 'user' | 'model';
  parts: [{ text: string }];
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    setError(null);
    const userMessage: Message = {
      role: 'user',
      parts: [{ text: input }]
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          history: messages,
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const modelMessage: Message = {
        role: 'model',
        parts: [{ text: data.text }]
      };

      setMessages(prev => [...prev, modelMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setError(err.message || 'Failed to connect to the neural network.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[70vh] glass-card overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-indigo-400" />
          <h2 className="font-bold text-xs uppercase tracking-widest text-slate-300">Neural Assistant Node</h2>
        </div>
        <button 
          onClick={() => {
            setMessages([]);
            setError(null);
          }}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
          title="Clear session"
        >
          <Trash2 className="w-4 h-4 text-slate-500 group-hover:text-red-400" />
        </button>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth technical-grid bg-[#050505]/40"
      >
        <AnimatePresence initial={false}>
          {messages.length === 0 && !error ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40"
            >
              <div className="p-6 rounded-full bg-indigo-500/10 border border-indigo-500/20 shadow-[0_0_40px_rgba(79,70,229,0.1)]">
                <Sparkles className="w-10 h-10 text-indigo-400" />
              </div>
              <div className="space-y-2">
                <p className="text-xl font-bold font-display uppercase tracking-tighter">Engine Standby</p>
                <p className="text-xs font-mono tracking-wider">Initialize protocol via command input</p>
              </div>
            </motion.div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`p-2.5 rounded-xl h-fit border shadow-lg ${msg.role === 'user' ? 'bg-indigo-600 border-indigo-400' : 'bg-slate-800 border-slate-700'}`}>
                    {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-indigo-300" />}
                  </div>
                  <div className={`max-w-[80%] p-5 rounded-2xl ${msg.role === 'user' ? 'bg-indigo-600/10 border border-indigo-500/20 rounded-tr-none' : 'bg-slate-900/60 border border-slate-800 rounded-tl-none shadow-xl backdrop-blur-sm'}`}>
                    <div className="prose prose-invert prose-sm max-w-none prose-slate">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.parts[0].text}
                      </ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mx-auto max-w-md p-4 rounded-xl bg-red-950/20 border border-red-900/50 flex items-center gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-[10px] mono-label text-red-400 leading-tight">{error}</p>
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
        {isLoading && (
          <div className="flex gap-4 animate-pulse">
            <div className="p-2.5 rounded-xl h-fit bg-slate-800 border border-slate-700">
              <Bot className="w-4 h-4 text-indigo-300" />
            </div>
            <div className="px-5 py-4 rounded-2xl bg-slate-900/60 border border-slate-800 rounded-tl-none">
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-slate-800 bg-slate-900/50 backdrop-blur-md">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="INPUT PROTOCOL COMMAND..."
            className="w-full bg-black/40 border border-slate-700 rounded-xl py-4 pl-6 pr-16 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-mono text-sm tracking-wider uppercase placeholder:text-slate-700"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:hover:bg-indigo-600 rounded-lg transition-all shadow-lg shadow-indigo-500/20"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
