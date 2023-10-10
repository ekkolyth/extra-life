import { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ICard {
  title?: string
  icon?: ReactNode
  children?: ReactNode
}

export const ContentCard = ({ title, icon, children }: ICard) => {
  return (
    <Card className='relative'>
      <CardHeader className='flex items-center justify-end flex-row-reverse mb-2 space-y-0'>
        <CardTitle className='text-lg'>{title}</CardTitle>
        <div className='rounded-full bg-secondary w-10 h-10 p-2 mr-4'>{icon}</div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export default ContentCard
