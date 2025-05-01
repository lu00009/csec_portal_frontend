// app/layout.tsx
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <body>
        <Toaster position="top-center" />
        {children}
      </body>

  );
}
