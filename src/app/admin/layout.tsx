import Navbar from 'src/components/navbar';
import { AuthCheck } from '@/components/auth-check';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthCheck>
      <div className='min-h-screen app'>
        <Navbar />
        <main className='flex-1 container py-6'>{children}</main>
      </div>
    </AuthCheck>
  );
}
