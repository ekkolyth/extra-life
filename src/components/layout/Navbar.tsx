import { CalendarIcon, ComputerDesktopIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline'
import { classNames } from '../../utils/style'
import logo from 'src/assets/logo/default-monochrome.svg'
import ControllerIcon from '../icons/Controller'
import DiceIcon from '../icons/Dice'
import { useRouter } from 'next/router'

const Navbar = () => {
  const { route } = useRouter()
  const navigation = [
    { name: 'Dashboard', href: '/', icon: ControllerIcon, current: route === '/' },
    { name: 'Rewards', href: '/rewards', icon: DiceIcon, current: route === '/rewards' },
    { name: 'Overlays', href: '/overlays', icon: ComputerDesktopIcon, current: route === '/overlays' },
    { name: 'Schedule', href: '/schedule', icon: CalendarIcon, current: route === '/schedule' },
    { name: 'Settings', href: '/settings', icon: AdjustmentsHorizontalIcon, current: route === '/settings' }
  ]

  return (
    <div className='flex min-h-0 w-64 flex-col bg-el-dark-blue'>
      <div className='flex flex-1 flex-col overflow-y-auto pt-5 pb-4'>
        <div className='flex flex-shrink-0 items-center px-4'>
          <img className='h-8 w-auto' src={logo.src} alt='GnomeBoard' />
        </div>
        <nav className='mt-5 flex-1 space-y-1 px-2' aria-label='Sidebar'>
          {navigation.map(item => (
            <a
              key={item.name}
              href={item.href}
              className={classNames(
                item.current ? 'bg-sky-800 text-white' : 'text-sky-100 hover:bg-sky-600 hover:bg-opacity-75',
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
              )}>
              <item.icon className='mr-3 h-6 w-6 flex-shrink-0 text-white' aria-hidden='true' />
              {item.name}
            </a>
          ))}
        </nav>
      </div>
      <div className='flex flex-shrink-0 p-4'>
        <a href='#' className='group block w-full flex-shrink-0'>
          <div className='flex items-center'>
            <div>
              <img
                className='inline-block h-9 w-9 rounded-full'
                src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
                alt=''
              />
            </div>
            <div className='ml-3'>
              <p className='text-sm font-medium text-white'>Tom Cook</p>
              <p className='text-xs font-medium text-sky-200 group-hover:text-white'>View profile</p>
            </div>
          </div>
        </a>
      </div>
    </div>
  )
}

export default Navbar
