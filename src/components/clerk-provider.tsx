import { ClerkProvider as ClerkNextJSProvider } from '@clerk/nextjs';
import { shadcn } from '@clerk/themes';

type ClerkProviderProps = React.ComponentProps<typeof ClerkNextJSProvider>;

export function ClerkProvider({ children, appearance, ...props }: ClerkProviderProps) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    return <>{children}</>;
  }

  return (
    <ClerkNextJSProvider
      publishableKey={publishableKey}
      appearance={{
        theme: shadcn,
        variables: {
          colorPrimary: 'hsl(var(--primary))',
          colorBackground: 'hsl(var(--background))',
          colorInputBackground: 'hsl(var(--input))',
          colorInputText: 'hsl(var(--foreground))',
          colorText: 'hsl(var(--foreground))',
          colorTextSecondary: 'hsl(var(--muted-foreground))',
          colorTextOnPrimaryBackground: 'hsl(var(--primary-foreground))',
          colorSuccess: 'hsl(var(--primary))',
          colorDanger: 'hsl(var(--destructive))',
          colorWarning: 'hsl(var(--destructive))',
          colorNeutral: 'hsl(var(--muted))',
          borderRadius: 'var(--radius)',
        },
        elements: {
          formButtonPrimary: 'bg-primary text-primary-foreground hover:bg-primary/90',
          card: 'bg-card text-card-foreground',
          headerTitle: 'text-foreground',
          headerSubtitle: 'text-muted-foreground',
          socialButtonsBlockButton: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
          socialButtonsBlockButtonText: 'text-foreground',
          formFieldLabel: 'text-foreground',
          formFieldInput: 'bg-background text-foreground border border-input',
          footerActionLink: 'text-primary hover:text-primary/90',
        },
        ...appearance,
      }}
      {...props}
    >
      {children}
    </ClerkNextJSProvider>
  );
}
