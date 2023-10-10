import { ReactElement } from 'react'
import Navbar from './navbar'

const Layout = ({ children }: { children: ReactElement }) => {
  return (
    <div className='flex min-h-screen'>
      <Navbar />
      <main className='flex-1 bg-gray-100'>
        <div className='py-6'>
          <div className='max-w-7xl px-4 sm:px-6 md:px-8'>{children}</div>
        </div>
      </main>
    </div>
  )
}

export default Layout
