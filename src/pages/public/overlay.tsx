import Confetti from 'react-confetti'
import { useEffect, useState } from 'react'
import { Transition } from '@headlessui/react'
import TopRotator from '../../components/overlay/TopRotator'
import ProgressBar from '../../components/overlay/ProgressBar'
import TimeLeft from '../../components/overlay/TimeLeft'
import WheelSpins from '../../components/overlay/WheelSpins'

const Overlay = () => {
  const [confetti, setConfetti] = useState(false)
  const [timesUp, setTimesUp] = useState(false)
  const [panel, setPanel] = useState('timeLeft')

  // Display time left for 5 seconds, then switch to wheel spins for 10 seconds, then repeat
  useEffect(() => {
    const timer = setTimeout(
      () => {
        if (panel === 'timeLeft') {
          setPanel('wheelSpins')
        } else {
          setPanel('timeLeft')
        }
      },
      panel === 'wheelSpins' ? 5000 : 10000
    )
    return () => clearTimeout(timer)
  }, [panel])

  // Once times up turns to true, set confetti to true
  // After 1 minute, set confetti to false
  useEffect(() => {
    if (timesUp) {
      setConfetti(true)
      setTimeout(() => {
        setConfetti(false)
      }, 30000)
    }
  }, [timesUp])

  return (
    <div style={{ width: 1920, height: 1080 }} className='relative bg-green-500'>
      <Transition
        show={confetti}
        enter='transition-opacity duration-75'
        enterFrom='opacity-0'
        enterTo='opacity-100'
        leave='transition-opacity duration-1000'
        leaveFrom='opacity-100'
        leaveTo='opacity-0'>
        <Confetti
          width={1920}
          height={1080}
          colors={['#5D41DE', '#0E0E10', '#1D4C6C', '#47C2E2', '#6B4BFF', '#5D41DE']}
        />
      </Transition>
      <div className='absolute top-12 left-0 right-0 w-full flex justify-center'>
        <TopRotator />
      </div>
      <div className='absolute bottom-12 left-0 right-0 w-full flex justify-center'>
        <ProgressBar />
      </div>
      <div className='absolute bottom-14 right-12'>
        <div className='bg-purple-bar-1 w-72 rounded-xl py-4 px-6 shadow-super relative'>
          <TimeLeft visible={panel === 'timeLeft'} timesUp={value => setTimesUp(value)} />
          <WheelSpins visible={panel === 'wheelSpins'} />
        </div>
      </div>
    </div>
  )
}
export default Overlay
