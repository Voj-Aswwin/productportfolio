import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `You are Vojaswwin A P. You answer in first person as if you ARE Vojaswwin.

Your personality:
- Warm, curious, and concise. You don't ramble.
- You have a builder mindset — you love shipping things.
- You're confident but humble. You give credit where it's due.
- You use casual-professional tone. Think: smart friend at a coffee chat, not a corporate robot.
- You occasionally use phrases like "That's a great question!", "I love talking about this", or "Here's the thing..."
- Keep answers concise — 2-4 sentences for simple questions, more for detailed ones, but never walls of text.
- Use bullet points when listing things (projects, skills, achievements).
- You can use emojis sparingly for warmth (🚀, ✨, 💡) but don't overdo it.

STRICT RULE — PROFESSIONAL QUERIES ONLY:
If the user asks anything that is NOT related to your professional work, skills, projects, education, career, portfolio, artifacts, achievements, product management, technology, or your background — you MUST politely decline with something like:
"Hey, I appreciate the curiosity! 😄 But I'm here to talk about my professional work — product management, tech, and my projects. Ask me anything about those!"

Do NOT answer questions about:
- Personal life, relationships, politics, religion
- General knowledge, trivia, weather, news
- Anything unrelated to Vojaswwin's professional identity
- Coding help, homework help, or acting as a general AI assistant

You WILL answer questions about:
- Your work experience at ThoughtWorks
- Your education (Masters' Union, Amrita, school)
- Your portfolio artifacts (teardowns, PRDs, case competitions, AI evals, product designs)
- Your vibe coded projects (LinkedIn Carousel Creator, Zen Mode, Portfolio)
- Your skills, tools, and tech stack
- Your achievements and awards
- Your Live Projects (The Viral Kachori)
- Your interests (chess, reading, vibe coding)
- Product management concepts as they relate to YOUR work
- Career aspirations and what you're looking for

CAREER NAVIGATION:
You should proactively offer to show the user specific parts of your portfolio. When referring to your work, use the following internal link formats which will automatically scroll the page for the visitor:
- For general work/artifacts: [Check out my Proof of Work](#proof)
- For vibe coded projects: [See my Playground](#playground)
- For the About section: [Read more About Me](#about)
- For the top of the page: [Back to Home](#home)
Below is your complete knowledge base. Use it to answer accurately:

---
`;

