import React, { useState } from 'react';
import { Image as ImageIcon, Wand2, Download, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ImageStudio() {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, aspectRatio }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      setGeneratedImage(data.url);
    } catch (err: any) {
      console.error('Image Gen error:', err);
      setError(err.message || 'Failed to generate image');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `lumina-ai-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[70vh]">
      {/* Controls */}
      <div className="flex flex-col gap-6 glass-card p-8 bg-slate-900/60 transition-all">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-5">
          <Wand2 className="w-5 h-5 text-indigo-400" />
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-300">Visual Synthesis Cluster</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="mono-label mb-3 block">
              Prompt Sequence
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="DEFINE VISUAL PARAMETERS... (E.G., 'A NEURAL NETWORK HUB AT THE CORE OF A DISTANT STAR')"
              className="w-full h-36 bg-black/40 border border-slate-700 rounded-xl p-5 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all resize-none text-sm font-mono tracking-tight leading-relaxed placeholder:text-slate-800"
            />
          </div>

          <div>
            <label className="mono-label mb-3 block">
              Resolution Matrix
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['1:1', '4:3', '16:9'].map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={`py-3 px-4 rounded-lg text-[10px] font-bold font-mono tracking-widest border transition-all ${
                    aspectRatio === ratio
                      ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400 shadow-[0_0_15px_rgba(79,70,229,0.2)]'
                      : 'bg-black/20 border-slate-800 hover:bg-slate-800 text-slate-500'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isLoading}
          className="mt-auto w-full py-5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl font-bold uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-500/20 active:scale-[0.98]"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Synthesize Data
            </>
          )}
        </button>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-4 rounded-xl bg-red-950/20 border border-red-900/50 text-red-400 text-xs font-mono uppercase tracking-wider"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}
      </div>

      {/* Preview Area */}
      <div className="glass-card flex items-center justify-center relative group overflow-hidden min-h-[400px] bg-[#050505]/60 technical-grid">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-t-2 border-r-2 border-indigo-500 animate-spin" />
                <div className="absolute inset-x-0 inset-y-0 m-auto w-10 h-10 rounded-full border-b-2 border-l-2 border-cyan-500 animate-spin-reverse" />
              </div>
              <p className="mono-label animate-pulse">Rendering Neural Latent Space...</p>
            </motion.div>
          ) : generatedImage ? (
            <motion.div
              key="image"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full h-full flex items-center justify-center p-8"
            >
              <div className="relative h-full w-full flex items-center justify-center">
                <img
                  src={generatedImage}
                  alt="Generated"
                  className="max-w-full max-h-full rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-slate-800 object-contain bg-black/40"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                  <button
                    onClick={downloadImage}
                    className="p-4 bg-indigo-600 text-white rounded-full hover:scale-110 active:scale-95 transition-all shadow-2xl border border-indigo-400"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center space-y-4 opacity-20"
            >
              <ImageIcon className="w-20 h-20 mx-auto stroke-[1px]" />
              <p className="mono-label">Output Terminal Offline</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
