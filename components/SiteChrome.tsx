'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const NAV = [
  { href: '/', label: 'Bosh sahifa' },
  { href: '/kitoblar', label: 'Katalog' },
  { href: '/#xizmatlar', label: 'Xizmatlar' },
  { href: '/royxat', label: "A'zo bo'lish" },
  { href: '/#aloqa', label: 'Aloqa' },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <div className="relative z-50 hidden border-b border-gold/15 bg-[#0d1a0d] px-6 py-2 text-[11px] md:flex md:items-center md:justify-between lg:px-20">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_6px_rgba(212,175,55,0.8)]" />
          <span className="font-semibold tracking-[0.2em] text-gold/70">SHAHAR MARKAZIY KUTUBXONASI</span>
        </div>
        <div className="flex gap-8 text-white/35">
          <span>🕐 Dush–Shan: 9:00 – 18:00</span>
          <span>📍 Angren sh., Toshkent vil.</span>
        </div>
      </div>

      <header
        className={`sticky top-0 z-40 border-b border-gold/20 backdrop-blur-xl transition-colors duration-500 ${
          scrolled ? 'bg-ink/95 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' : 'bg-[#0b140b]/80'
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-[72px] md:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-gold/35 bg-gradient-to-br from-forest to-forest-2 text-lg shadow-[0_0_20px_rgba(212,175,55,0.15)]">
              📚
            </span>
            <span>
              <span className="block font-serif text-[15px] font-bold text-gold">Angren Kutubxonasi</span>
              <span className="block text-[9px] tracking-[0.25em] text-white/25">MARKAZIY KUTUBXONA</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-4 py-2 text-[13px] font-medium transition ${
                  pathname === item.href ? 'text-gold' : 'text-white/55 hover:bg-gold/10 hover:text-gold'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden rounded-lg border border-gold/35 bg-gradient-to-br from-forest to-forest-2 px-5 py-2.5 text-xs font-semibold tracking-[0.15em] text-gold transition hover:-translate-y-px hover:bg-none hover:bg-gold hover:text-ink sm:inline-block"
            >
              XODIMLAR →
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-gold lg:hidden"
              aria-label="Menyu"
              aria-expanded={open}
            >
              {open ? '✕' : '☰'}
            </button>
          </div>
        </nav>

        {open && (
          <div className="border-t border-gold/10 bg-ink/98 px-4 pb-4 lg:hidden">
            {[...NAV, { href: '/login', label: 'Xodimlar uchun kirish' }].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block border-b border-white/5 py-3 text-sm text-white/70 hover:text-gold"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </header>
    </>
  )
}

export function SiteFooter() {
  const cols = [
    { title: 'Xizmatlar', links: [['Elektron katalog', '/kitoblar'], ["A'zo bo'lish", '/royxat'], ["O'qish zali", '/#xizmatlar'], ['Raqamli kutubxona', '/#xizmatlar']] },
    { title: 'Kutubxona', links: [['Biz haqimizda', '/#xizmatlar'], ['Tadbirlar', '/#xizmatlar'], ['Xodimlar paneli', '/login']] },
  ]
  return (
    <footer id="aloqa" className="relative z-10 border-t border-gold/10 bg-[#050a05] px-4 py-14 md:px-6">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <span className="text-2xl">📚</span>
            <span className="font-serif font-bold text-gold">Angren Kutubxonasi</span>
          </div>
          <p className="max-w-xs text-[13px] leading-relaxed text-cream/30">
            Shahar markaziy kutubxonasi — bilim va ma&apos;rifat markazi.
          </p>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <div className="mb-4 text-[11px] font-bold tracking-[0.2em] text-gold/70">{col.title.toUpperCase()}</div>
            {col.links.map(([label, href]) => (
              <Link key={label} href={href} className="mb-3 block text-[13px] text-cream/30 transition hover:text-gold/80">
                {label}
              </Link>
            ))}
          </div>
        ))}
        <div>
          <div className="mb-4 text-[11px] font-bold tracking-[0.2em] text-gold/70">ALOQA</div>
          <address className="space-y-3 text-[13px] not-italic text-cream/30">
            <p>Angren sh., Toshkent vil.</p>
            <p>Dush–Shan: 9:00–18:00</p>
          </address>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-2 border-t border-gold/10 pt-6 text-xs text-cream/20 sm:flex-row sm:justify-between">
        <span>© {new Date().getFullYear()} Angren Kutubxonasi — konsept loyiha</span>
        <span className="text-gold/30">Next.js · TypeScript · Tailwind CSS</span>
      </div>
    </footer>
  )
}