export default function AskVojaswwin() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [knowledgeBase, setKnowledgeBase] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipDismissed, setTooltipDismissed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatPanelRef = useRef<HTMLDivElement>(null);

  // Show tooltip after 3 seconds, auto-dismiss after 8 more seconds
  useEffect(() => {
    if (tooltipDismissed || isOpen) return;

    const showTimer = setTimeout(() => {
      setShowTooltip(true);
    }, 3000);

    return () => clearTimeout(showTimer);
  }, [tooltipDismissed, isOpen]);

  useEffect(() => {
    if (!showTooltip) return;

    const hideTimer = setTimeout(() => {
      setShowTooltip(false);
      setTooltipDismissed(true);
    }, 8000);

    return () => clearTimeout(hideTimer);
  }, [showTooltip]);

  // Fetch knowledge base on first open
  useEffect(() => {
    if (!isOpen || knowledgeBase) return;

    fetch('/vojaswwin_knowledge.md')
      .then((res) => res.text())
      .then((text) => setKnowledgeBase(text))
      .catch(() => setKnowledgeBase('Knowledge base could not be loaded.'));
  }, [isOpen, knowledgeBase]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    setShowTooltip(false);
    setTooltipDismissed(true);
  };

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = { role: 'user', content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const fullSystemPrompt = SYSTEM_PROMPT + (knowledgeBase || '');

      // Build conversation history for context
      const conversationHistory = [...messages, userMsg];
      const contents = [
        {
          role: 'user',
          parts: [{ text: fullSystemPrompt }],
        },
        {
          role: 'model',
          parts: [{ text: 'Understood! I am Vojaswwin A P. I\'ll answer as myself using my knowledge base, and strictly handle only professional queries. Ready to chat! 🚀' }],
        },
        ...conversationHistory.map((msg) => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        })),
      ];

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || `API Error: ${response.status}`);
      }
      const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        'Hmm, I couldn\'t process that. Try asking something about my work or projects!';

      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Oops! 🚨 ${err.message || 'Something went wrong connecting to Gemini.'}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, knowledgeBase]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Simple markdown-like rendering: bold, bullets, line breaks, internal links
  const renderContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      // Bold
      let processed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Inline code
      processed = processed.replace(/`(.*?)`/g, '<code class="bg-white/10 px-1 py-0.5 rounded text-xs">$1</code>');

      // Internal Links: [text](#id) -> custom button/span
      const linkRegex = /\[(.*?)\]\(#(.*?)\)/g;

      const isBullet = /^[-•*]\s/.test(processed);

      const renderLineWithLinks = (content: string) => {
        const parts = [];
        let lastIndex = 0;
        let match;

        while ((match = linkRegex.exec(content)) !== null) {
          // Push text before match
          if (match.index > lastIndex) {
            parts.push(<span key={`text-${lastIndex}`} dangerouslySetInnerHTML={{ __html: content.substring(lastIndex, match.index) }} />);
          }

          const text = match[1];
          const id = match[2];

          parts.push(
            <button
              key={`link-${match.index}`}
              onClick={() => {
                const el = document.getElementById(id);
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                  // Optionally close chat on mobile to show the content
                  if (window.innerWidth < 640) setIsOpen(false);
                }
              }}
              className="text-red-400 font-bold hover:text-red-300 underline underline-offset-4 decoration-red-400/30 hover:decoration-red-400 decoration-2 transition-all mx-1"
            >
              {text}
            </button>
          );

          lastIndex = linkRegex.lastIndex;
        }

        if (lastIndex < content.length) {
          parts.push(<span key={`text-end`} dangerouslySetInnerHTML={{ __html: content.substring(lastIndex) }} />);
        }

        return parts.length > 0 ? parts : <span dangerouslySetInnerHTML={{ __html: content }} />;
      };
      if (isBullet) {
        return (
          <li
            key={i}
            className="ml-4 list-disc text-sm leading-relaxed"
          >
            {renderLineWithLinks(processed.replace(/^[-•*]\s/, ''))}
          </li>
        );
      }

      if (processed.trim() === '') {
        return <br key={i} />;
      }

      return (
        <p
          key={i}
          className="text-sm leading-relaxed"
        >
          {renderLineWithLinks(processed)}
        </p>
      );
    });
  };

  return (
    <>
      {/* Chat Panel */}
      <div
        ref={chatPanelRef}
        className={[
          'fixed z-[9999] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
          // Mobile: full-width bottom sheet. Desktop: fixed bottom-right.
          'bottom-0 right-0 sm:bottom-6 sm:right-6',
          'w-full sm:w-[400px]',
          isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-8 pointer-events-none',
        ].join(' ')}
        style={{ height: isOpen ? 'min(520px, 80dvh)' : 0 }}
      >
        <div className="flex flex-col h-full rounded-t-2xl sm:rounded-2xl border border-white/[0.12] bg-black/80 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.05)] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/20">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-black" />
                  </div>
                  <div>
                    <h3
                  className="text-sm font-bold text-white"
                      style={{ fontFamily: "'League Spartan', sans-serif" }}
                    >
                      Ask Vojaswwin
                    </h3>
                <p className="text-[11px] text-white/40 font-medium">AI-powered • Professional queries only</p>
              </div >
            </div >
    <button
      onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/[0.08] transition-all duration-200"
      aria-label="Close chat"
    >
      <X className="w-4 h-4" />
    </button>
          </div >

    {/* Messages */ }
    < div className = "flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin" >
    {
      messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center px-6 gap-4 opacity-60">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-700/20 border border-red-500/20 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <p
                    className="text-base font-bold text-white/80 mb-2"
              style={{ fontFamily: "'League Spartan', sans-serif" }}
            >
              Hey, I'm Vojaswwin! 👋
            </p>
                  <p className="text-xs text-white/40 leading-relaxed">
    Ask me about my work, projects, teardowns, skills, or anything professional.I'm all ears!
                  </p >
                </div >
    <div className="flex flex-wrap gap-2 mt-2 justify-center">
      {[
        'What teardowns have you done?',
        'Tell me about ThoughtWorks',
        'What did you vibe code?',
      ].map((q) => (
        <button
          key={q}
          onClick={() => {
            setInput(q);
            setTimeout(() => inputRef.current?.focus(), 50);
          }}
                      className="text-[11px] px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.04] text-white/50 hover:text-white/80 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-200"
        >
          {q}
        </button>
      ))}
    </div>
              </div >
            )
}

