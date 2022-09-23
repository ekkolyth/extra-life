import { ClipboardIcon } from '@heroicons/react/24/outline'
import { BookmarkIcon } from '@heroicons/react/24/solid'
import Card from '../layout/Card'

import resources from '../../data/resources.json'

const QuickResources = () => {
  return (
    <Card title='Quick Resources' icon={<BookmarkIcon />}>
      <ol className='divide-y divide-gray-200'>
        {resources.map(r => (
          <li key={r.name} className='flex justify-between py-2'>
            <div>
              <h3 className='font-semibold text-el-dark-blue hover:text-sky-800'>
                <a href={r.url} target='_blank'>
                  {r.name}
                </a>
              </h3>
              <p className='text-xs'>{r.subtitle}</p>
            </div>
            <button
              className='inline-flex items-center rounded-md border border-transparent bg-el-dark-blue px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-el-dark-blue focus:ring-offset-2'
              onClick={() => {
                navigator.clipboard.writeText(r.url)
              }}>
              Copy link
              <ClipboardIcon className='-mr-0.5 ml-2 h-4 w-4' aria-hidden='true' />
            </button>
          </li>
        ))}
      </ol>
    </Card>
  )
}

export default QuickResources
