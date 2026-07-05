let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

export function playAlarm() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const notes = [523.25, 659.25, 783.99];

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = freq;

    gain.gain.setValueAtTime(0, now + i * 0.2);
    gain.gain.linearRampToValueAtTime(0.3, now + i * 0.2 + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.2 + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + i * 0.2);
    osc.stop(now + i * 0.2 + 0.4);
  });
}
