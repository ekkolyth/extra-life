import { ClerkProvider as ClerkNextJSProvider } from '@clerk/nextjs';
import { shadcn } from '@clerk/themes';

type ClerkProviderProps = React.ComponentProps<typeof ClerkNextJSProvider>;

export function ClerkProvider({ children, appearance, ...props }: ClerkProviderProps) {
  return (
    <ClerkNextJSProvider
      appearance={{
        theme: shadcn,
        ...appearance,
      }}
      signInUrl='/auth/sign-in'
      signUpUrl='/auth/sign-up'
      afterSignInUrl='/dashboard'
      afterSignUpUrl='/dashboard'
      {...props}
    >
      {children}
    </ClerkNextJSProvider>
  );
}
