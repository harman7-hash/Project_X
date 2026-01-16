import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Project X - Booking Platform',
  description: 'Book items from sellers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
