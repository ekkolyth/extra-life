'use client'

import { useConvexQuery } from '@convex-dev/react-query'
import { useEffect, useRef, useState } from 'react'
import { api } from '@/convex/_generated/api'
import styles from '../overlay.module.css'

// a spin older than this is history, so reloading the overlay doesn't replay it
const FRESH_SPIN_MS = 15000

export function Randomizer() {
    const [visible, setVisible] = useState(false)
    const [spinning, setSpinning] = useState(false)
    const [choiceIndex, setChoiceIndex] = useState(0)
    const [choices, setChoices] = useState<string[]>([])
    const [confetti, setConfetti] = useState(false)
    const playedSpinId = useRef<string | null>(null)
    // owned by the spin, not the effect, so a re-render with the same spin can't cut it short
    const timers = useRef<ReturnType<typeof setTimeout>[]>([])

    const spin = useConvexQuery(api.randomizerSpin.latest, {})

    useEffect(() => {
        return () => {
            for (const timer of timers.current) clearTimeout(timer)
        }
    }, [])

    useEffect(() => {
        if (!spin || playedSpinId.current === spin._id) return
        playedSpinId.current = spin._id
        if (Date.now() - spin._creationTime > FRESH_SPIN_MS) return

        for (const timer of timers.current) clearTimeout(timer)

        setChoices(spin.items)
        setChoiceIndex(0)
        setVisible(true)
        setSpinning(true)

        const cycle = setInterval(() => {
            setChoiceIndex((index) => index + 1)
        }, 100)
        timers.current = [
            cycle,
            setTimeout(() => {
                clearInterval(cycle)
                setChoiceIndex(spin.items.indexOf(spin.result))
                setConfetti(true)
            }, 3000),
            setTimeout(() => setSpinning(false), 4000),
            setTimeout(() => setConfetti(false), 8000),
            setTimeout(() => setVisible(false), 9000),
        ]
    }, [spin])

    if (!visible) return null

    return (
        <div className='flex items-center justify-center h-screen'>
            <div className='relative bg-gray-900 rounded-lg shadow overflow-hidden p-12 w-full max-w-4xl'>
                {confetti && <div className={styles.confettiLayer} />}
                <p
                    className={
                        spinning
                            ? 'relative z-51 text-4xl font-bold animate-pulse'
                            : 'relative z-51 text-4xl font-bold'
                    }
                >
                    {choices[choiceIndex % choices.length]}
                </p>
            </div>
        </div>
    )
}
