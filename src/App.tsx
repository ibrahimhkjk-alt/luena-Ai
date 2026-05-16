import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Image as ImageIcon, Zap, Github, Twitter, Layers } from 'lucide-react';
import AIAssistant from './components/AIAssistant.tsx';
import ImageStudio from './components/ImageStudio.tsx';

type Tab = 'chat' | 'image';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('chat');

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 selection:bg-indigo-500/30 font-sans overflow-x-hidden">
      {/* Background decoration */}
      <div className="fixed inset-0 z-0 opacity-10 technical-grid pointer-events-none" />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/10 blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-20 px-4 h-20 bg-[#050505]/80 backdrop-blur-md border-b border-slate-800 rounded-2xl">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
              <div className="w-4 h-4 bg-white rounded-sm rotate-45" />
            </div>
            <h1 className="text-xl font-bold tracking-tighter uppercase italic">
              LUMINA<span className="text-indigo-400">.AI</span>
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-10 text-xs font-bold uppercase tracking-widest text-slate-400">
            <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors">Infrastructure</a>
            <a href="#" className="hover:text-white transition-colors">Models</a>
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="#" className="hover:text-white transition-colors">Enterprise</a>
          </nav>

          <button className="px-6 py-2 bg-white text-black text-xs font-bold rounded-full hover:bg-indigo-500 hover:text-white transition-all uppercase tracking-wider">
            Connect Console
          </button>
        </header>

        {/* Hero Section */}
        <div className="grid grid-cols-12 gap-10 items-center mb-20 px-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="col-span-12 lg:col-span-7 space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-900/30 border border-indigo-500/30 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">System Ready: Edge Node Active</span>
            </div>
            
            <h2 className="text-6xl md:text-8xl font-bold leading-[0.95] tracking-tighter font-display uppercase">
              THE NEURAL<br/>
              <span className="gradient-text italic italic font-black">LOGIC ENGINE</span>
            </h2>
            
            <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
              Deploy enterprise-grade intelligence with sub-millisecond latency. 
              Lumina coordinates multi-modal inference across distributed edge clusters 
              powered by Gemini 3.0 Architecture.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button className="btn-primary">Initialize Engine</button>
              <button className="btn-secondary">View Architecture</button>
            </div>
          </motion.div>

          <div className="hidden lg:flex col-span-5 justify-center items-center relative">
            <div className="w-80 h-80 relative">
              <div className="absolute inset-0 border border-indigo-500/30 rounded-full animate-spin-slow" />
              <div className="absolute inset-6 border border-slate-700 rounded-full" />
              <div className="absolute inset-12 bg-gradient-to-tr from-indigo-600/20 to-cyan-500/20 rounded-full backdrop-blur-xl flex items-center justify-center border border-indigo-500/20 shadow-[0_0_80px_rgba(79,70,229,0.2)]">
                <div className="w-24 h-24 bg-white/10 rounded-full border border-white/20 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_0_30px_white]">
                    <div className="w-4 h-4 bg-black rounded-sm" />
                  </div>
                </div>
              </div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-[9px] font-mono text-slate-400 uppercase">Latency: 0.12ms</div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-[9px] font-mono text-slate-400 uppercase">Throughput: 1.2TB/s</div>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex justify-center mb-12">
          <div className="flex p-1.5 bg-slate-900/50 border border-slate-800 rounded-2xl">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl transition-all font-bold uppercase text-[11px] tracking-widest ${
                activeTab === 'chat' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Neural Chat
            </button>
            <button
              onClick={() => setActiveTab('image')}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl transition-all font-bold uppercase text-[11px] tracking-widest ${
                activeTab === 'image' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              Visual Studio
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative z-10"
        >
          {activeTab === 'chat' ? <AIAssistant /> : <ImageStudio />}
        </motion.div>

        {/* Technical Footer Feature Bar */}
        <div className="mt-24 h-40 bg-slate-900/30 border-y border-slate-800 grid grid-cols-1 md:grid-cols-4 items-center divide-x divide-slate-800 overflow-hidden">
          <div className="px-10">
            <div className="mono-label mb-1">Intelligence Level</div>
            <div className="text-3xl font-mono text-white">LVL.09</div>
            <div className="w-full h-1 bg-slate-800 mt-2 rounded-full overflow-hidden">
              <div className="w-3/4 h-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.8)]"></div>
            </div>
          </div>
          <div className="px-10">
            <div className="mono-label text-slate-500 mb-1">Active Vectors</div>
            <div className="text-3xl font-mono tracking-tighter text-white">14,204,112</div>
            <div className="text-[10px] text-green-400 mt-1 font-bold uppercase tracking-wider">+12% vs last epoch</div>
          </div>
          <div className="px-10">
            <div className="mono-label text-slate-500 mb-1">Context Window</div>
            <div className="text-3xl font-mono text-white">2.4M</div>
            <div className="text-[10px] text-slate-500 mt-1 italic font-medium uppercase tracking-wider">Native multi-modal</div>
          </div>
          <div className="px-10 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="mono-label text-slate-300">Global Uptime 99.99%</span>
            </div>
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#050505] bg-slate-800" />
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-[#050505] bg-indigo-600 flex items-center justify-center text-[10px] font-bold">+4k</div>
            </div>
          </div>
        </div>

        <footer className="mt-12 mb-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
          <p>© 2026 Lumina AI Logic Systems. Distributed Consensus Active.</p>
          <div className="flex gap-10">
            <a href="#" className="hover:text-white transition-colors">Privacy Partition</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Compute</a>
            <a href="#" className="hover:text-white transition-colors">Status: Nominal</a>
          </div>
        </footer>
      </div>
    </div>
  );
}

