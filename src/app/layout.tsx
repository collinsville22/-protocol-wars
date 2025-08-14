 import type { Metadata } from 'next'
  import { Inter } from 'next/font/google'
  import './globals.css'
  import WalletContextProvider from '@/components/WalletProvider'

  const inter = Inter({ subsets: ['latin'] })

  export const metadata: Metadata = {
    title: 'Protocol Wars - Blockchain Strategy Game',
    description: 'Real-time strategy game where DAOs battle for blockchain supremacy using Honeycomb Protocol',
  }

  export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <WalletContextProvider>
            {children}
          </WalletContextProvider>
        </body>
      </html>
    )
  }
