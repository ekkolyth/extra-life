import { Button } from '@/components/ui/button';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export function Header() {
  return (
    <header className='flex h-16 items-center justify-end gap-4 border-b border-zinc-900 bg-zinc-950 px-4'>
      <div className='flex items-center gap-x-4'>
        <SignedOut>
          <SignInButton>
            <Button variant='ghost'>Login</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
}
