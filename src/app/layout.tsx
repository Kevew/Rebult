import { cn } from '@/lib/utils';
import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/NavBar';
import { Toaster } from '@/components/ui/Toaster';
import Providers from '@/components/Providers';

export const metadata = {
  title: 'Rebult',
  description: 'A platform for interacting with research papers.',
}

const inter = Inter({ subsets: ['latin'] })
export default function RootLayout({
  children,
  authModal
}: {
  children: React.ReactNode,
  authModal: React.ReactNode
}) {
  return (
    <html lang='en' className={cn(
      'bg-white text-slate-900 antialiased light',
      inter.className
    )}>
      <body className='min-h-screen pt-12 bg-slate-50 antialiased' style={{overflow: "hidden", height:"100vh"}}>
        <Providers>
          {/* @ts-expect-error server component */}
          <Navbar />

          {authModal}

          <div className='container max-w-7xl mx-auto h-full pt-12' style={{overflow: "hidden"}}>
            {children}
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
