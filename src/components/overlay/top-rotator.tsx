'use client';

import type { Goal } from '@/types/db';

import { LeftText } from './left-text';
import { RightText } from './right-text';

interface TopRotatorProps {
  goals: Goal[];
}

const TopRotator = (props: TopRotatorProps) => {
  const { goals } = props;

  return (
    <div
      style={{ width: 1200, height: 78 }}
      className='bg-primary rounded-full relative shadow-super'
    >
      <div className='ml-44 h-full flex items-center py-1 pl-6 pr-10'>
        <LeftText />
        <RightText goals={goals} />
      </div>
    </div>
  );
};

export default TopRotator;
