import React, { useState, useEffect } from 'react';
import { X, Bell, BellOff, Volume2, VolumeX, ShieldCheck, Phone, Check, Sparkles, AlertCircle, Laptop } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notificationsEnabled: boolean;
  onToggleNotifications: (enabled: boolean) => void;
  audioEnabled: boolean;
  onToggleAudio: (enabled: boolean) => void;
  specialistPhone: string;
  onTestNotification: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  notificationsEnabled,
  onToggleNotifications,
  audioEnabled,
  onToggleAudio,
  specialistPhone,
  onTestNotification,
}) => {
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [testSent, setTestSent] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNotificationToggle = async () => {
    if (!('Notification' in window)) {
      alert('Browser notifications are not supported in this browser.');
      return;
    }

    if (!notificationsEnabled) {
      // Request permission
      try {
        const permission = await Notification.requestPermission();
        setPermissionStatus(permission);
        if (permission === 'granted') {
          onToggleNotifications(true);
        } else if (permission === 'denied') {
          alert('Notification permission was blocked in your browser settings. Please allow notifications in browser site permissions to receive 5-minute ETA alerts.');
          onToggleNotifications(false);
        }
      } catch (e) {
        console.error('Error requesting notification permission:', e);
      }
    } else {
      onToggleNotifications(false);
    }
  };

  const handleTestClick = () => {
    onTestNotification();
    setTestSent(true);
    setTimeout(() => setTestSent(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0D0E15] border border-cyan-500/30 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 relative shadow-[0_0_60px_rgba(34,211,238,0.25)] max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-[10px] font-bold uppercase tracking-widest">
            <Bell className="w-3.5 h-3.5" /> Dispatch Preferences
          </div>
          <h2 className="text-xl sm:text-2xl font-black italic tracking-tight text-white uppercase">
            Application Settings
          </h2>
          <p className="text-xs text-slate-400">
            Configure real-time ETA alerts, browser notifications, sound chimes, and specialist hotlines.
          </p>
        </div>

        {/* Settings Groups */}
        <div className="space-y-5">
          {/* 1. Browser Notification Settings Card */}
          <div className="bg-[#0A0B10] border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Laptop className="w-4 h-4 text-cyan-400" />
                    5-Min Technician Arrival Alert
                  </h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Sends a desktop browser notification when your mobile workshop van is <span className="text-cyan-400 font-bold">5 minutes away</span> from your location.
                </p>
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                onClick={handleNotificationToggle}
                className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  notificationsEnabled ? 'bg-cyan-500 shadow-[0_0_12px_rgba(34,211,238,0.6)]' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-black shadow-lg ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                    notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                >
                  {notificationsEnabled ? (
                    <Bell className="w-3.5 h-3.5 text-cyan-400" />
                  ) : (
                    <BellOff className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </span>
              </button>
            </div>

            {/* Permission Status Indicator */}
            <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
              <span className="text-slate-400 font-medium">Browser Permission Status:</span>
              <span className="font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
                {permissionStatus === 'granted' && (
                  <span className="text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Permission Granted
                  </span>
                )}
                {permissionStatus === 'default' && (
                  <span className="text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Permission Required
                  </span>
                )}
                {permissionStatus === 'denied' && (
                  <span className="text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Blocked in Browser
                  </span>
                )}
              </span>
            </div>

            {/* Test Notification Action */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleTestClick}
                className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-cyan-500/30 rounded-xl text-xs font-bold uppercase tracking-wider text-cyan-400 hover:text-white transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                {testSent ? 'Test Alert Dispatched!' : 'Send Test 5-Min Browser Notification'}
              </button>
            </div>
          </div>

          {/* 2. Audio Chime Settings Card */}
          <div className="bg-[#0A0B10] border border-white/10 rounded-2xl p-5 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                {audioEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                Dispatch Sound Chime
              </h3>
              <p className="text-xs text-slate-400">
                Play an audible alert chime when the technician enters the 5-minute radius.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onToggleAudio(!audioEnabled)}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                audioEnabled ? 'bg-cyan-500 shadow-[0_0_12px_rgba(34,211,238,0.6)]' : 'bg-slate-800'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-black shadow-lg ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                  audioEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              >
                {audioEnabled ? (
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                )}
              </span>
            </button>
          </div>

          {/* 3. Static Verified Specialist Hotline */}
          <div className="bg-[#0A0B10] border border-white/10 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-cyan-400" />
                24/7 Specialist Direct Hotline
              </h3>
              <span className="px-2 py-0.5 bg-green-500/10 border border-green-500/20 text-green-400 font-mono text-[9px] font-bold uppercase rounded">
                Static Verified
              </span>
            </div>
            <div className="p-3 bg-[#0D0E15] border border-white/10 rounded-xl flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-slate-400 font-mono block">OFFICIAL DISPATCH HOTLINE</span>
                <span className="text-sm font-mono font-bold text-cyan-400">{specialistPhone}</span>
              </div>
              <a
                href={`tel:${specialistPhone}`}
                className="px-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 shrink-0 shadow-[0_0_12px_rgba(34,211,238,0.3)]"
              >
                <Phone className="w-3.5 h-3.5 text-black" />
                <span>Call Hotline</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-2 text-center">
          <button
            onClick={onClose}
            className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-200 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
