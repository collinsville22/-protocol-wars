import type { Metadata } from 'next'
  import { Inter } from 'next/font/google'
  import './globals.css'

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
        <body className={inter.className}>{children}</body>
      </html>
    )
  }

  5. Commit message: Add root layout for Next.js app router
  6. Click "Commit new file"

  Then create globals.css file

  1. Click "Add file" → "Create new file" again
  2. Name it: src/app/globals.css
  3. Paste this code:

  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  :root {
    --foreground-rgb: 255, 255, 255;
    --background-start-rgb: 0, 0, 0;
    --background-end-rgb: 0, 0, 0;
  }

  body {
    color: rgb(var(--foreground-rgb));
    background: linear-gradient(
        to bottom,
        transparent,
        rgb(var(--background-end-rgb))
      )
      rgb(var(--background-start-rgb));
  }
