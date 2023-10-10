import Navbar from '@/components/layout/navbar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen'>
      <Navbar />
      <main className='flex-1'>
        <div className='py-6'>
          <div className='max-w-7xl px-4 sm:px-6 md:px-8'>{children}</div>
        </div>
      </main>
    </div>
  )
}
