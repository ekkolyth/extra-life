import { ClerkProvider as ClerkNextJSProvider } from '@clerk/nextjs'
import { shadcn } from '@clerk/themes'

type ClerkProviderProps = React.ComponentProps<typeof ClerkNextJSProvider>

export function ClerkProvider({ children, appearance, ...props }: ClerkProviderProps) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  if (!publishableKey) {
    return <>{children}</>
  }

  return (
    <ClerkNextJSProvider
      publishableKey={publishableKey}
      appearance={{
        theme: shadcn,
        ...appearance,
      }}
      {...props}
    >
      {children}
    </ClerkNextJSProvider>
  )
}
