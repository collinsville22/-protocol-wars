import './globals.css'
import { Inter } from 'next/font/google'
import { WalletContextProvider } from '@/components/WalletProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Protocol Wars - DAO Battle Royale',
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
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {children}
          </div>
        </WalletContextProvider>
      </body>
    </html>
  )
}