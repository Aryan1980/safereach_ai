'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Loader2, 
  PhoneCall, 
  RefreshCcw, 
  AlertTriangle
} from 'lucide-react';
import { ChatMessage } from '@/types/chat';
import { getLastKnownLocation } from '@/services/contactsStorage';
import SafetyPromptChips from './SafetyPromptChips';

export default function ChatWindow() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `SafeReach AI Companion initialized.

I provide tactical situational guidance, cab route verification checks, emergency protocols, and personal safety defense advice.

🚨 **Critical Priority**: If you are facing an active physical threat or emergency right now, dial **112** (National Emergency) or **181** (Women Helpline) immediately.

How can I assist your safety?`,
      timestamp: Date.now(),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || input).trim();
    if (!messageContent || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: messageContent,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    const userLoc = getLastKnownLocation();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          userLocation: userLoc,
        }),
      });

      const data = await response.json();
      const botResponse: ChatMessage = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        content: data.message || 'I am ready to assist with your safety. Please reach out to emergency services (112) if you are in immediate danger.',
        timestamp: Date.now(),
        isUrgent: data.message?.includes('112') || data.message?.includes('EMERGENCY'),
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        content: `🚨 **Emergency Priority**: If you need immediate physical assistance, dial **112** (Police) or **181** (Women Helpline). 

For safe places nearby, check the **Safe Places** locator tab on SafeReach AI.`,
        timestamp: Date.now(),
        isUrgent: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome_${Date.now()}`,
        role: 'assistant',
        content: `Conversation reset. I am your SafeReach AI Assistant. How can I help you stay safe?`,
        timestamp: Date.now(),
      },
    ]);
  };

  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="space-y-1.5 leading-relaxed text-xs sm:text-sm">
        {lines.map((line, idx) => {
          if (line.startsWith('### ')) {
            return (
              <h4 key={idx} className="font-bold text-white text-sm mt-3 mb-1 font-mono uppercase">
                {line.replace('### ', '')}
              </h4>
            );
          }
          if (line.startsWith('## ') || line.startsWith('# ')) {
            return (
              <h3 key={idx} className="font-extrabold text-white text-base mt-3 mb-1 font-mono uppercase">
                {line.replace(/^#+ /, '')}
              </h3>
            );
          }
          if (line.startsWith('- ') || line.startsWith('* ')) {
            return (
              <div key={idx} className="flex items-start space-x-2 pl-1">
                <span className="text-zinc-500 font-bold">•</span>
                <span>{renderInlineBold(line.substring(2))}</span>
              </div>
            );
          }
          if (/^\d+\.\s/.test(line)) {
            return (
              <div key={idx} className="flex items-start space-x-2 pl-1">
                <span className="text-zinc-400 font-mono font-bold text-xs">{line.match(/^\d+\./)?.[0]}</span>
                <span>{renderInlineBold(line.replace(/^\d+\.\s*/, ''))}</span>
              </div>
            );
          }
          if (!line.trim()) {
            return <div key={idx} className="h-1.5" />;
          }
          return <p key={idx}>{renderInlineBold(line)}</p>;
        })}
      </div>
    );
  };

  const renderInlineBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-white font-mono">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="flex flex-col h-[680px] glass-panel rounded-3xl overflow-hidden border border-white/[0.08] shadow-2xl">
      {/* Top Header */}
      <div className="px-6 py-4 border-b border-white/[0.06] bg-[#07070a]/90 flex items-center justify-between font-mono">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.1] flex items-center justify-center text-white">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-white text-xs tracking-wider uppercase">SAFEREACH ASSISTANT</h3>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <p className="text-[10px] text-zinc-500 uppercase">
              MODEL: GEMINI 3.7 FLASH // TACTICAL TRIAGE
            </p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="text-zinc-500 hover:text-white p-2 rounded-lg hover:bg-white/[0.04] transition-colors"
          title="Reset conversation"
        >
          <RefreshCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Emergency Alert Header Bar */}
      <div className="bg-rose-500/[0.08] border-b border-rose-500/20 px-5 py-2 flex items-center justify-between font-mono text-xs">
        <div className="flex items-center space-x-2 text-rose-300">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span className="text-[11px] uppercase tracking-wider">PHYSICAL DANGER PROTOCOL:</span>
        </div>
        <div className="flex items-center space-x-3">
          <a
            href="tel:112"
            className="text-white hover:underline font-bold text-[11px] uppercase flex items-center space-x-1"
          >
            <PhoneCall className="w-3 h-3 text-rose-400" />
            <span>DIAL 112</span>
          </a>
          <span className="text-zinc-600">|</span>
          <a
            href="tel:181"
            className="text-white hover:underline font-bold text-[11px] uppercase"
          >
            <span>DIAL 181</span>
          </a>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 bg-black/40">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-mono font-bold ${
                  isUser
                    ? 'bg-white text-black'
                    : 'bg-[#0e0e14] border border-white/[0.1] text-zinc-300'
                }`}
              >
                {isUser ? 'U' : 'AI'}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 sm:p-5 shadow-lg ${
                  isUser
                    ? 'bg-white text-black font-medium rounded-tr-none'
                    : msg.isUrgent
                    ? 'glass-panel border border-rose-500/30 text-zinc-200 rounded-tl-none'
                    : 'glass-panel border border-white/[0.08] text-zinc-300 font-light rounded-tl-none'
                }`}
              >
                {renderFormattedContent(msg.content)}

                <div className={`mt-2.5 text-[9px] font-mono tracking-wider text-right ${isUser ? 'text-zinc-600' : 'text-zinc-500'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center space-x-3 text-xs font-mono text-zinc-400 pl-2">
            <div className="w-7 h-7 rounded-lg bg-[#0e0e14] border border-white/[0.1] flex items-center justify-center text-white">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="glass-panel rounded-2xl px-4 py-2.5 border border-white/[0.08] text-zinc-400">
              <span>SYNTHESIZING SAFETY PROTOCOL...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-5 py-3 border-t border-white/[0.06] bg-[#07070a]/70">
        <SafetyPromptChips
          disabled={isLoading}
          onSelectPrompt={(text) => handleSendMessage(text)}
        />
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-white/[0.06] bg-[#07070a]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask about situational safety, cab checks, or de-escalation steps..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 bg-[#09090d] border border-white/[0.08] focus:border-white/30 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors"
          />

          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-white hover:bg-zinc-200 disabled:opacity-40 text-black font-mono font-bold text-xs uppercase px-4 py-3 rounded-xl transition-all shrink-0 flex items-center space-x-1"
            aria-label="Send safety message"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : <Send className="w-4 h-4" />}
            <span className="hidden sm:inline">SEND</span>
          </button>
        </form>
      </div>
    </div>
  );
}
