// app/main/members/[memberId]/layout.tsx
'use client';

import { SessionProvider } from 'next-auth/react';
import { Inter } from 'next/font/google';
import '../../../../styles/globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter', // Best practice for font variables
});

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}