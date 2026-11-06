'use client'

import { useConvexQuery } from '@convex-dev/react-query'
import { useEffect, useRef, useState } from 'react'
import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'
import styles from '../overlay.module.css'

// a spin older than this is history, so reloading the overlay doesn't replay it
const FRESH_SPIN_MS = 15000

export function Randomizer() {
    const [visible, setVisible] = useState(false)
    const [spinning, setSpinning] = useState(false)
    const [choiceIndex, setChoiceIndex] = useState(0)
    const [choices, setChoices] = useState<string[]>([])
    const [secondChoices, setSecondChoices] = useState<string[] | null>(null)
    const [secondChoiceIndex, setSecondChoiceIndex] = useState(0)
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
        setSecondChoices(spin.second?.items ?? null)
        setSecondChoiceIndex(0)
        setVisible(true)
        setSpinning(true)

        const cycle = setInterval(() => {
            setChoiceIndex((index) => index + 1)
            setSecondChoiceIndex((index) => index + 1)
        }, 100)
        timers.current = [
            cycle,
            setTimeout(() => {
                clearInterval(cycle)
                setChoiceIndex(spin.items.indexOf(spin.result))
                setSecondChoiceIndex(
                    spin.second
                        ? spin.second.items.indexOf(spin.second.result)
                        : 0
                )
                setSpinning(false)
                setConfetti(true)
            }, 3000),
            // close the whole panel at once so nothing lingers after the confetti
            setTimeout(() => {
                setConfetti(false)
                setVisible(false)
            }, 6000),
        ]
    }, [spin])

    if (!visible) return null

    const pickClass = spinning
        ? 'relative z-51 text-4xl font-bold animate-pulse'
        : 'relative z-51 text-4xl font-bold'

    return (
        <div className='flex items-center justify-center h-screen'>
            <div className='relative bg-gray-900 rounded-lg shadow overflow-hidden p-12 w-full max-w-4xl'>
                {confetti && <div className={styles.confettiLayer} />}
                {secondChoices ? (
                    <div className='grid grid-cols-2 divide-x divide-white/10'>
                        <p className={cn(pickClass, 'pr-12')}>
                            {choices[choiceIndex % choices.length]}
                        </p>
                        <p className={cn(pickClass, 'pl-12')}>
                            {
                                secondChoices[
                                    secondChoiceIndex % secondChoices.length
                                ]
                            }
                        </p>
                    </div>
                ) : (
                    <p className={pickClass}>
                        {choices[choiceIndex % choices.length]}
                    </p>
                )}
            </div>
        </div>
    )
}
