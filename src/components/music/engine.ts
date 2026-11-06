import type { SynthSpec } from '../../data/music'

/**
 * Petit synthétiseur Web Audio : joue un instrumental complet (accords, basse, batterie)
 * à partir d’une description de morceau. Un seul morceau à la fois.
 */
type AudioCtor = typeof AudioContext
const getCtor = (): AudioCtor | null => {
  const w = window as unknown as { AudioContext?: AudioCtor; webkitAudioContext?: AudioCtor }
  return w.AudioContext ?? w.webkitAudioContext ?? null
}

const SCALES = { major: [0, 2, 4, 5, 7, 9, 11], minor: [0, 2, 3, 5, 7, 8, 10] }
const hz = (m: number) => 440 * Math.pow(2, (m - 69) / 12)

const DRUMS = {
  boombap: { k: [1, 0, 0, 0, 0, 0, 0, 0.7, 0, 0, 1, 0, 0, 0, 0, 0], s: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0.3], h: [0.8, 0, 0.4, 0, 0.8, 0, 0.4, 0.2, 0.8, 0, 0.4, 0, 0.8, 0, 0.5, 0.3], bass: [0, 7, 10] },
  trap: { k: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0], s: [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0], h: [0.7, 0.4, 0.7, 0.4, 0.7, 0.4, 0.7, 0.4, 0.7, 0.4, 0.7, 0.4, 0.7, 0.6, 0.8, 0.6], bass: [0, 6, 10] },
  pop: { k: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0], s: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0], h: [0, 0, 0.6, 0, 0, 0, 0.6, 0, 0, 0, 0.6, 0, 0, 0, 0.6, 0], bass: [0, 4, 8, 12] },
  afro: { k: [1, 0, 0, 0, 0, 0, 0.8, 0, 1, 0, 0, 0.7, 0, 0, 0, 0], s: [0, 0, 0, 0.6, 0, 0, 0, 0.6, 0, 0, 0, 0.6, 0, 0, 0, 0.6], h: [0.5, 0.25, 0.5, 0.25, 0.5, 0.25, 0.5, 0.25, 0.5, 0.25, 0.5, 0.25, 0.5, 0.25, 0.5, 0.25], bass: [0, 3, 6, 10, 12] },
  none: { k: [] as number[], s: [] as number[], h: [] as number[], bass: [0] },
}

class MusicEngine {
  ctx: AudioContext | null = null
  out: GainNode | null = null
  noise: AudioBuffer | null = null
  timer: number | null = null
  spec: SynthSpec | null = null
  step = 0
  next = 0

  private ensure() {
    if (this.ctx) return this.ctx
    const C = getCtor()
    if (!C) return null
    const ctx = new C()
    const out = ctx.createGain()
    const comp = ctx.createDynamicsCompressor()
    comp.threshold.value = -16
    comp.ratio.value = 3.5
    out.connect(comp).connect(ctx.destination)
    const len = Math.floor(ctx.sampleRate * 0.5)
    const buf = ctx.createBuffer(1, len, ctx.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
    this.ctx = ctx
    this.out = out
    this.noise = buf
    return ctx
  }

  private env(t: number, peak: number, attack: number, decay: number) {
    const g = this.ctx!.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(peak, t + attack)
    g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay)
    g.connect(this.out!)
    return g
  }

  private osc(t: number, type: OscillatorType, f: number, dest: AudioNode, dur: number, detune = 0) {
    const o = this.ctx!.createOscillator()
    o.type = type
    o.frequency.value = f
    o.detune.value = detune
    o.connect(dest)
    o.start(t)
    o.stop(t + dur)
    return o
  }

  private noiseHit(t: number, v: number, type: BiquadFilterType, freq: number, decay: number) {
    const src = this.ctx!.createBufferSource()
    src.buffer = this.noise
    const f = this.ctx!.createBiquadFilter()
    f.type = type
    f.frequency.value = freq
    src.connect(f).connect(this.env(t, v, 0.002, decay))
    src.start(t)
    src.stop(t + decay + 0.05)
  }

  private kick(t: number, v: number) {
    const g = this.env(t, 0.9 * v, 0.004, 0.4)
    const o = this.osc(t, 'sine', 150, g, 0.45)
    o.frequency.setValueAtTime(150, t)
    o.frequency.exponentialRampToValueAtTime(42, t + 0.13)
  }

  private snare(t: number, v: number, rim: boolean) {
    if (rim) {
      this.osc(t, 'square', 820, this.env(t, 0.18 * v, 0.002, 0.05), 0.08)
      return
    }
    this.noiseHit(t, 0.45 * v, 'bandpass', 1900, 0.2)
    this.osc(t, 'triangle', 190, this.env(t, 0.3 * v, 0.003, 0.1), 0.14)
  }

  private bass(t: number, m: number, dur: number, style: SynthSpec['drums']) {
    const g = this.env(t, style === 'trap' ? 0.55 : 0.42, 0.01, dur)
    const lp = this.ctx!.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 420
    lp.connect(g)
    this.osc(t, style === 'trap' ? 'sine' : 'triangle', hz(m), lp, dur + 0.05)
  }

  private chord(t: number, notes: number[], keys: SynthSpec['keys'], barDur: number) {
    if (keys === 'pad') {
      const g = this.ctx!.createGain()
      g.gain.setValueAtTime(0.0001, t)
      g.gain.linearRampToValueAtTime(0.07, t + barDur * 0.35)
      g.gain.linearRampToValueAtTime(0.0001, t + barDur * 1.02)
      const lp = this.ctx!.createBiquadFilter()
      lp.type = 'lowpass'
      lp.frequency.value = 1300
      lp.connect(g).connect(this.out!)
      notes.forEach((n) => {
        this.osc(t, 'sawtooth', hz(n), lp, barDur * 1.05, -7)
        this.osc(t, 'sawtooth', hz(n), lp, barDur * 1.05, 7)
      })
    } else if (keys === 'piano') {
      notes.forEach((n, i) => {
        const g = this.env(t + i * 0.012, 0.11, 0.005, 1.6)
        this.osc(t + i * 0.012, 'triangle', hz(n), g, 1.7)
        this.osc(t + i * 0.012, 'sine', hz(n + 12), this.env(t, 0.03, 0.005, 0.9), 1)
      })
    } else if (keys === 'guitar') {
      notes.forEach((n, i) => {
        const tt = t + i * 0.018
        const lp = this.ctx!.createBiquadFilter()
        lp.type = 'lowpass'
        lp.frequency.value = 2400
        lp.connect(this.env(tt, 0.09, 0.003, 0.7))
        this.osc(tt, 'sawtooth', hz(n), lp, 0.8)
      })
    }
  }

  private pluck(t: number, m: number) {
    const lp = this.ctx!.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.setValueAtTime(3200, t)
    lp.frequency.exponentialRampToValueAtTime(500, t + 0.25)
    lp.connect(this.env(t, 0.09, 0.003, 0.28))
    this.osc(t, 'square', hz(m), lp, 0.32)
  }

  private notesFor(deg: number) {
    const s = this.spec!
    const sc = SCALES[s.scale]
    return [0, 2, 4].map((i) => {
      const d = deg + i
      return s.root + 12 + 12 * Math.floor(d / 7) + sc[d % 7]
    })
  }

  private tick = () => {
    const ctx = this.ctx
    const s = this.spec
    if (!ctx || !s) return
    const stepDur = 60 / s.bpm / 4
    const barDur = stepDur * 16
    const pat = DRUMS[s.drums]
    while (this.next < ctx.currentTime + 0.15) {
      const t = this.next
      const st = this.step % 16
      const bar = Math.floor(this.step / 16)
      const deg = s.prog[bar % s.prog.length]
      const chord = this.notesFor(deg)
      // batterie
      if (pat.k[st]) this.kick(t, pat.k[st])
      if (pat.s[st]) this.snare(t, pat.s[st], s.drums === 'afro')
      if (pat.h[st]) {
        this.noiseHit(t, 0.12 * pat.h[st], 'highpass', 7500, 0.04)
        if (s.drums === 'trap' && st >= 12) this.noiseHit(t + stepDur / 2, 0.08, 'highpass', 8000, 0.03)
      }
      // basse
      if (pat.bass.includes(st)) {
        const len = s.drums === 'none' ? barDur * 0.95 : s.drums === 'trap' ? stepDur * 5 : stepDur * 2.6
        this.bass(t, chord[0] - 24, len, s.drums)
      }
      // accords / mélodie
      if (s.keys === 'pluck') {
        if (st % 2 === 0) this.pluck(t, chord[(st / 2) % 3] + (st >= 8 ? 12 : 0))
      } else if (st === 0 || (s.keys === 'piano' && st === 8 && s.drums !== 'none') || (s.keys === 'guitar' && (st === 6 || st === 10))) {
        this.chord(t, chord, s.keys, barDur)
      }
      this.next += stepDur
      this.step++
    }
  }

  play(spec: SynthSpec) {
    const ctx = this.ensure()
    if (!ctx || !this.out) return false
    this.stop()
    this.spec = spec
    void ctx.resume()
    this.out.gain.cancelScheduledValues(ctx.currentTime)
    this.out.gain.setValueAtTime(0.85, ctx.currentTime)
    this.step = 0
    this.next = ctx.currentTime + 0.08
    this.tick()
    this.timer = window.setInterval(this.tick, 25)
    return true
  }

  stop() {
    if (this.timer !== null) {
      window.clearInterval(this.timer)
      this.timer = null
    }
    if (this.ctx && this.out) {
      const now = this.ctx.currentTime
      this.out.gain.cancelScheduledValues(now)
      this.out.gain.setValueAtTime(this.out.gain.value, now)
      this.out.gain.linearRampToValueAtTime(0, now + 0.06)
    }
    this.spec = null
  }
}

let engine: MusicEngine | null = null
export const musicEngine = () => (engine ??= new MusicEngine())
export const synthSupported = () => typeof window !== 'undefined' && getCtor() !== null
