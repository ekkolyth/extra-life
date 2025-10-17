import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Ekkolyth's Extra Life",
  description:
    "The names and faces attached have changed over the years, but one thing hasn't - the mission. Each year, 4 - 10 humans come together to put their bodies and spirit on the line in hopes to encourage you “beautiful creatures of the internet” to give to kids in need. ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full"
      suppressHydrationWarning
      style={{ "--font-satoshi": '"Satoshi", sans-serif' } as CSSProperties}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@1,2,3,4,5,6,7,8,9&display=swap"
        />
      </head>
      <body className="flex min-h-full flex-col antialiased font-sans">
        {/* Check if Clerk key is available */}
        {!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              background: "red",
              color: "white",
              padding: "10px",
              zIndex: 9999,
              textAlign: "center",
            }}
          >
            ⚠️ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is missing
          </div>
        )}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
