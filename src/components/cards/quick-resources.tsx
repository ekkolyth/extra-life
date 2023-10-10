'use client'

import { ClipboardIcon } from '@heroicons/react/24/outline'
import { BookmarkIcon } from '@heroicons/react/24/solid'
import { toast } from 'react-toastify'
import Card from './card'

import resources from '../../data/resources.json'
import { Button } from '../ui/button'
import Link from 'next/link'

export const QuickResources = () => {
  return (
    <Card title='Quick Resources' icon={<BookmarkIcon />}>
      <ol className='divide-y'>
        {resources.map(r => (
          <li key={r.name} className='flex justify-between py-2'>
            <div>
              <Link href={r.url} target='_blank' rel='noreferrer' className='font-semibold'>
                {r.name}
              </Link>
              <p className='text-xs text-primary'>{r.subtitle}</p>
            </div>
            <Button
              size='icon'
              onClick={() => {
                if (r.url.length > 0) {
                  navigator.clipboard.writeText(r.url)
                  toast.success(`Copied ${r.name} to clipboard!`)
                } else {
                  toast.error(`No URL found for ${r.name}`)
                }
              }}>
              <span className='sr-only'>Copy link</span>
              <ClipboardIcon className='h-4 w-4' aria-hidden='true' />
            </Button>
          </li>
        ))}
      </ol>
    </Card>
  )
}
