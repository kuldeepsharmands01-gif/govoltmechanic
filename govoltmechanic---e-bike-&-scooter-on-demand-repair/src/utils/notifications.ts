/**
 * Plays a synth chime using Web Audio API for ETA alerts.
 */
export function playEtaChime() {
  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    // Play double-tone high tech chime (880Hz -> 1174Hz)
    const playTone = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);

      gain.gain.setValueAtTime(0, ctx.currentTime + start);
      gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + duration);
    };

    playTone(880, 0, 0.2); // A5
    playTone(1174.66, 0.15, 0.4); // D6
  } catch (e) {
    console.warn('Audio playback error:', e);
  }
}

/**
 * Triggers a browser Notification if permission is granted.
 */
export function triggerBrowserNotification(title: string, body: string): boolean {
  if (!('Notification' in window)) {
    console.warn('Browser does not support notifications.');
    return false;
  }

  if (Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        tag: 'govolt-eta-alert',
      });
      return true;
    } catch (e) {
      console.error('Failed to trigger Notification object:', e);
    }
  }
  return false;
}
