import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'OneSwipe Academy — Learn. Grow. Succeed.',
  description:
    'OneSwipe Academy by The ONESWIPE Technologies Pvt. Ltd. — Professional on-demand video courses in web development, design, data science, digital marketing, and more.',
  keywords: ['online learning', 'courses', 'LMS', 'OneSwipe', 'education', 'training'],
  authors: [{ name: 'The ONESWIPE Technologies Pvt. Ltd.' }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
