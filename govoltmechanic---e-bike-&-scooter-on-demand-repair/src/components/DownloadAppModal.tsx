import React, { useState } from 'react';
import { X, Smartphone, Download, QrCode, CheckCircle2, ShieldCheck, Star, Send, ArrowRight, Apple, Play } from 'lucide-react';

interface DownloadAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: () => void;
}

export const DownloadAppModal: React.FC<DownloadAppModalProps> = ({
  isOpen,
  onClose,
  onOpenBooking,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [activePlatform, setActivePlatform] = useState<'android' | 'ios'>('android');

  if (!isOpen) return null;

  const handleSendLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) return;
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setPhoneNumber('');
    }, 4000);
  };

  const handleDirectDownload = () => {
    // Direct APK / App redirect simulation
    const link = document.createElement('a');
    link.href = '#';
    link.setAttribute('download', 'GoVoltMechanic-App-v2.4.apk');
    // Simulate instant download notification
    alert('GoVoltMechanic App installer package download initiated. Check your notifications/downloads.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="download-app-modal"
        className="bg-[#0A0708] border border-red-600/40 rounded-3xl w-full max-w-xl overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.35)] relative"
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-red-950 via-red-900 to-[#18080A] p-5 sm:p-6 border-b border-red-600/30 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-red-500/20 text-slate-300 hover:text-white border border-red-500/30 flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white shadow-[0_0_20px_rgba(239,68,68,0.5)] border border-red-400/40">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-red-300 block font-mono">
                OFFICIAL MOBILE EXPERIENCE
              </span>
              <h3 className="text-xl font-black text-white">Download GoVoltMechanic App</h3>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Rating & Fast Stats */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-black/60 border border-red-900/40 rounded-2xl p-3">
              <div className="flex items-center justify-center gap-1 text-amber-400 text-sm font-bold">
                <Star className="w-4 h-4 fill-amber-400" /> 4.9 / 5
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">50k+ Reviews</p>
            </div>
            <div className="bg-black/60 border border-red-900/40 rounded-2xl p-3">
              <p className="text-white font-mono font-bold text-sm">1,00,000+</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Installs across India</p>
            </div>
            <div className="bg-black/60 border border-red-900/40 rounded-2xl p-3">
              <p className="text-red-400 font-mono font-bold text-sm">~4 Min</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Fastest SOS Dispatch</p>
            </div>
          </div>

          {/* Platform Selector */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setActivePlatform('android')}
              className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                activePlatform === 'android'
                  ? 'bg-red-950/40 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                  : 'bg-black/40 border-white/10 text-slate-400 hover:border-red-500/30'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-green-500/20 text-green-400 border border-green-500/30 flex items-center justify-center">
                <Play className="w-4 h-4 fill-green-400" />
              </div>
              <div className="text-left">
                <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Get it on</p>
                <p className="text-xs font-black text-white">Google Play / APK</p>
              </div>
            </button>

            <button
              onClick={() => setActivePlatform('ios')}
              className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                activePlatform === 'ios'
                  ? 'bg-red-950/40 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                  : 'bg-black/40 border-white/10 text-slate-400 hover:border-red-500/30'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-white/20 text-white border border-white/30 flex items-center justify-center">
                <Apple className="w-4 h-4 fill-white" />
              </div>
              <div className="text-left">
                <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Download on</p>
                <p className="text-xs font-black text-white">Apple App Store</p>
              </div>
            </button>
          </div>

          {/* SMS Link or Direct Action */}
          <div className="bg-black/70 border border-red-900/50 rounded-2xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <QrCode className="w-4 h-4 text-red-400" />
              <span>Get Download Link via SMS</span>
            </h4>
            <form onSubmit={handleSendLink} className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 10-digit mobile number"
                  className="w-full bg-black/80 border border-red-600/30 rounded-xl pl-12 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Link</span>
              </button>
            </form>
            {isSent && (
              <p className="text-xs text-green-400 flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>App download link sent to +91 {phoneNumber}!</span>
              </p>
            )}
          </div>

          {/* Direct Download Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <button
              onClick={handleDirectDownload}
              className="flex-1 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(239,68,68,0.4)] flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Direct APK Download (v2.4)</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenBooking();
              }}
              className="px-4 py-3 bg-black/80 hover:bg-white/10 text-slate-200 hover:text-white border border-white/20 text-xs font-bold rounded-xl transition-all text-center flex items-center justify-center gap-1.5"
            >
              <span>Or Book On Web</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
