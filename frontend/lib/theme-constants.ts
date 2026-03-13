import {
    Brain,
    Cpu,
    Network,
    Database,
    Sparkles,
    Terminal,
    Workflow,
    Settings,
    Activity,
    Layers,
    Binoculars,
    Search,
    Zap,
    Bot
} from "lucide-react"

/**
 * Design system tokens for MLForge
 * Using a professional "AI-centric" color palette
 */
export const THEME_CONFIG = {
    fonts: {
        sans: "var(--font-outfit)",
        mono: "var(--font-geist-mono)",
        display: "var(--font-outfit)",
    },
    colors: {
        brand: {
            primary: "oklch(0.6 0.18 260)", // Neural Blue/Indigo
            secondary: "oklch(0.7 0.2 300)", // AI Violet
            accent: "oklch(0.85 0.15 190)", // Cyber Cyan
        },
        status: {
            training: "oklch(0.7 0.2 40)", // Amber/Orange
            ready: "oklch(0.65 0.2 150)", // Success Green
            error: "oklch(0.6 0.2 20)", // Critical Red
        }
    },
    icons: {
        ai: Brain,
        compute: Cpu,
        graph: Network,
        storage: Database,
        magic: Sparkles,
        code: Terminal,
        pipeline: Workflow,
        config: Settings,
        monitor: Activity,
        layers: Layers,
        inspect: Binoculars,
        discover: Search,
        fast: Zap,
        assistant: Bot
    }
} as const;

export type ThemeConfig = typeof THEME_CONFIG;
