import Navbar from 'src/components/navbar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen app'>
      <Navbar />
      <main className='flex-1 container py-6'>{children}</main>
    </div>
  )
}
