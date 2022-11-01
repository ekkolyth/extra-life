import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import TextTransition, { presets } from 'react-text-transition'
import ELControllerDice from '../../assets/img/EL_controllerdice.png'
import Hashtags from '../../data/hashtags.json'
import Goals from '../../data/goals.json'
import { fetchTopDonation, fetchStats } from '../../utils/donorDrive'
import { trpc } from '../../utils/trpc'

const TopRotator = () => {
  const rotationInterval = 7000
  const { data: stats } = useQuery(['extralife', 'donors'], () => fetchStats('478888'), {
    refetchInterval: rotationInterval
  })
  const { data: topDonation } = useQuery(['extralife', 'topDonation'], () => fetchTopDonation('478888'))
  const schedule = trpc.useQuery(['schedule.get'], {
    refetchInterval: rotationInterval
  })
  const [bonusTextIndex, setBonusTextIndex] = useState<number>(0)
  const [hashtagIndex, setHashtagIndex] = useState<number>(0)
  const nextGoal = Goals.find(goal => goal.value > stats?.sumDonations * 100)

  const bonusText: { label: string; text: string }[] = [
    {
      label: 'right now',
      text: schedule?.data?.now ?? 'loading...'
    },
    {
      label: 'up next',
      text: schedule?.data?.next ?? 'loading...'
    },
    {
      label: 'top donation',
      text: `${topDonation?.displayName ?? 'Your Mom'} - $${topDonation?.amount ?? '69'}`
    },
    {
      label: 'next goal unlock',
      text: `${nextGoal?.name}${nextGoal?.note ? ` - ${nextGoal.note}` : ''}` ?? 'complete!'
    }
  ]

  const [mainText, setMainText] = useState(<p>{Hashtags[0]}</p>)
  const [secondaryLabel, setSecondaryLabel] = useState(bonusText[0]?.label)
  const [secondaryText, setSecondaryText] = useState(bonusText[0]?.text)

  // Rotate through the hashtags array as the main text every second
  // After the hashtags, display a string, then start over
  const rotateHashtags = () => {
    setMainText(<p>{Hashtags[hashtagIndex]}</p>)
    setHashtagIndex(prevIndex => (prevIndex + 1) % Hashtags.length)
  }
  const rotateBonusText = () => {
    setSecondaryLabel(bonusText[bonusTextIndex]?.label ?? 'nothing')
    setSecondaryText(bonusText[bonusTextIndex]?.text ?? 'nothing')
    setBonusTextIndex(prevIndex => (prevIndex + 1) % bonusText.length)
  }

  // Rotate the hashtags every 10 seconds
  useEffect(() => {
    const bonusText = setInterval(rotateBonusText, rotationInterval)
    const hashtags = setInterval(rotateHashtags, rotationInterval)
    return () => {
      clearInterval(bonusText)
      clearInterval(hashtags)
    }
  }, [hashtagIndex, bonusTextIndex])

  return (
    <div style={{ width: 1200, height: 78 }} className='bg-purple-bar-1 rounded-full relative shadow-super'>
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
