import { useEffect, useRef } from 'react'
import styles from './FooterSignature.module.css'

/**
 * The ZENJI signature as a dot-matrix particle field.
 *
 * Letters (and the red 禅) are sampled from an offscreen text render into a
 * dot grid on a canvas; only the dots ever draw. Every dot carries a home
 * position and a velocity. Two forces act each frame, always both: a weak
 * spring pulling the dot home, and inside the cursor's radius a repel push.
 * That additive combination is what makes the reformation after the cursor
 * leaves read as physics rather than as a scripted animation.
 *
 * On first reveal the dots are scattered and let the same spring pull them
 * back, so the wordmark lands like little marbles settling into place.
 *
 * Adapted from the FooterSignature in the author's portfolio project
 * (repel mode only, no mode/radius/force controls). Mouse coordinates and the
 * animation loop live in refs; nothing here re-renders per frame.
 */

const TEXT = 'ZENJI 禅'
const DOT_PITCH = 2.6
const DOT_SIZE = 1.55
const REFERENCE_FONT_PX = 90
const MAX_FONT_PX = 240

/** Zen reads white on ink; the 禅 stamp reads brand red. */
const ZEN_COLOR = [255, 255, 255] as const
const MARK_COLOR = [255, 61, 61] as const
const SPARK_COLOR = [255, 176, 176] as const

const FRICTION = 0.85
const RETURN_SPEED = 0.065
const INTRO_BOOST_FRAMES = 70
const MAX_SPEED = 220
const HOLD_BOOST = 2.5

interface Dot {
  fx: number
  fy: number
  x: number
  y: number
  vx: number
  vy: number
  r: number
  g: number
  b: number
}

