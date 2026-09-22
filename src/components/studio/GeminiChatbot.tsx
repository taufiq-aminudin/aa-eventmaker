import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
  Copy,
  Check,
  RefreshCw,
  Zap,
  Crown,
  Lightbulb,
  AlertCircle,
} from 'lucide-react';
import { sendGeminiChatMessage, ChatMessage } from '../../utils/geminiClient';
import { useEvent } from '../../context/EventContext';

export interface ChatbotRole {
  id: string;
  name: string;
  tag: string;
  recommendedModel: 'gemini-3.1-pro-preview' | 'gemini-3.5-flash' | 'gemini-3.1-flash-lite';
  systemInstruction: string;
  description: string;
  icon: any;
  starterPrompts: string[];
}

const CHATBOT_ROLES: ChatbotRole[] = [
  {
    id: 'director',
    name: 'Event Director & Strategist',
    tag: 'Tugas Kompleks',
    recommendedModel: 'gemini-3.1-pro-preview',
    icon: Crown,
    description: 'Analisis anggaran terperinci, penyusunan rundown menit-demi-menit, mitigasi risiko vendor, dan koordinasi logistik acara berskala besar.',
    systemInstruction:
      'You are the Senior Event Director and Wedding Master Planner of AA Event Maker. Provide in-depth, structured, mathematically accurate planning analysis, contingency checklists, timeline coordination, and expert advice for Indonesian and international events.',
    starterPrompts: [
      'Buatkan rundown acara pernikahan adat dan modern dari jam 07:00 hingga 14:00 lengkap dengan PIC',
      'Analisis alokasi budget 150 juta rupiah untuk 300 tamu undangan dengan rincian per pos pengeluaran',
      'Checklist mitigasi risiko jika acara resepsi outdoor diguyur hujan deras mendadak',
    ],
  },
  {
    id: 'creative',
    name: 'Creative Concept & Speechwriter',
    tag: 'Tugas Umum',
    recommendedModel: 'gemini-3.5-flash',
    icon: Lightbulb,
    description: 'Penyusunan naskah janji suci (vows), kata sambutan perwakilan keluarga, konsep tema dekorasi, pemilihan palet warna, dan ide hashtag.',
    systemInstruction:
      'You are the Creative Wedding Stylist and Master Speechwriter of AA Event Maker. Write heartfelt, elegant, and memorable wedding vows, touching family welcome speeches, aesthetic color harmony suggestions, and creative event themes in Indonesian or English.',
    starterPrompts: [
      'Tuliskan naskah kata sambutan perwakilan keluarga mempelai pria yang hangat, sopan, dan menyentuh hati',
      'Buatkan 5 rekomendasi hashtag pernikahan untuk pasangan bernama Andi dan Ayu yang elegan',
      'Ide konsep tema resepsi intimate bernuansa rustic botanical dengan sentuhan kearifan lokal',
    ],
  },
  {
    id: 'fast',
    name: 'Express RSVP & Copy Assistant',
    tag: 'Kecepatan Kilat',
    recommendedModel: 'gemini-3.1-flash-lite',
    icon: Zap,
    description: 'Draft cepat kata-kata undangan WhatsApp, balasan konfirmasi RSVP, pengingat tanggal acara, dan ringkasan to-do instan.',
    systemInstruction:
      'You are the Express RSVP and Messaging Assistant of AA Event Maker. Deliver immediate, polite, concise, and copy-paste ready WhatsApp invitation texts, RSVP confirmations, and event reminders.',
    starterPrompts: [
      'Buat pesan undangan WhatsApp personal singkat tapi sopan untuk teman kantor',
      'Draft pesan pengingat acara (reminder H-3) via WhatsApp agar tamu segera konfirmasi RSVP',
      'Kata-kata ucapan terima kasih setelah acara selesai untuk dibagikan ke grup keluarga',
    ],
  },
];

