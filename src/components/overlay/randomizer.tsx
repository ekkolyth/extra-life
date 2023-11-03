'use client'

import type { NestedRandomizer } from '@/types'

import * as Ably from 'ably'
import { Transition } from '@headlessui/react'

import { useChannel } from 'ably/react'
import { useState } from 'react'
import { useQuery } from 'react-query'
import TextTransition, { presets } from 'react-text-transition'

interface RandomizerProps {
  setConfetti: (confetti: boolean) => void
}

export function Randomizer(props: RandomizerProps) {
  const { setConfetti } = props

  // Randomizer State
  const [visible, setVisible] = useState(false)
  const [spinning, setSpinning] = useState(false)
  const [choiceIndex, setChoiceIndex] = useState(0)
  const [choices, setChoices] = useState<string[]>([])
  const [randomizers, setRandomizers] = useState<NestedRandomizer[]>([])

  useQuery(['randomizers'], () => fetch('/api/randomizers').then(res => res.json()), {
    refetchInterval: 30000,
    onSuccess(data) {
      setRandomizers(data)
    }
  })

  const { channel } = useChannel('randomizers', (message: Ably.Types.Message) => {
    function spinTheWheel(randomizer: NestedRandomizer) {
      if (!channel) {
        console.error('No channel is available to spin the wheel.')
        return
      }

      // Determine the answer and let the channel know
      const random = Math.floor(Math.random() * randomizer.items.length)
      channel.publish({
        name: 'randomizer-end',
        data: {
          id: randomizer.id,
          name: randomizer.name,
          answer: {
            id: randomizer.items[random].id,
            name: randomizer.items[random].name
          }
        }
      })

      setSpinning(true)
      setChoices(randomizer.items.map(item => item.name))

      const interval = setInterval(() => {
        setChoiceIndex(choiceIndex => choiceIndex + 1)
      }, 100)

      // After 3 seconds, make the choice visible and run confetti
      setTimeout(() => {
        clearInterval(interval)
        setConfetti(true)
        setChoiceIndex(random)
      }, 3000)

      // After 4 seconds, stop spinning
      setTimeout(() => {
        setSpinning(false)
      }, 4000)

      // After 8 seconds, hide the confetti
      setTimeout(() => {
        setConfetti(false)
      }, 8000)

      // After 9 seconds, hide the randomizer and clear the state
      setTimeout(() => {
        setVisible(false)
      }, 9000)

      // After 10 seconds, clear the state
      setTimeout(() => {
        setSpinning(false)
        setChoiceIndex(0)
        setChoices([])
      }, 10000)
    }
    switch (message.name) {
      case 'randomizer-start':
        const randomizer = randomizers.find(randomizer => randomizer.id === message.data)
        if (randomizer) {
          setVisible(true)
          setTimeout(() => {
            spinTheWheel(randomizer)
          }, 1000)
        }
        break
      default:
        console.log('Unknown message type:', message)
        break
    }
  })

  return (
    <Transition
      show={visible}
      enter='transition-opacity duration-75'
      enterFrom='opacity-0'
      enterTo='opacity-100'
      leave='transition-opacity duration-1000'
      leaveFrom='opacity-100'
      leaveTo='opacity-0'>
      <div className='flex items-center justify-center h-screen'>
        <div className='bg-gray-900 rounded-lg shadow overflow-hidden p-12 w-full max-w-4xl'>
          {spinning ? (
            <TextTransition springConfig={presets.wobbly}>
              <p className='text-4xl font-bold'>{choices[choiceIndex % choices.length]}</p>
            </TextTransition>
          ) : (
            <p className='text-4xl font-bold'>{choices[choiceIndex % choices.length] ?? 'Loading...'}</p>
          )}
        </div>
      </div>
    </Transition>
  )
}