export function FooterSignature() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const canvasEl = canvasRef.current
    if (!container || !canvasEl) return
    const canvas: HTMLCanvasElement = canvasEl
    const context = canvasEl.getContext('2d')
    if (!context) return
    const ctx: CanvasRenderingContext2D = context

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const finePointerQuery = window.matchMedia('(pointer: fine)')
    let interactive = !reducedMotionQuery.matches && finePointerQuery.matches

    let width = 0
    let height = 0
    let dpr = 1
    let dots: Dot[] = []
    let pointerX = -9999
    let pointerY = -9999
    let mouseDown = false
    let currentRadius = 0
    let raf = 0
    let lastDraw = 0
    let running = false
    let visible = false
    let dotSizePx = DOT_SIZE
    let hasExploded = false
    let introFramesLeft = 0
    const FRAME_MS = 16

    let baseRadius = 60
    let baseForce = 9
    let colorNorm = 200

    function sampleDots() {
      const rect = container!.getBoundingClientRect()
      width = Math.max(1, rect.width)
      dpr = Math.min(window.devicePixelRatio || 1, 2)

      const fontFamily =
        getComputedStyle(document.documentElement).getPropertyValue('--font-brand') ||
        'sans-serif'
      const sampleCtx = document.createElement('canvas').getContext('2d')!
      let fontSize = MAX_FONT_PX
      while (fontSize > 24 && sampleCtx.measureText(TEXT).width > width * 0.96) {
        sampleCtx.font = `400 ${fontSize}px ${fontFamily.trim()}`
        fontSize -= 4
      }
      sampleCtx.font = `400 ${fontSize}px ${fontFamily.trim()}`

      const sizeScale = Math.min(2.3, Math.max(1, fontSize / REFERENCE_FONT_PX))
      dotSizePx = DOT_SIZE * Math.min(1.9, Math.max(1, sizeScale * 0.9))
      // a tighter influence radius: the field reads as a strong magnet close
      // to the cursor rather than a wide slow push
      baseRadius = Math.max(30, Math.min(110, fontSize * 0.45))
      baseForce = Math.max(4, Math.min(24, fontSize * 0.11))
      colorNorm = Math.max(90, Math.min(420, fontSize * 2.4))

      const textHeight = fontSize * 1.1
      const bleedY = baseRadius * 1.3
      height = textHeight + bleedY * 2

      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      // collapse most of the physics bleed out of the layout, leaving a small
      // visible margin around the name; the canvas keeps the rest as runway
      const pull = Math.max(24, bleedY - 28)
      canvas.style.marginTop = `${-pull}px`
      canvas.style.marginBottom = `${-pull}px`

      const off = document.createElement('canvas')
      off.width = canvas.width
      off.height = canvas.height
      const octx = off.getContext('2d')!
      octx.scale(dpr, dpr)
      octx.font = `400 ${fontSize}px ${fontFamily.trim()}`
      octx.fillStyle = '#fff'
      octx.textAlign = 'center'
      octx.textBaseline = 'middle'
      const textY = bleedY + fontSize * 0.62
      octx.fillText(TEXT, width / 2, textY)

      // Colour split: the latin word draws white, the 禅 draws red. Sample the
      // mark separately by measuring where the last glyph sits.
      const zenWidth = sampleCtx.measureText('ZENJI ').width
      const total = sampleCtx.measureText(TEXT).width
      const markStartX = width / 2 - total / 2 + zenWidth

      const img = octx.getImageData(0, 0, off.width, off.height).data
      const pitchPx = DOT_PITCH * sizeScale * dpr
      const next: Dot[] = []
      for (let py = pitchPx / 2; py < off.height; py += pitchPx) {
        for (let px = pitchPx / 2; px < off.width; px += pitchPx) {
          const idx = (Math.floor(py) * off.width + Math.floor(px)) * 4 + 3
          if (img[idx] > 120) {
            const fx = px / dpr
            const fy = py / dpr
            const c = fx >= markStartX / dpr ? MARK_COLOR : ZEN_COLOR
            next.push({ fx, fy, x: fx, y: fy, vx: 0, vy: 0, r: c[0], g: c[1], b: c[2] })
          }
        }
      }
      dots = next
    }

    function draw() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)
      for (const d of dots) {
        const distFromHome = Math.hypot(d.x - d.fx, d.y - d.fy)
        const t = Math.min(1, distFromHome / colorNorm)
        const r = d.r + (SPARK_COLOR[0] - d.r) * t
        const g = d.g + (SPARK_COLOR[1] - d.g) * t
        const b = d.b + (SPARK_COLOR[2] - d.b) * t
        const alpha = Math.min(1, 0.96 + t * 0.04)
        ctx.fillStyle = `rgba(${r.toFixed(0)},${g.toFixed(0)},${b.toFixed(0)},${alpha.toFixed(3)})`
        ctx.fillRect(d.x - dotSizePx / 2, d.y - dotSizePx / 2, dotSizePx, dotSizePx)
      }

      if (interactive && pointerX > 0 && pointerX < width && pointerY > 0 && pointerY < height) {
        const glowR = currentRadius * 0.35
        const glow = ctx.createRadialGradient(pointerX, pointerY, 0, pointerX, pointerY, glowR)
        glow.addColorStop(0, 'rgba(255,61,61,0.07)')
        glow.addColorStop(1, 'rgba(255,61,61,0)')
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(pointerX, pointerY, glowR, 0, Math.PI * 2)
        ctx.fill()

        ctx.strokeStyle = `rgba(255,61,61,${mouseDown ? 0.45 : 0.2})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(pointerX, pointerY, currentRadius * 0.15, 0, Math.PI * 2)
        ctx.stroke()

        ctx.fillStyle = 'rgba(255,61,61,0.8)'
        ctx.beginPath()
        ctx.arc(pointerX, pointerY, 2, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    /** First reveal: scatter the dots, then let the spring settle them home. */
    function explodeIn() {
      for (const d of dots) {
        const angle = Math.random() * Math.PI * 2
        const dist = baseRadius * (0.4 + Math.random() * 0.9)
        d.x = d.fx + Math.cos(angle) * dist
        d.y = d.fy + Math.sin(angle) * dist
        const speed = 40 + Math.random() * 70
        d.vx = Math.cos(angle) * speed
        d.vy = Math.sin(angle) * speed
      }
      introFramesLeft = INTRO_BOOST_FRAMES
    }

    function tick() {
      const radius = baseRadius
      const strength = baseForce * (mouseDown ? HOLD_BOOST : 1)
      currentRadius = radius

      let returnSpeed = RETURN_SPEED
      if (introFramesLeft > 0) {
        returnSpeed = RETURN_SPEED * (1 + 3 * (introFramesLeft / INTRO_BOOST_FRAMES))
        introFramesLeft--
      }

      for (const d of dots) {
        let ax = 0
        let ay = 0

        if (interactive) {
          const dx = d.x - pointerX
          const dy = d.y - pointerY
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < radius && dist > 0.1) {
            const f = (1 - dist / radius) * strength
            const nx = dx / dist
            const ny = dy / dist
            ax = nx * f
            ay = ny * f
          }
        }

        d.vx += ax + (d.fx - d.x) * returnSpeed
        d.vy += ay + (d.fy - d.y) * returnSpeed
        d.vx *= FRICTION
        d.vy *= FRICTION

        const speed = Math.hypot(d.vx, d.vy)
        if (speed > MAX_SPEED) {
          const scale = MAX_SPEED / speed
          d.vx *= scale
          d.vy *= scale
        }

        d.x += d.vx
        d.y += d.vy
      }
    }

    function loop(now: number) {
      if (!running) return
      raf = requestAnimationFrame(loop)
      if (now - lastDraw < FRAME_MS) return
      lastDraw = now
      tick()
      draw()
    }

    function start() {
      if (running || !visible) return
      running = true
      lastDraw = 0
      raf = requestAnimationFrame(loop)
    }

    function stop() {
      if (!running) return
      running = false
      cancelAnimationFrame(raf)
    }

    function onPointerMove(e: PointerEvent) {
      if (e.pointerType !== 'mouse') return
      const rect = canvas.getBoundingClientRect()
      pointerX = e.clientX - rect.left
      pointerY = e.clientY - rect.top
    }
    function onPointerAway() {
      pointerX = -9999
      pointerY = -9999
      mouseDown = false
    }
    function onPointerDown(e: PointerEvent) {
      if (e.pointerType !== 'mouse') return
      mouseDown = true
    }
    function onPointerUp() {
      mouseDown = false
    }

    function onResize() {
      sampleDots()
      if (!running) draw()
    }

    function onReducedMotionChange() {
      interactive = !reducedMotionQuery.matches && finePointerQuery.matches
      if (!interactive) {
        for (const d of dots) {
          d.vx = 0
          d.vy = 0
          d.x = d.fx
          d.y = d.fy
        }
        draw()
      }
    }

    sampleDots()
    draw()

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) start()
        else stop()
      },
      { rootMargin: '80px 0px 80px 0px', threshold: 0.01 },
    )
    io.observe(container)

    const explodeIo = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasExploded) return
        hasExploded = true
        explodeIo.disconnect()
        if (!reducedMotionQuery.matches) {
          explodeIn()
          draw()
        }
      },
      { rootMargin: '0px', threshold: 0.35 },
    )
    explodeIo.observe(container)

    let resizeRaf = 0
    const onWindowResize = () => {
      if (resizeRaf) return
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = 0
        onResize()
      })
    }

    window.addEventListener('resize', onWindowResize, { passive: true })
    reducedMotionQuery.addEventListener('change', onReducedMotionChange)
    finePointerQuery.addEventListener('change', onReducedMotionChange)
    if (interactive) {
      canvas.addEventListener('pointermove', onPointerMove, { passive: true })
      canvas.addEventListener('pointerleave', onPointerAway, { passive: true })
      canvas.addEventListener('pointerdown', onPointerDown, { passive: true })
      window.addEventListener('pointerup', onPointerUp, { passive: true })
    }

    return () => {
      stop()
      io.disconnect()
      explodeIo.disconnect()
      window.removeEventListener('resize', onWindowResize)
      reducedMotionQuery.removeEventListener('change', onReducedMotionChange)
      finePointerQuery.removeEventListener('change', onReducedMotionChange)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerleave', onPointerAway)
      canvas.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [])

  return (
    <div ref={containerRef} className={styles.wrap} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  )
}
