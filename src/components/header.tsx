import { Button } from '@/components/ui/button';
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export function Header() {
  return (
    <header className='flex h-16 items-center justify-end gap-4 border-b px-4 bg-white'>
      <div className='flex items-center gap-x-4'>
        <SignedOut>
          <SignInButton>
            <Button variant='ghost'>Sign in</Button>
          </SignInButton>
          <SignUpButton>
            <Button>Sign up</Button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
}
