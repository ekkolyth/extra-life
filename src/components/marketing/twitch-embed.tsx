"use client"

import { useEffect, useState } from 'react'

export function TwitchEmbed() {
  const [playerSrc, setPlayerSrc] = useState<string | null>(null)

  useEffect(() => {
    const parentHost = window.location.hostname
    const src = `https://player.twitch.tv/?channel=ekkolyth&parent=${parentHost}&muted=true`
    setPlayerSrc(src)
  }, [])

  if (!playerSrc) return null

  return (
    <div className='relative aspect-video w-full overflow-hidden rounded-lg'>
      <iframe
        src={playerSrc}
        allow='autoplay; fullscreen; picture-in-picture'
        allowFullScreen
        scrolling='no'
        frameBorder='0'
        className='absolute inset-0 h-full w-full'
      />
    </div>
  )
}

