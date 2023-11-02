'use client'

import type { Rotator } from '@prisma/client'

import { useQuery } from 'react-query'
import { useEffect, useState } from 'react'
import TextTransition, { presets } from 'react-text-transition'

export function LeftText() {
  const [rotating, setRotating] = useState(false)
  const [index, setIndex] = useState(0)
  const { data } = useQuery(['rotators'], () => fetch('/api/rotator').then(res => res.json()) as Promise<Rotator[]>, {
    refetchInterval: 10000
  })
  const length = data?.length ?? 0
  const visibleIndex = index % length

  useEffect(() => {
    if (data) setRotating(true)

    const interval = setInterval(() => setIndex(index => index + 1), 7000)
    return () => clearInterval(interval)
  }, [data])

  return (
    <div>
      {rotating ? (
        <TextTransition springConfig={presets.gentle} className='text-white font-bold text-2xl truncate'>
          {data && data[visibleIndex]?.text}
        </TextTransition>
      ) : (
        <p className='text-white font-bold text-2xl truncate'>Change Kids Health. Change the Future.</p>
      )}
    </div>
  )
}
