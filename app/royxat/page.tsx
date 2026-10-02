import type { Metadata } from 'next'
import { SiteFooter, SiteHeader } from '@/components/SiteChrome'
import { RegistrationForm } from './RegistrationForm'

export const metadata: Metadata = {
  title: "A'zo bo'lish — Angren Kutubxonasi",
  description: "Kutubxonaga a'zo bo'lish uchun onlayn ariza qoldiring.",
}

export default function RoyxatPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-xl px-4 py-12 md:py-20">
        <div className="mb-8 text-center">
          <div className="mb-3 text-[11px] font-bold tracking-[0.3em] text-gold/60">ONLAYN ARIZA</div>
          <h1 className="mb-3 font-serif text-3xl font-bold text-cream md:text-4xl">Kutubxonaga a&apos;zo bo&apos;ling</h1>
          <p className="text-sm text-cream/45">Ariza bir daqiqada to&apos;ldiriladi. Karta raqamingiz darhol beriladi.</p>
        </div>
        <RegistrationForm />
      </main>
      <SiteFooter />
    </div>
  )
}
