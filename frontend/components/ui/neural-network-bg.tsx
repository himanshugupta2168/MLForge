"use client"

import { useEffect, useRef } from "react"

interface Node {
    x: number
    y: number
    vx: number
    vy: number
    radius: number
    layer: number // 0 = left, 1 = mid, 2 = right — for directional pulses
}

interface Pulse {
    x: number
    y: number
    tx: number
    ty: number
    progress: number
    speed: number
    alpha: number
}

export function NeuralNetworkBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let animId: number
        let nodes: Node[] = []
        let pulses: Pulse[] = []

        const NODE_COUNT = 70
        const MAX_DIST = 170
        const MAX_PULSES = 60

        const resize = () => {
            canvas.width = canvas.offsetWidth
            canvas.height = canvas.offsetHeight
        }

        const initNodes = () => {
            nodes = Array.from({ length: NODE_COUNT }, () => {
                const x = Math.random() * canvas.width
                const layer = x < canvas.width * 0.33 ? 0 : x < canvas.width * 0.66 ? 1 : 2
                return {
                    x,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    radius: Math.random() * 1.4 + 0.5,
                    layer,
                }
            })
        }

        const spawnPulse = () => {
            if (pulses.length >= MAX_PULSES) return

            // Prefer left→right direction (simulating forward propagation)
            const from = nodes[Math.floor(Math.random() * nodes.length)]
            const candidates = nodes.filter(n => {
                const dx = n.x - from.x
                const dy = n.y - from.y
                const d = Math.sqrt(dx * dx + dy * dy)
                return d > 10 && d < MAX_DIST && n.layer >= from.layer // forward bias
            })

            // Fallback to any neighbor
            const pool = candidates.length > 0
                ? candidates
                : nodes.filter(n => {
                    const dx = n.x - from.x
                    const dy = n.y - from.y
                    return Math.sqrt(dx * dx + dy * dy) < MAX_DIST && n !== from
                })

            if (!pool.length) return
            const to = pool[Math.floor(Math.random() * pool.length)]
            pulses.push({
                x: from.x, y: from.y,
                tx: to.x, ty: to.y,
                progress: 0,
                speed: 0.022 + Math.random() * 0.028, // much faster
                alpha: 0.7 + Math.random() * 0.3,
            })
        }

        let frame = 0
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Move nodes
            nodes.forEach(n => {
                n.x += n.vx
                n.y += n.vy
                if (n.x < 0 || n.x > canvas.width) n.vx *= -1
                if (n.y < 0 || n.y > canvas.height) n.vy *= -1
            })

            // Edges
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[j].x - nodes[i].x
                    const dy = nodes[j].y - nodes[i].y
                    const d = Math.sqrt(dx * dx + dy * dy)
                    if (d < MAX_DIST) {
                        ctx.beginPath()
                        ctx.moveTo(nodes[i].x, nodes[i].y)
                        ctx.lineTo(nodes[j].x, nodes[j].y)
                        ctx.strokeStyle = `rgba(255,255,255,${(1 - d / MAX_DIST) * 0.08})`
                        ctx.lineWidth = 0.5
                        ctx.stroke()
                    }
                }
            }

            // Nodes
            nodes.forEach(n => {
                ctx.beginPath()
                ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2)
                ctx.fillStyle = "rgba(255,255,255,0.3)"
                ctx.fill()
            })

            // Pulses
            pulses = pulses.filter(p => p.progress < 1)
            pulses.forEach(p => {
                p.progress += p.speed
                const t = p.progress
                const x = p.x + (p.tx - p.x) * t
                const y = p.y + (p.ty - p.y) * t

                // Fade in/out over the journey
                const fade = p.alpha * (1 - Math.pow(t * 2 - 1, 4))

                // Trail — draw a short segment behind the pulse dot
                const trailT = Math.max(0, t - 0.12)
                const tx2 = p.x + (p.tx - p.x) * trailT
                const ty2 = p.y + (p.ty - p.y) * trailT
                const trailGrad = ctx.createLinearGradient(tx2, ty2, x, y)
                trailGrad.addColorStop(0, "rgba(255,255,255,0)")
                trailGrad.addColorStop(1, `rgba(255,255,255,${fade * 0.4})`)
                ctx.beginPath()
                ctx.moveTo(tx2, ty2)
                ctx.lineTo(x, y)
                ctx.strokeStyle = trailGrad
                ctx.lineWidth = 1
                ctx.stroke()

                // Glow
                const grd = ctx.createRadialGradient(x, y, 0, x, y, 7)
                grd.addColorStop(0, `rgba(255,255,255,${fade * 0.35})`)
                grd.addColorStop(1, "rgba(255,255,255,0)")
                ctx.beginPath()
                ctx.arc(x, y, 7, 0, Math.PI * 2)
                ctx.fillStyle = grd
                ctx.fill()

                // Dot
                ctx.beginPath()
                ctx.arc(x, y, 2, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(255,255,255,${fade})`
                ctx.fill()
            })

            // Spawn pulses — every 6 frames to keep it dense
            if (frame % 6 === 0) spawnPulse()
            // Extra burst every 30 frames
            if (frame % 30 === 0) { spawnPulse(); spawnPulse(); spawnPulse() }

            frame++
            animId = requestAnimationFrame(draw)
        }

        const observer = new ResizeObserver(() => { resize(); initNodes() })
        observer.observe(canvas)

        resize()
        initNodes()
        draw()

        return () => {
            cancelAnimationFrame(animId)
            observer.disconnect()
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
        />
    )
}
