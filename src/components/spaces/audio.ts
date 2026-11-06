import { useEffect, useRef } from 'react'

/**
 * Petit moteur sonore Web Audio (démo) :
 * - mode « beat » : boucle boom bap (kick + caisse claire + charleston) générée en direct
 * - mode « click » : métronome
 * Aucun fichier audio, aucun micro : tout est synthétisé dans le navigateur.
 */
export type LoopMode = 'beat' | 'click'

type AudioCtor = typeof AudioContext
const getCtor = (): AudioCtor | null => {
  if (typeof window === 'undefined') return null
  const w = window as unknown as { AudioContext?: AudioCtor; webkitAudioContext?: AudioCtor }
  return w.AudioContext ?? w.webkitAudioContext ?? null
}

export const audioSupported = () => getCtor() !== null

// Motif sur 16 doubles-croches
const KICK = [1, 0, 0, 0, 0, 0, 0, 0.7, 0, 0, 1, 0, 0, 0, 0, 0]
const SNARE = [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0.35]
const HAT = [0.9, 0, 0.45, 0, 0.8, 0, 0.45, 0.25, 0.9, 0, 0.45, 0, 0.8, 0, 0.5, 0.3]

class LoopEngine {
  ctx: AudioContext | null = null
  master: GainNode | null = null
  noise: AudioBuffer | null = null
  timer: number | null = null
  step = 0
  nextTime = 0
  bpm = 90
  mode: LoopMode = 'beat'
  volume = 0.8

  private ensure() {
    if (this.ctx) return this.ctx
    const Ctor = getCtor()
    if (!Ctor) return null
    const ctx = new Ctor()
    const master = ctx.createGain()
    master.gain.value = this.volume
    const comp = ctx.createDynamicsCompressor()
    comp.threshold.value = -14
    comp.ratio.value = 4
    master.connect(comp).connect(ctx.destination)
    const len = Math.floor(ctx.sampleRate * 0.5)
    const buf = ctx.createBuffer(1, len, ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
    this.ctx = ctx
    this.master = master
    this.noise = buf
    return ctx
  }

  private kick(t: number, v: number) {
    const ctx = this.ctx!
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'sine'
    o.frequency.setValueAtTime(150, t)
    o.frequency.exponentialRampToValueAtTime(42, t + 0.14)
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.95 * v, t + 0.005)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.42)
    o.connect(g).connect(this.master!)
    o.start(t)
    o.stop(t + 0.45)
  }

  private noiseHit(t: number, v: number, type: BiquadFilterType, freq: number, decay: number) {
    const ctx = this.ctx!
    const src = ctx.createBufferSource()
    src.buffer = this.noise
    const f = ctx.createBiquadFilter()
    f.type = type
    f.frequency.value = freq
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(v, t + 0.002)
    g.gain.exponentialRampToValueAtTime(0.0001, t + decay)
    src.connect(f).connect(g).connect(this.master!)
    src.start(t)
    src.stop(t + decay + 0.02)
  }

  private snare(t: number, v: number) {
    this.noiseHit(t, 0.5 * v, 'bandpass', 1900, 0.2)
    const ctx = this.ctx!
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'triangle'
    o.frequency.setValueAtTime(220, t)
    o.frequency.exponentialRampToValueAtTime(140, t + 0.08)
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.35 * v, t + 0.003)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12)
    o.connect(g).connect(this.master!)
    o.start(t)
    o.stop(t + 0.14)
  }

  private click(t: number, accent: boolean) {
    const ctx = this.ctx!
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'square'
    o.frequency.value = accent ? 1760 : 1180
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(accent ? 0.32 : 0.2, t + 0.002)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05)
    o.connect(g).connect(this.master!)
    o.start(t)
    o.stop(t + 0.06)
  }

  private schedule = () => {
    const ctx = this.ctx
    if (!ctx) return
    const stepDur = 60 / this.bpm / 4
    while (this.nextTime < ctx.currentTime + 0.12) {
      const s = this.step % 16
      const t = this.nextTime
      if (this.mode === 'beat') {
        if (KICK[s]) this.kick(t, KICK[s])
        if (SNARE[s]) this.snare(t, SNARE[s])
        if (HAT[s]) this.noiseHit(t, 0.16 * HAT[s], 'highpass', 7200, s === 14 ? 0.12 : 0.045)
      } else if (s % 4 === 0) {
        this.click(t, s === 0)
      }
      this.nextTime += stepDur
      this.step++
    }
  }

  start(mode: LoopMode, bpm: number) {
    const ctx = this.ensure()
    if (!ctx || !this.master) return false
    this.stop()
    this.mode = mode
    this.bpm = bpm
    void ctx.resume()
    this.master.gain.cancelScheduledValues(ctx.currentTime)
    this.master.gain.setValueAtTime(this.volume, ctx.currentTime)
    this.step = 0
    this.nextTime = ctx.currentTime + 0.06
    this.schedule()
    this.timer = window.setInterval(this.schedule, 25)
    return true
  }

  stop() {
    if (this.timer !== null) {
      window.clearInterval(this.timer)
      this.timer = null
    }
    const ctx = this.ctx
    if (ctx && this.master) {
      // fondu très court pour éviter les clics, puis mise en veille
      const now = ctx.currentTime
      this.master.gain.cancelScheduledValues(now)
      this.master.gain.setValueAtTime(this.master.gain.value, now)
      this.master.gain.linearRampToValueAtTime(0, now + 0.04)
    }
  }

  dispose() {
    this.stop()
    const ctx = this.ctx
    this.ctx = null
    this.master = null
    if (ctx) window.setTimeout(() => void ctx.close().catch(() => {}), 80)
  }
}

/**
 * Joue une boucle synthétisée tant que `active` est vrai.
 * S’arrête automatiquement à la pause et au démontage du composant.
 */
export function useLoop(active: boolean, mode: LoopMode, bpm: number) {
  const engine = useRef<LoopEngine | null>(null)
  if (!engine.current) engine.current = new LoopEngine()

  useEffect(() => {
    const e = engine.current!
    if (active) e.start(mode, bpm)
    else e.stop()
  }, [active, mode]) // eslint-disable-line react-hooks/exhaustive-deps

  // tempo modifiable en cours de lecture
  useEffect(() => {
    engine.current!.bpm = bpm
  }, [bpm])

  useEffect(() => {
    const e = engine.current!
    return () => e.dispose()
  }, [])
}
