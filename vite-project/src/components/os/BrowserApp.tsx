import { useState, useRef, FormEvent } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  Home, 
  Search,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function BrowserApp() {
  const DEFAULT_URL = 'https://www.google.com/webhp?igu=1';
  
  const [urlInput, setUrlInput] = useState(DEFAULT_URL);
  const [currentUrl, setCurrentUrl] = useState(DEFAULT_URL);
  
  // History stack for back/forward
  const [history, setHistory] = useState<string[]>([DEFAULT_URL]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  
  const [isLoading, setIsLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const formatUrl = (input: string) => {
    let query = input.trim();
    if (!query) return DEFAULT_URL;

    // Check if it looks like a URL (has a dot and no spaces, or starts with http)
    const isUrl = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(query) || query.startsWith('localhost:');
    
    if (isUrl) {
      if (!query.startsWith('http://') && !query.startsWith('https://')) {
        return `https://${query}`;
      }
      return query;
    }

    // Otherwise, treat as a search query via Google (using igu=1 to bypass iframe blocking)
    return `https://www.google.com/search?igu=1&q=${encodeURIComponent(query)}`;
  };

  const navigateTo = (url: string) => {
    setCurrentUrl(url);
    setUrlInput(url);
    setIsLoading(true);
    
    // Update history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(url);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formatted = formatUrl(urlInput);
    if (formatted !== currentUrl) {
      navigateTo(formatted);
    }
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const previousUrl = history[newIndex];
      setCurrentUrl(previousUrl);
      setUrlInput(previousUrl);
      setIsLoading(true);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const nextUrl = history[newIndex];
      setCurrentUrl(nextUrl);
      setUrlInput(nextUrl);
      setIsLoading(true);
    }
  };

  const handleRefresh = () => {
    if (iframeRef.current) {
      setIsLoading(true);
      // Hack to force iframe reload without changing src
      const currentSrc = iframeRef.current.src;
      iframeRef.current.src = 'about:blank';
      setTimeout(() => {
        if (iframeRef.current) iframeRef.current.src = currentSrc;
      }, 50);
    }
  };

  const handleHome = () => {
    if (currentUrl !== DEFAULT_URL) {
      navigateTo(DEFAULT_URL);
    }
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#120a1c] text-white font-sans overflow-hidden">
      
      {/* Browser Chrome (Nav Bar) */}
      <div className="flex flex-col border-b border-white/10 bg-[#0a0514] shrink-0">
        
        {/* Tabs Bar (Fake for now, just shows current title) */}
        <div className="flex items-end px-2 pt-2 gap-1 bg-black/40">
          <div className="flex items-center px-4 py-1.5 bg-[#0a0514] rounded-t-lg border border-white/10 border-b-0 min-w-[200px] max-w-[250px]">
            <Globe className="w-3.5 h-3.5 mr-2 text-blue-400" />
            <span className="text-xs truncate text-gray-300">Nebula Search</span>
          </div>
        </div>

        {/* Address Bar Row */}
        <div className="flex items-center px-3 py-2 gap-2">
          
          {/* Navigation Controls */}
          <div className="flex items-center gap-1">
            <button 
              onClick={handleBack}
              disabled={historyIndex <= 0}
              className={cn(
                "p-1.5 rounded-full transition-colors",
                historyIndex > 0 ? "hover:bg-white/10 text-gray-300" : "text-gray-600 cursor-not-allowed"
              )}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={handleForward}
              disabled={historyIndex >= history.length - 1}
              className={cn(
                "p-1.5 rounded-full transition-colors",
                historyIndex < history.length - 1 ? "hover:bg-white/10 text-gray-300" : "text-gray-600 cursor-not-allowed"
              )}
            >
              <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={handleRefresh}
              className="p-1.5 rounded-full hover:bg-white/10 text-gray-300 transition-colors"
            >
              <RotateCw className={cn("w-4 h-4", isLoading && "animate-spin text-blue-400")} />
            </button>
            <button 
              onClick={handleHome}
              className="p-1.5 rounded-full hover:bg-white/10 text-gray-300 transition-colors ml-1"
            >
              <Home className="w-4 h-4" />
            </button>
          </div>

          {/* URL Input */}
          <form 
            onSubmit={handleSubmit}
            className="flex-1 flex items-center bg-black/50 border border-white/10 rounded-full px-4 py-1.5 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all"
          >
            <Search className="w-3.5 h-3.5 text-gray-500 mr-2 shrink-0" />
            <input 
              type="text" 
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Search the web or enter a URL"
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-200 placeholder-gray-600"
              spellCheck={false}
            />
          </form>

        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative bg-white browser-iframe-container">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#120a1c] z-10">
            <div className="flex flex-col items-center text-blue-400">
              <RotateCw className="w-8 h-8 animate-spin mb-4" />
              <span className="text-sm font-medium animate-pulse">Connecting...</span>
            </div>
          </div>
        )}
        
        {/* We add a key so it completely re-renders if needed, but here we just rely on src */}
        <iframe
          ref={iframeRef}
          src={currentUrl}
          onLoad={handleIframeLoad}
          className="w-full h-full border-none"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
          title="Nebula Search Browser"
        />
      </div>

    </div>
  );
}
