import { ReactNode } from 'react'

interface ICard {
  title?: string
  icon?: ReactNode
  children?: ReactNode
}

const Card = ({ title, icon, children }: ICard) => {
  return (
    <div className='bg-white p-6 shadow-super border-2 border-gray-200 rounded-lg'>
      <header className='flex items-center justify-end flex-row-reverse mb-2'>
        <h2 className='text-xl font-bold'>{title}</h2>
        <div className='rounded-full bg-blue-50 w-10 h-10 p-2 text-el-dark-blue mr-4'>{icon}</div>
      </header>
      {children}
    </div>
  )
}

export default Card
