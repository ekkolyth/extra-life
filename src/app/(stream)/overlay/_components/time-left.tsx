'use client';

// Display the current countdown to November 13 at 10am in hours, minutes, and seconds
// Bonus fun when we reach zero
import { useEffect, useState } from 'react';

const eventDateEnd = new Date('November 8, 2025 22:00:00');

const TimeLeft = ({
  visible,
  timesUp,
}: {
  visible: boolean;
  timesUp: (value: boolean) => void;
}) => {
  const [hoursLeft, setHoursLeft] = useState('00');
  const [minutesLeft, setMinutesLeft] = useState('00');
  const [secondsLeft, setSecondsLeft] = useState('00');

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const timeDifference = eventDateEnd.getTime() - now.getTime();

      const hours = Math.floor(timeDifference / (1000 * 60 * 60));
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

      setHoursLeft(String(hours).padStart(2, '0'));
      setMinutesLeft(String(minutes).padStart(2, '0'));
      setSecondsLeft(String(seconds).padStart(2, '0'));

      if (timeDifference <= 0) {
        timesUp(true);
      }
    };

    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={visible ? '' : 'hidden'}>
      <p className='font-bold text-3xl text-white mb-2'>time left</p>
      <div className='font-bold text-4xl text-white flex gap-x-3'>
        <span className='flex'>{hoursLeft}h</span>
        <span className='flex'>{minutesLeft}m</span>
        <span>{secondsLeft}s</span>
      </div>
    </div>
  );
};

export default TimeLeft;