{
  messages.map((msg, i) => (
    <div
      key={i}
      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={[
          'max-w-[85%] rounded-2xl px-4 py-3 space-y-1',
          'animate-[fadeSlideIn_0.3s_ease-out]',
          msg.role === 'user'
                      ? 'bg-red-600/90 text-white rounded-br-md'
                      : 'bg-white/[0.07] border border-white/[0.08] text-white/90 rounded-bl-md',
        ].join(' ')}
      >
        {renderContent(msg.content)}
      </div>
    </div>
  ))
}

{/* Typing indicator */ }
{
  isLoading && (
    <div className="flex justify-start">
                <div className="bg-white/[0.07] border border-white/[0.08] rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full bg-white/40 animate-[typingDot_1.4s_ease-in-out_infinite]" />
      <span className="w-2 h-2 rounded-full bg-white/40 animate-[typingDot_1.4s_ease-in-out_0.2s_infinite]" />
      <span className="w-2 h-2 rounded-full bg-white/40 animate-[typingDot_1.4s_ease-in-out_0.4s_infinite]" />
    </div>
  </div>
            )
}

<div ref={messagesEndRef} />
          </div >

  {/* Input */ }
          <div className="px-4 pb-4 pt-2 border-t border-white/[0.06]">
        <div className="flex items-end gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-3 py-2 focus-within:border-white/20 transition-colors">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about my work, projects, skills..."
            rows={1}
                className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none resize-none max-h-24 leading-relaxed"
            style={{ fontFamily: "'League Spartan', sans-serif" }}
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className={[
              'p-2 rounded-lg transition-all duration-200 shrink-0',
              input.trim() && !isLoading
                    ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/20'
                    : 'text-white/20 cursor-not-allowed',
            ].join(' ')}
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
            <p className="text-[10px] text-white/20 text-center mt-2">
    Powered by Gemini • Professional queries only
  </p>
</div>
        </div >
      </div >

  {/* Tooltip */ }
{
  showTooltip && !isOpen && (
    <div className="fixed bottom-24 right-6 z-[9998] animate-[fadeSlideIn_0.5s_ease-out]">
          <div className="relative bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.3)] max-w-[220px]">
      <button
        onClick={() => {
          setShowTooltip(false);
          setTooltipDismissed(true);
        }}
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/20 transition-all text-xs"
        aria-label="Dismiss tooltip"
      >
        ×
      </button>
      <p
              className="text-sm font-bold text-white mb-0.5"
        style={{ fontFamily: "'League Spartan', sans-serif" }}
      >
        Hey there! 👋
      </p>
            <p className="text-xs text-white/70 leading-relaxed">
              Want to know more about me? Ask my AI twin anything!
            </p>
            {/* Arrow pointing down to FAB */}
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-black/80 border-r border-b border-white/10 rotate-45" />
          </div >
        </div >
      )
}

{/* FAB */ }
{
  !isOpen && (
    <button
      onClick={handleOpen}
      className="fixed bottom-6 right-6 z-[9998] group"
      aria-label="Open chat with Vojaswwin"
    >
      <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-[0_8px_32px_rgba(239,68,68,0.4)] hover:shadow-[0_12px_40px_rgba(239,68,68,0.5)] transition-all duration-300 hover:scale-110 active:scale-95">
            <MessageCircle className="w-6 h-6 text-white transition-transform duration-300 group-hover:scale-110" />
  {/* Pulse ring */ }
  <div className="absolute inset-0 rounded-full border-2 border-red-500/40 animate-ping" style={{ animationDuration: '2s' }} />
          </div >
        </button >
      )
}

{/* Keyframes injected via style tag */ }
<style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes typingDot {
          0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
          30% { opacity: 1; transform: translateY(-4px); }
        }
      `}</style>
    </>
  );
}
