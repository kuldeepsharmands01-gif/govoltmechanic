import React, { useState } from 'react';
import { X, Send, Phone, ShieldCheck, CheckCheck } from 'lucide-react';
import { Technician, ChatMessage } from '../types';

interface LiveChatModalProps {
  technician: Technician;
  isOpen: boolean;
  onClose: () => void;
  specialistPhone?: string;
}

export const LiveChatModal: React.FC<LiveChatModalProps> = ({
  technician,
  isOpen,
  onClose,
  specialistPhone,
}) => {
  if (!isOpen) return null;
  const targetPhone = specialistPhone || technician.phone;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'tech',
      text: `Hi Alex! I'm en route in ${technician.vanId} with your hydraulic brake bleed kit and BMS diagnostic scanner. ETA is around 8 minutes.`,
      timestamp: '10:14 AM',
    },
    {
      id: 'm2',
      sender: 'user',
      text: 'Awesome, thanks Marcus! Can you also take a quick look at my rear wheel spoke tension?',
      timestamp: '10:15 AM',
    },
    {
      id: 'm3',
      sender: 'tech',
      text: 'Absolutely! I carry a digital spoke tension gauge in the van. Will inspect it during the safety check.',
      timestamp: '10:16 AM',
    },
  ]);

  const [inputText, setInputText] = useState('');

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    // Simulate technician reply after 1 second
    setTimeout(() => {
      const autoReplies = [
        "Copy that! I've logged that in your service ticket.",
        "Understood. Approaching your area now, driving safely on Mall Road, Kanpur.",
        "Perfect. I'm bringing all high-torque tools and spareJulet waterproof connectors just in case.",
        "Got it! You can see my live location updated on the GOVOLT radar.",
      ];
      const randomReply = autoReplies[Math.floor(Math.random() * autoReplies.length)];

      const techMsg: ChatMessage = {
        id: `t-${Date.now()}`,
        sender: 'tech',
        text: randomReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, techMsg]);
    }, 1200);
  };

  const presetQuestions = [
    'Where can I meet your van?',
    'Will you test ride it after repair?',
    'Can I pay via app or card reader?',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0D0E15] border border-cyan-500/30 rounded-3xl w-full max-w-lg h-[600px] flex flex-col shadow-[0_0_40px_rgba(34,211,238,0.2)] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={technician.avatar}
                alt={technician.name}
                className="w-10 h-10 rounded-full object-cover border border-cyan-400"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0A0B10] rounded-full"></div>
            </div>
            <div>
              <p className="font-bold text-sm text-white flex items-center gap-1">
                {technician.name}
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              </p>
              <p className="text-[10px] text-cyan-400 font-mono">GOVOLT Mobile Specialist</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${targetPhone}`}
              title={`Call Specialist (${targetPhone})`}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-green-400 transition-colors flex items-center gap-1.5"
            >
              <Phone className="w-4 h-4" />
              <span className="text-[10px] font-mono font-bold hidden sm:inline">{targetPhone}</span>
            </a>
            <button
              onClick={onClose}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Container */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 font-sans text-sm">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[80%] p-3.5 rounded-2xl ${
                  msg.sender === 'user'
                    ? 'bg-cyan-500 text-black font-medium rounded-tr-none shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                    : 'bg-white/10 text-slate-100 border border-white/10 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
              <div className="flex items-center gap-1 mt-1 px-1">
                <span className="text-[10px] font-mono text-slate-500">{msg.timestamp}</span>
                {msg.sender === 'user' && <CheckCheck className="w-3 h-3 text-cyan-400" />}
              </div>
            </div>
          ))}
        </div>

        {/* Preset Chips */}
        <div className="px-6 py-2 bg-white/5 border-t border-white/5 flex gap-2 overflow-x-auto no-scrollbar">
          {presetQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="text-[11px] whitespace-nowrap px-3 py-1 bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-400 border border-white/10 hover:border-cyan-500/30 rounded-full text-slate-300 transition-all cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white/5 border-t border-white/10 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message to your specialist..."
            className="flex-1 bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
          />
          <button
            onClick={() => handleSend()}
            className="p-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl transition-colors active:scale-95 shadow-[0_0_12px_#22d3ee]"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
