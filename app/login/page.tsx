import type { Metadata } from 'next'
import { Suspense } from 'react'
import LoginPage from './LoginPage'

export const metadata: Metadata = {
  title: 'Kirish — Angren Kutubxonasi',
  description: 'Angren shahar markaziy kutubxonasi boshqaruv tizimiga xavfsiz kirish',
}

export default function Page() {
  return (
    <Suspense>
      <LoginPage />
    </Suspense>
  )
}