export const GeminiChatbot: React.FC = () => {
  const { showToast } = useEvent();

  const [selectedRole, setSelectedRole] = useState<ChatbotRole>(CHATBOT_ROLES[1]);
  const [selectedModel, setSelectedModel] = useState<
    'gemini-3.1-pro-preview' | 'gemini-3.5-flash' | 'gemini-3.1-flash-lite'
  >(CHATBOT_ROLES[1].recommendedModel);

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Halo! Saya asisten AI AA Event Maker. Saya siap membantu merencanakan konsep acara, menyusun rundown, merancang teks undangan, hingga menghitung estimasi anggaran. Apa yang sedang Anda persiapkan?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: selectedModel,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const threadEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom of thread
  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSelectRole = (role: ChatbotRole) => {
    setSelectedRole(role);
    setSelectedModel(role.recommendedModel);
    showToast(`Beralih ke peran: ${role.name}`);
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Build history for multi-turn thread
      const history = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: m.role,
          text: m.text,
        }));

      const res = await sendGeminiChatMessage({
        message: textToSend.trim(),
        history,
        model: selectedModel,
        systemInstruction: selectedRole.systemInstruction,
      });

      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: res.modelUsed,
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        text: `Maaf, terjadi kendala komunikasi dengan Gemini: ${err.message || 'Gagal merespons'}. Pastikan GEMINI_API_KEY valid.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
      showToast('Gagal mengirim pesan.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Pesan disalin ke clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        text: `Riwayat percakapan dibersihkan. Sekarang aktif dengan peran ${selectedRole.name}. Ada yang bisa saya bantu?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel,
      },
    ]);
    showToast('Riwayat chat berhasil direset.');
  };

  return (
    <div id="gemini-chatbot-studio" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-2xl p-5 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-bold tracking-wide uppercase">
              Multi-Turn Gemini Event Consultant
            </span>
          </div>
          <h2 className="text-xl font-bold mt-1">AI Event Planning Chatbot</h2>
          <p className="text-xs text-white/80 max-w-xl mt-0.5">
            Konsultasikan seluruh persiapan pernikahan, rundown acara, perhitungan budget, dan naskah sambutan dengan kecerdasan Gemini model multi-peran.
          </p>
        </div>

        {/* Clear Button */}
        <button
          type="button"
          onClick={handleClearHistory}
          className="self-start md:self-auto px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors border border-white/20"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Reset Percakapan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Role & Model Configuration (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Pilih Peran AI (Role)
              </h3>
              <p className="text-[11px] text-slate-500">
                Setiap peran dilengkapi instruksi sistem (system prompt) khusus.
              </p>
            </div>

            <div className="space-y-2">
              {CHATBOT_ROLES.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole.id === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleSelectRole(role)}
                    className={`w-full p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/60 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-bold text-slate-900">{role.name}</span>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {role.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                      {role.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Model Selection Override */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Pilihan Mesin Gemini (Engine)
              </label>
              <div className="space-y-1.5">
                {[
                  {
                    id: 'gemini-3.1-pro-preview',
                    name: 'gemini-3.1-pro-preview',
                    badge: 'Tugas Kompleks & Penalaran',
                  },
                  {
                    id: 'gemini-3.5-flash',
                    name: 'gemini-3.5-flash',
                    badge: 'Tugas Umum & Kreatif',
                  },
                  {
                    id: 'gemini-3.1-flash-lite',
                    name: 'gemini-3.1-flash-lite',
                    badge: 'Respon Cepat Kilat',
                  },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedModel(m.id as any)}
                    className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                      selectedModel === m.id
                        ? 'border-blue-500 bg-blue-50 text-blue-900 font-bold'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-mono text-[11px]">{m.name}</span>
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600 font-normal">
                      {m.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Scrollable Chat Thread & Input (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col h-[650px] overflow-hidden">
          {/* Thread Header */}
          <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{selectedRole.name}</h4>
                <p className="text-[11px] text-slate-500">
                  Model: <span className="font-mono text-blue-700 font-semibold">{selectedModel}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Multi-Turn Aktif</span>
            </div>
          </div>

          {/* Scrollable Thread Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                      isUser ? 'bg-slate-800 text-white' : 'bg-blue-600 text-white shadow-xs'
                    }`}
                  >
                    {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs shadow-xs relative group ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                    }`}
                  >
                    <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>

                    <div
                      className={`flex items-center justify-between mt-2 pt-1 border-t text-[10px] ${
                        isUser
                          ? 'border-white/20 text-white/70'
                          : 'border-slate-100 text-slate-400'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {!isUser && msg.modelUsed && (
                        <span className="font-mono text-[9px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                          {msg.modelUsed}
                        </span>
                      )}
                    </div>

                    {/* Copy Button for Assistant message */}
                    {!isUser && (
                      <button
                        type="button"
                        onClick={() => handleCopy(msg.text, msg.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Salin Pesan"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-green-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center space-x-2 text-slate-400 text-xs py-2">
                <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white p-3 rounded-2xl border border-slate-200 rounded-tl-none flex items-center space-x-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                  <span className="text-slate-600 font-medium">
                    {selectedRole.name} sedang memikirkan jawaban...
                  </span>
                </div>
              </div>
            )}

            <div ref={threadEndRef} />
          </div>

          {/* Prompt Starters */}
          <div className="px-4 py-2 border-t border-slate-100 bg-white flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-semibold text-slate-400 shrink-0">Contoh:</span>
            {selectedRole.starterPrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(p)}
                className="text-[11px] whitespace-nowrap bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 px-2.5 py-1 rounded-full transition-colors border border-slate-200/60"
              >
                {p.slice(0, 36)}...
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 border-t border-slate-100 bg-white flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Tanya ${selectedRole.name}... (Enter untuk kirim)`}
              disabled={isLoading}
              className="flex-1 text-xs text-slate-800 py-2.5 px-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 disabled:opacity-50 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kirim</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
