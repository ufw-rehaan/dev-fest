"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/types";
import { Send, Bot, User, ChevronDown } from "lucide-react";

interface ChatPanelProps {
  messages: ChatMessage[];
  onSend: (content: string) => void;
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isBot = msg.role === "assistant";
  const time = new Date(msg.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Simple markdown-like render: **bold**, bullet lines
  function renderContent(text: string) {
    const lines = text.split("\n");
    return lines.map((line, i) => {
      // Replace **text** with <strong>
      const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={j} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
        }
        return <span key={j}>{part}</span>;
      });
      return (
        <p key={i} className={`${i > 0 ? "mt-1" : ""} ${line.startsWith(">") ? "pl-2 border-l-2 border-blue-500/50 text-slate-400 italic" : ""}`}>
          {line.startsWith(">") ? parts.map((p, j) => {
            const s = line.slice(2);
            return renderInline(s, j);
          }) : parts}
        </p>
      );
    });
  }

  function renderInline(text: string, key: number) {
    const parts = text.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={j} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
      }
      return <span key={j}>{part}</span>;
    });
    return <span key={key}>{parts}</span>;
  }

  return (
    <div className={`flex gap-2.5 ${isBot ? "items-start" : "items-start flex-row-reverse"}`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs ${isBot ? "bg-blue-600" : "bg-slate-600"}`}>
        {isBot ? <Bot size={14} /> : <User size={14} />}
      </div>

      {/* Bubble */}
      <div className={`max-w-[85%] ${isBot ? "" : "items-end flex flex-col"}`}>
        <div
          className={`rounded-lg px-3 py-2.5 text-sm leading-relaxed ${
            isBot
              ? "bg-[#1e2330] text-slate-300 border border-[#2a3042]"
              : "bg-blue-600 text-white"
          }`}
        >
          {renderContent(msg.content)}
        </div>
        <p className="text-[10px] text-slate-600 mt-1 px-0.5">{time}</p>
      </div>
    </div>
  );
}

export default function ChatPanel({ messages, onSend }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [atBottom, setAtBottom] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (atBottom) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, atBottom]);

  function handleScroll() {
    const el = containerRef.current;
    if (!el) return;
    const threshold = 60;
    setAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < threshold);
  }

  function scrollToBottom() {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
    setAtBottom(true);
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    setSending(true);
    // Small artificial delay for UX
    await new Promise((r) => setTimeout(r, 400));
    onSend(text);
    setSending(false);
    setTimeout(() => textareaRef.current?.focus(), 50);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const EXAMPLE_PASTES = [
    "What do I need to deliver today?",
    "I have one hour, give me the low-hanging fruit",
    "I finished the vendor email",
    "Sarah to write API docs by end of week, critical",
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#1e2330] flex items-center gap-2">
        <Bot size={16} className="text-blue-400" />
        <span className="text-sm font-semibold text-white">CommitDesk AI</span>
        <span className="ml-auto text-[10px] text-slate-500 font-mono">local · no API key</span>
      </div>

      {/* Messages */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 gap-3">
            <Bot size={32} className="text-slate-600" />
            <p className="text-sm">No messages yet. Paste meeting notes below to extract tasks.</p>
          </div>
        )}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
        {sending && (
          <div className="flex gap-2.5 items-start">
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center">
              <Bot size={14} />
            </div>
            <div className="bg-[#1e2330] border border-[#2a3042] rounded-lg px-3 py-2.5">
              <div className="flex gap-1 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Scroll to bottom button */}
      {!atBottom && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-20 left-1/4 -translate-x-1/2 bg-blue-600 text-white rounded-full p-1.5 shadow-lg hover:bg-blue-500 transition-colors"
        >
          <ChevronDown size={14} />
        </button>
      )}

      {/* Example prompts */}
      <div className="px-4 pt-2 pb-1 border-t border-[#1e2330]">
        <p className="text-[10px] text-slate-600 mb-1.5 uppercase tracking-wide">Quick examples</p>
        <div className="flex flex-col gap-1">
          {EXAMPLE_PASTES.map((ex) => (
            <button
              key={ex}
              onClick={() => setInput(ex)}
              className="text-left text-[11px] text-slate-500 hover:text-blue-400 truncate transition-colors"
            >
              ↳ {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="px-4 pb-4 pt-2">
        <div className="flex gap-2 items-end bg-[#1a1f2e] border border-[#2a3042] rounded-lg p-2 focus-within:border-blue-500/50 transition-colors">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste meeting notes or type action items… (Enter to send)"
            rows={3}
            className="flex-1 bg-transparent text-sm text-slate-300 placeholder:text-slate-600 outline-none leading-relaxed"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="flex-shrink-0 p-2 rounded-md bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={14} />
          </button>
        </div>
        <p className="text-[10px] text-slate-600 mt-1.5 text-center">Shift+Enter for newline · Enter to send</p>
      </div>
    </div>
  );
}
