import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Shuffle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Randomizer } from '@/types/db';
import Link from 'next/link';

interface RandomizersSectionProps {
  randomizers: Randomizer[];
}

export function RandomizersSection({
  randomizers,
}: RandomizersSectionProps) {
  const totalItems = randomizers.reduce(
    (acc, randomizer) => acc + (randomizer.items?.length || 0),
    0
  );

  const redeemedItems = randomizers.reduce(
    (acc, randomizer) =>
      acc +
      (randomizer.items?.reduce(
        (itemAcc, item) => itemAcc + item.redeemed,
        0
      ) || 0),
    0
  );

  const leftItems = totalItems - redeemedItems;

  if (!randomizers || randomizers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Shuffle className='h-5 w-5 text-primary' />
            Randomizers
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='rounded-lg bg-muted/30 p-4'>
            <p className='text-xs text-muted-foreground mb-3'>
              Do not close this page once a randomizer is triggered, until
              it is finished spinning.
            </p>

            <div className='text-center space-y-2'>
              <div className='text-3xl font-bold text-foreground'>
                <span>0</span>
                <span className='text-muted-foreground mx-2'>/</span>
                <span>0</span>
              </div>
              <div className='flex justify-center gap-4 text-xs text-muted-foreground'>
                <span>Left</span>
                <span>Total</span>
              </div>
            </div>

            <p className='text-sm text-muted-foreground text-center mt-3'>
              No randomizers found
            </p>
          </div>

          <Button
            variant='outline'
            className='w-full bg-transparent'
            size='sm'
            asChild
          >
            <Link href='/randomizer'>
              <Plus className='h-4 w-4 mr-2' />
              Add one
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Shuffle className='h-5 w-5 text-primary' />
          Randomizers
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='rounded-lg bg-muted/30 p-4'>
          <p className='text-xs text-muted-foreground mb-3'>
            Do not close this page once a randomizer is triggered, until it
            is finished spinning.
          </p>

          <div className='text-center space-y-2'>
            <div className='text-3xl font-bold text-foreground'>
              <span>{leftItems}</span>
              <span className='text-muted-foreground mx-2'>/</span>
              <span>{totalItems}</span>
            </div>
            <div className='flex justify-center gap-4 text-xs text-muted-foreground'>
              <span>Left</span>
              <span>Total</span>
            </div>
          </div>

          <div className='mt-4 space-y-2'>
            {randomizers.map((randomizer) => (
              <div
                key={randomizer.id}
                className='flex justify-between items-center text-sm'
              >
                <span className='text-foreground'>{randomizer.name}</span>
                <span className='text-muted-foreground'>
                  {randomizer.items?.length || 0} items
                </span>
              </div>
            ))}
          </div>
        </div>

        <Button
          variant='outline'
          className='w-full bg-transparent'
          size='sm'
          asChild
        >
          <Link href='/randomizer'>
            <Plus className='h-4 w-4 mr-2' />
            Manage Randomizers
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
