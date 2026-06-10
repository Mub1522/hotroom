let ctx = null

function getCtx() {
  if (!ctx) ctx = new AudioContext()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function tone(ac, freq, start, duration, gain = 0.25, type = 'sine') {
  const osc = ac.createOscillator()
  const env = ac.createGain()
  osc.connect(env)
  env.connect(ac.destination)
  osc.type = type
  osc.frequency.value = freq
  env.gain.setValueAtTime(0, start)
  env.gain.linearRampToValueAtTime(gain, start + 0.012)
  env.gain.exponentialRampToValueAtTime(0.0001, start + duration)
  osc.start(start)
  osc.stop(start + duration + 0.05)
}

// Sonido de token donado: tres tonos ascendentes tipo "cha-ching"
export function playTokenSound() {
  const ac = getCtx()
  const now = ac.currentTime
  tone(ac, 880,  now,        0.12, 0.18)
  tone(ac, 1108, now + 0.10, 0.12, 0.15)
  tone(ac, 1318, now + 0.20, 0.20, 0.12)
}

// Sonido de follow: dos tonos suaves tipo notificación
export function playFollowSound() {
  const ac = getCtx()
  const now = ac.currentTime
  tone(ac, 523, now,        0.28, 0.15)   // C5
  tone(ac, 659, now + 0.18, 0.35, 0.15)  // E5
}
