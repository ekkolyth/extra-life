import { Button } from '@/components/ui/button';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { ModeToggle } from '@/components/mode-toggle';

export function Header() {
  return (
    <header className='flex h-16 items-center justify-end gap-4 border-b border-border bg-background px-4'>
      <div className='flex items-center gap-x-4'>
        <ModeToggle />
        <SignedOut>
          <SignInButton>
            <Button variant='outline'>Login</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
}
