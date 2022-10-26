import { useEffect, useState } from 'react'
import TextTransition, { presets } from 'react-text-transition'
import ELControllerDice from '../../assets/img/EL_controllerdice.png'
import Hashtags from '../../data/hashtags.json'

const TopRotator = () => {
  const [mainText, setMainText] = useState(<p>{Hashtags[0]}</p>)
  const [hashtagIndex, setHashtagIndex] = useState(0)

  // Rotate through the hashtags array as the main text every second
  // After the hashtags, display a string, then start over
  const rotateHashtags = () => {
    if (hashtagIndex < Hashtags.length) {
      setMainText(<p>{Hashtags[hashtagIndex]}</p>)
      setHashtagIndex(hashtagIndex + 1)
    } else {
      setMainText(<p>Change Kids Health. Change the Future.</p>)
      setHashtagIndex(0)
    }
  }

  // Rotate the hashtags every 10 seconds
  useEffect(() => {
    const interval = setInterval(rotateHashtags, 10000)
    return () => clearInterval(interval)
  })

  return (
    <div style={{ width: 977 }} className='bg-purple-bar-1 rounded-full relative shadow-super'>
      <img src={ELControllerDice.src} className='absolute -bottom-2 left-2 h-28 w-auto' />
      <div className='ml-44 flex items-center py-1 pl-6 pr-10'>
        <TextTransition springConfig={presets.stiff} className='text-white font-bold text-2xl'>
          {mainText}
        </TextTransition>
        <div className='flex-grow flex justify-end py-3'>
          <div className='text-right'>
            <p className='text-xl font-bold text-white -mb-1'>
              <span className='border-b border-white'>up next</span>
            </p>
            <p className='text-xl font-bold text-white'>cards against humanity</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopRotator
