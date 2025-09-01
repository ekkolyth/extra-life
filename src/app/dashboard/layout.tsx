import Navbar from 'src/components/navbar';
import { Header } from '@/components/header';
import { Authenticated, Unauthenticated } from 'convex/react';
import { redirect } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Authenticated>
        <div className='min-h-screen app'>
          <Header />
          <Navbar />
          <main className='flex-1 container py-6'>{children}</main>
        </div>
      </Authenticated>
      <Unauthenticated>{redirect('/sign-in')}</Unauthenticated>
    </>
  );
}
