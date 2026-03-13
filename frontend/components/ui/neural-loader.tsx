"use client"

import { useEffect, useRef } from "react"

interface NeuralLoaderProps {
    size?: number
    label?: string
}

export function NeuralLoader({ size = 48, label }: NeuralLoaderProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const dpr = window.devicePixelRatio || 1
        canvas.width = size * dpr
        canvas.height = size * dpr
        ctx.scale(dpr, dpr)

        const cx = size / 2
        const cy = size / 2
        const r = size * 0.36

        // 3 layers: 2 → 3 → 2
        const positions = [
            { x: cx - r, y: cy - r * 0.5 },
            { x: cx - r, y: cy + r * 0.5 },

            { x: cx, y: cy - r },
            { x: cx, y: cy },
            { x: cx, y: cy + r },

            { x: cx + r, y: cy - r * 0.5 },
            { x: cx + r, y: cy + r * 0.5 },
        ]

        // Directed edges: L1→L2, L2→L3
        const edges = [
            [0, 2], [0, 3], [0, 4],
            [1, 2], [1, 3], [1, 4],
            [2, 5], [2, 6],
            [3, 5], [3, 6],
            [4, 5], [4, 6],
        ]

        type Pulse = { edgeIdx: number; t: number; speed: number }
        const pulses: Pulse[] = []
        let animId: number
        let frame = 0

        const draw = () => {
            ctx.clearRect(0, 0, size, size)

            // Static edges
            edges.forEach(([a, b]) => {
                const na = positions[a], nb = positions[b]
                ctx.beginPath()
                ctx.moveTo(na.x, na.y)
                ctx.lineTo(nb.x, nb.y)
                ctx.strokeStyle = "rgba(255,255,255,0.08)"
                ctx.lineWidth = 0.6
                ctx.stroke()
            })

            // Nodes with gentle breathing glow
            positions.forEach((p, i) => {
                const g = 0.25 + 0.15 * Math.sin(frame * 0.07 + i * 0.9)
                ctx.beginPath()
                ctx.arc(p.x, p.y, size * 0.038, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(255,255,255,${g})`
                ctx.fill()
            })

            // Pulses — fast, with trails
            pulses.forEach(pu => {
                pu.t += pu.speed
                const [a, b] = edges[pu.edgeIdx]
                const na = positions[a], nb = positions[b]
                const x = na.x + (nb.x - na.x) * pu.t
                const y = na.y + (nb.y - na.y) * pu.t
                const fade = 1 - Math.pow(pu.t * 2 - 1, 4)

                // Trail
                const trailT = Math.max(0, pu.t - 0.2)
                const tx = na.x + (nb.x - na.x) * trailT
                const ty = na.y + (nb.y - na.y) * trailT
                const tg = ctx.createLinearGradient(tx, ty, x, y)
                tg.addColorStop(0, "rgba(255,255,255,0)")
                tg.addColorStop(1, `rgba(255,255,255,${fade * 0.5})`)
                ctx.beginPath()
                ctx.moveTo(tx, ty)
                ctx.lineTo(x, y)
                ctx.strokeStyle = tg
                ctx.lineWidth = 0.8
                ctx.stroke()

                // Dot
                ctx.beginPath()
                ctx.arc(x, y, size * 0.032, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(255,255,255,${fade * 0.95})`
                ctx.fill()
            })

            // Remove done pulses
            for (let i = pulses.length - 1; i >= 0; i--) {
                if (pulses[i].t >= 1) pulses.splice(i, 1)
            }

            // Spawn every ~8 frames — fast cascade
            if (frame % 8 === 0 && pulses.length < 10) {
                pulses.push({
                    edgeIdx: Math.floor(Math.random() * edges.length),
                    t: 0,
                    speed: 0.045 + Math.random() * 0.03, // very fast
                })
            }

            // Wave burst — spawn one per layer every 40 frames
            if (frame % 40 === 0) {
                [[0, 1, 2, 3, 4, 5], [6, 7, 8, 9], [10, 11]].forEach(group => {
                    const idx = group[Math.floor(Math.random() * group.length)]
                    if (idx < edges.length) {
                        pulses.push({ edgeIdx: idx, t: 0, speed: 0.04 + Math.random() * 0.03 })
                    }
                })
            }

            frame++
            animId = requestAnimationFrame(draw)
        }

        draw()
        return () => cancelAnimationFrame(animId)
    }, [size])

    return (
        <div className="flex flex-col items-center gap-3">
            <canvas ref={canvasRef} style={{ width: size, height: size }} />
            {label && (
                <p className="text-[10px] text-white/30 uppercase tracking-[0.2em]">
                    {label}
                </p>
            )}
        </div>
    )
}
