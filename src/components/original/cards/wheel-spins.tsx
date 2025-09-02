'use client';

import { EllipsisHorizontalIcon, GiftIcon } from '@heroicons/react/24/outline';
import { Fragment, useState, useEffect } from 'react';
import ContentCard from './card';
import { fetchWheelSpinDonations } from '@/utils/donor-drive';
import { Menu, Transition } from '@headlessui/react';
import { cn } from '@/utils/style';

const WheelSpins = () => {
  // Any donation over 20.22 and under 99.99 counts as 1 spin
  const [left] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
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

    if (process.env.NEXT_PUBLIC_DONORDRIVE_ID) {
      fetchData();
      const interval = setInterval(fetchData, 5000);
      return () => clearInterval(interval);
    }
  }, []);

  const spinWheel = async () => {
    // if (left > 0) {
    //   const spins = await spin.mutateAsync()
    //   if (spins) {
    //     setLeft(total - spins)
    //     toast.success('Wheel spun!')
    //   }
    // } else {
    //   toast.error('No spins left to fulfill!')
    // }
  };
  const undoWheelSpin = async () => {
    // toast.promise(pop.mutateAsync(), {
    //   pending: 'Undoing spin...',
    //   success: 'Spin undone!',
    //   error: 'Error undoing spin'
    // })
  };

  return (
    <ContentCard title='Wheel Spins' icon={<GiftIcon />}>
      <div className='absolute top-6 right-5'>
        <Menu as='div' className='relative inline-block text-left'>
          <div>
            <Menu.Button className='inline-flex w-full justify-center rounded-full border bg-white p-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-el-dark-blue focus:ring-offset-2 focus:ring-offset-gray-100'>
              <EllipsisHorizontalIcon className='w-5 h-5' />
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter='transition ease-out duration-100'
            enterFrom='transform opacity-0 scale-95'
            enterTo='transform opacity-100 scale-100'
            leave='transition ease-in duration-75'
            leaveFrom='transform opacity-100 scale-100'
            leaveTo='transform opacity-0 scale-95'
          >
            <Menu.Items className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
              <div className='py-1'>
                <Menu.Item>
                  {({ active }: { active: boolean }) => (
                    <button
                      onClick={() => undoWheelSpin()}
                      className={cn(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block w-full px-4 py-2 text-sm'
                      )}
                    >
                      Undo Last Spin
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }: { active: boolean }) => (
                    <button
                      onClick={() => spinWheel()}
                      className={cn(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block w-full px-4 py-2 text-sm'
                      )}
                    >
                      Fulfill Spin
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
      <div className='grid grid-cols-2 gap-2 mt-8'>
        <div className='flex flex-col items-center'>
          <p className='bg-blue-100 text-5xl font-semibold text-el-dark-blue px-12 py-8 mb-1 rounded-lg'>
            {left}
          </p>
          <p className='uppercase text-el-dark-blue font-semibold'>Left</p>
        </div>
        <div className='flex flex-col items-center'>
          <p className='bg-blue-100 text-5xl font-semibold text-el-dark-blue px-12 py-8 mb-1 rounded-lg'>
            {total}
          </p>
          <p className='uppercase text-el-dark-blue font-semibold'>Total</p>
        </div>
      </div>
    </ContentCard>
  );
};

export default WheelSpins;
