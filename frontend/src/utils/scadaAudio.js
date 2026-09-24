// Web Audio API SCADA Substation Sound & Alarm Engine
// High-clarity, distinct auditory signatures for each SCADA condition

let isAudioMuted = false;
let sharedAudioCtx = null;

const getAudioCtx = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    if (!sharedAudioCtx) {
      sharedAudioCtx = new AudioContext();
    }
    if (sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume();
    }
    return sharedAudioCtx;
  } catch (e) {
    return null;
  }
};

export const setScadaAudioMute = (muted) => {
  isAudioMuted = muted;
};

export const getScadaAudioMute = () => isAudioMuted;

// Subtle UI click / telemetry blip
export const playScadaBeep = (freq = 960, duration = 0.08) => {
  if (isAudioMuted) return;
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
};

// 1. STORM CHALLENGE: Critical Emergency SCADA Siren (Sharp warning warble)
export const playEmergencyAlarm = () => {
  if (isAudioMuted) return;
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;

    const pulses = [
      { time: 0.00, freq: 880, dur: 0.12 },
      { time: 0.15, freq: 660, dur: 0.12 },
      { time: 0.30, freq: 880, dur: 0.12 },
      { time: 0.45, freq: 1100, dur: 0.18 }
    ];

    pulses.forEach(({ time, freq, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + time);
      gain.gain.setValueAtTime(0.24, ctx.currentTime + time);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + time);
      osc.stop(ctx.currentTime + time + dur);
    });
  } catch (e) {}
};

// 2. DUST/SOILING CHALLENGE: Gentle Robotic Cleaning & Maintenance Chime (No emergency siren)
export const playMaintenanceChime = () => {
  if (isAudioMuted) return;
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;

    const notes = [
      { time: 0.00, freq: 523.25, dur: 0.18 }, // C5
      { time: 0.12, freq: 659.25, dur: 0.22 }  // E5
    ];

    notes.forEach(({ time, freq, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + time);
      gain.gain.setValueAtTime(0.18, ctx.currentTime + time);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + time);
      osc.stop(ctx.currentTime + time + dur);
    });
  } catch (e) {}
};

// 3. SENSOR BLINDNESS CHALLENGE: High-Tech Digital Failover Chirp (Cybernetic 42ms switch)
export const playFailoverTone = () => {
  if (isAudioMuted) return;
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;

    const chirps = [
      { time: 0.00, freq: 1200, dur: 0.05 },
      { time: 0.06, freq: 1600, dur: 0.05 },
      { time: 0.12, freq: 2000, dur: 0.08 }
    ];

    chirps.forEach(({ time, freq, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + time);
      gain.gain.setValueAtTime(0.16, ctx.currentTime + time);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + time);
      osc.stop(ctx.currentTime + time + dur);
    });
  } catch (e) {}
};

// 4. SUMMER PEAK OVERLOAD CHALLENGE: Deep Resonant Power Grid Warning Tone (Substation Alert)
export const playGridSurgeAlert = () => {
  if (isAudioMuted) return;
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;

    const surge = [
      { time: 0.00, freq: 340, dur: 0.16 },
      { time: 0.16, freq: 440, dur: 0.22 }
    ];

    surge.forEach(({ time, freq, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + time);
      gain.gain.setValueAtTime(0.14, ctx.currentTime + time);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + time);
      osc.stop(ctx.currentTime + time + dur);
    });
  } catch (e) {}
};

// 5. CRITICAL HARDWARE DAMAGE: 15-Second Pulsing Substation Evacuation Siren
let sirenInterval = null;
let sirenTimeout = null;

export const start15SecondSiren = (onTick, onEnd) => {
  stopEmergencySiren(); // clear any previous siren

  const ctx = getAudioCtx();
  if (!ctx || isAudioMuted) return;

  let secondsLeft = 15;
  if (onTick) onTick(secondsLeft);

  const playPulse = () => {
    try {
      const now = ctx.currentTime;
      // High Horn Tone (820 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(820, now);
      gain1.gain.setValueAtTime(0.24, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.28);

      // Low Horn Tone (580 Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(580, now + 0.30);
      gain2.gain.setValueAtTime(0.24, now + 0.30);
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.58);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.30);
      osc2.stop(now + 0.58);
    } catch (e) {}
  };

  playPulse();
  sirenInterval = setInterval(playPulse, 620);

  const countdownTimer = setInterval(() => {
    secondsLeft -= 1;
    if (onTick) onTick(secondsLeft);
    if (secondsLeft <= 0) {
      clearInterval(countdownTimer);
    }
  }, 1000);

  sirenTimeout = setTimeout(() => {
    stopEmergencySiren();
    if (onEnd) onEnd();
  }, 15000);

  window._sirenCountdown = countdownTimer;
};

export const stopEmergencySiren = () => {
  if (sirenInterval) {
    clearInterval(sirenInterval);
    sirenInterval = null;
  }
  if (sirenTimeout) {
    clearTimeout(sirenTimeout);
    sirenTimeout = null;
  }
  if (window._sirenCountdown) {
    clearInterval(window._sirenCountdown);
    window._sirenCountdown = null;
  }
};
