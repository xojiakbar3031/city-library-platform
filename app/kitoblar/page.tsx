import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SiteFooter, SiteHeader } from '@/components/SiteChrome'
import { Catalog } from './Catalog'

export const metadata: Metadata = {
  title: 'Elektron katalog — Angren Kutubxonasi',
  description: "Kutubxona fondidagi kitoblarni nomi, muallifi yoki janri bo'yicha qidiring.",
}

export default function KitoblarPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <div className="mb-10">
          <div className="mb-3 text-[11px] font-bold tracking-[0.3em] text-gold/60">ELEKTRON KATALOG</div>
          <h1 className="font-serif text-3xl font-bold text-cream md:text-4xl">Kitob qidirish</h1>
        </div>
        <Suspense fallback={<div className="h-40 animate-pulse rounded-2xl bg-panel" />}>
          <Catalog />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  )
}
