import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import TextTransition, { presets } from 'react-text-transition'
import ELControllerDice from '../../assets/img/EL_controllerdice.png'
import Hashtags from '../../data/hashtags.json'
import { fetchTopDonation } from '../../utils/donorDrive'
import { trpc } from '../../utils/trpc'

const TopRotator = () => {
  const { data } = useQuery(['extralife', 'topDonation'], () => fetchTopDonation('478888'))
  const schedule = trpc.useQuery(['schedule.get'], {
    refetchInterval: 5000
  })
  const [bonusTextIndex, setBonusTextIndex] = useState(0)
  const [hashtagIndex, setHashtagIndex] = useState(0)
  const [mainText, setMainText] = useState(<p>{Hashtags[0]}</p>)
  const [secondaryLabel, setSecondaryLabel] = useState('fuck')
  const [secondaryText, setSecondaryText] = useState('penn state')

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

  const rotateBonusText = () => {
    switch (bonusTextIndex) {
      case 0:
        console.log(data)
        setSecondaryLabel('top donation')
        setSecondaryText(`${data?.displayName ?? 'Your'} - $${data?.amount ?? 'Mom'}`)
        setBonusTextIndex(1)
        break
      case 1:
        setSecondaryLabel('next goal unlock')
        setSecondaryText('reading rainbow - $1000')
        setBonusTextIndex(2)
        break
      case 2:
        setSecondaryLabel('right now')
        setSecondaryText(schedule?.data?.now ?? 'nothing')
        setBonusTextIndex(3)
        break
      case 3:
        setSecondaryLabel('up next')
        setSecondaryText(schedule?.data?.next ?? 'nothing')
        setBonusTextIndex(0)
        break
      default:
        setSecondaryLabel('')
        setSecondaryText('')
        setBonusTextIndex(0)
    }
  }

  // Rotate the hashtags every 10 seconds
  useEffect(() => {
    const bonusText = setInterval(rotateBonusText, 10000)
    const hashtags = setInterval(rotateHashtags, 10000)
    return () => {
      clearInterval(bonusText)
      clearInterval(hashtags)
    }
  })

  return (
    <div style={{ width: 1200 }} className='bg-purple-bar-1 rounded-full relative shadow-super'>
      <img src={ELControllerDice.src} className='absolute -bottom-2 left-2 h-28 w-auto' />
      <div className='ml-44 flex items-center py-1 pl-6 pr-10'>
        <TextTransition springConfig={presets.stiff} className='text-white font-bold text-2xl truncate'>
          {mainText}
        </TextTransition>
        <div className='flex-grow flex justify-end py-1'>
          <div className='text-right'>
            <p className='text-2xl font-bold text-white -mb-1'>
              <span className='border-b border-white'>{secondaryLabel}</span>
            </p>
            <p className='text-2xl font-bold text-white truncate'>{secondaryText}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopRotator
