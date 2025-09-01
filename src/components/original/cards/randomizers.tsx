'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Randomizer, RandomizerItem } from '@/types/db';
import { FerrisWheelIcon } from 'lucide-react';

import ContentCard from './card';
import { Button } from '@/components/ui/button';
import { fetchWheelSpinDonations } from '@/utils/donor-drive';

interface RandomizerWithItems extends Randomizer {
  items: RandomizerItem[];
}

interface RandomizerCardProps {
  randomizers: RandomizerWithItems[];
}

export function RandomizerCard(props: RandomizerCardProps) {
  const { randomizers } = props;

  const [left, setLeft] = useState(0);
  const [total, setTotal] = useState(0);
  const [channel, setChannel] = useState<any>(null);

  useEffect(() => {
    if (!randomizers || randomizers.length === 0) return;

    const fetchData = async () => {
      try {
        const data = await fetchWheelSpinDonations(String(process.env.NEXT_PUBLIC_DONORDRIVE_ID));
        if (typeof data !== 'string') {
          setTotal(data.length);
        }
      } catch (error) {
        console.error('Failed to fetch wheel spin donations:', error);
      }
    };

    const fetchRedemptions = async () => {
      try {
        const res = await fetch(`/api/randomizers/cloglmz700000lc08agvmot1/redemptions`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setLeft(total - data.length);
      } catch (error) {
        console.error('Failed to fetch redemptions:', error);
      }
    };

    if (process.env.NEXT_PUBLIC_DONORDRIVE_ID) {
      fetchData();
      fetchRedemptions();

      const dataInterval = setInterval(fetchData, 5000);
      const redemptionsInterval = setInterval(fetchRedemptions, 5000);

      return () => {
        clearInterval(dataInterval);
        clearInterval(redemptionsInterval);
      };
    }
  }, [total, randomizers]);

  if (!randomizers || randomizers.length === 0) {
    return (
      <ContentCard title='Randomizers' icon={<FerrisWheelIcon />}>
        <div className='text-center text-muted-foreground py-4'>
          <p>No randomizers found</p>
          <p className='text-sm'>Add some randomizers to get started</p>
        </div>
      </ContentCard>
    );
  }

  function handleWheelSpin(id: string) {
    // Get options for the given wheel
    const items = randomizers.find((randomizer) => randomizer.id === id)?.items;

    // Pick one at random that has available redemptions
    const availableItems = items?.filter((item) => item.redeemed < item.limit);
    const winner = availableItems?.[Math.floor(Math.random() * availableItems.length)];

    if (!winner) {
      console.error('No winner found');
      return;
    }

    // Redeem the item on the backend
    fetch(`/api/randomizers/items`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: winner.id,
      }),
    });

    // Publish the winner
    channel?.publish({
      name: 'wheel-spin',
      data: {
        id,
        answer: winner,
        randomizer: randomizers.find((randomizer) => randomizer.id === id),
      },
    });
  }

  return (
    <ContentCard title='Randomizers' icon={<FerrisWheelIcon />}>
      <p className='text-destructive font-bold text-xs -mt-6 mb-4'>
        Do not close this page once a randomizer is triggered, until it is finished spinning.
      </p>
      <div className='flex flex-col items-start'>
        <h3>Spins</h3>
        <div className='grid grid-cols-3 items-center justify-center'>
          <p className='font-bold text-4xl text-white'>{left}</p>
          <p className='px-2 text-xl'>/</p>
          <p className='font-bold text-4xl text-white'>{total}</p>
          <p className='text-xs text-muted-foreground'>Left</p>
          <p></p>
          <p className='text-xs text-muted-foreground'>Total</p>
        </div>
      </div>
      <ul>
        {randomizers.length > 0 ? (
          randomizers.map((randomizer) => (
            <li key={randomizer.id} className='flex justify-between items-center'>
              <p>{randomizer.name}</p>
              {channel && (
                <Button
                  // disabled={left === 0}
                  variant='link'
                  onClick={() => {
                    handleWheelSpin(randomizer.id);
                    // channel.publish({
                    //   name: 'randomizer-start',
                    //   data: randomizer.id
                    // })
                  }}
                >
                  Trigger
                </Button>
              )}
            </li>
          ))
        ) : (
          <li className='flex justify-between items-center'>
            <p>No randomizers found</p>
            <Button variant='link' asChild>
              <Link href='/dashboard/randomizer'>Add one</Link>
            </Button>
          </li>
        )}
      </ul>
    </ContentCard>
  );
}
