import Link from 'next/link'
import { Particles } from '@/components/Particles'
import { SiteFooter, SiteHeader } from '@/components/SiteChrome'
import { BOOKS } from '@/lib/library'

const stats = [
  { num: '50,000+', label: 'Kitoblar fondi', icon: '📖' },
  { num: '12,000+', label: "O'quvchilar", icon: '👥' },
  { num: '1,200+', label: 'Yangi kitoblar', icon: '✨' },
  { num: '1967', label: 'Tashkil etilgan', icon: '🏛️' },
]

const services = [
  { icon: '📚', title: 'Kitob berish xizmati', desc: "Ro'yxatdan o'tgan o'quvchilarga 30 kungacha kitob beriladi. Qaytarish muddati uzaytirilishi mumkin.", href: '/royxat' },
  { icon: '🔍', title: 'Elektron katalog', desc: "Kitoblarni onlayn qidiring: nomi, muallifi yoki janri bo'yicha filtrlang va mavjudligini tekshiring.", href: '/kitoblar' },
  { icon: '📖', title: "O'qish zali", desc: "Qulay zamonaviy o'qish zali. Yuqori tezlikli Wi-Fi va konditsioner bilan jihozlangan.", href: '#xizmatlar' },
  { icon: '💻', title: 'Raqamli kutubxona', desc: '5,000+ elektron va audio kitob. Istalgan qurilmadan kirish mumkin.', href: '/kitoblar' },
  { icon: '🎓', title: "Bolalar bo'limi", desc: "Maktabgacha va maktab yoshidagi bolalar uchun maxsus bo'lim. Har hafta tadbirlar.", href: '/kitoblar?janr=Bolalar' },
  { icon: '📰', title: 'Gazeta va jurnallar', desc: '100+ mahalliy va xalqaro nashrlar. Har kuni yangilanadi.', href: '#xizmatlar' },
]

const featured = BOOKS.filter((b) => ['b1', 'b7', 'b9', 'b14'].includes(b.id))

const Divider = () => (
  <div className="relative z-10 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
)

export default function Home() {
  return (
    <div className="relative min-h-screen font-serif text-white">
      <Particles />
      <SiteHeader />

      {/* HERO */}
      <section className="relative z-10 flex min-h-[85vh] items-center overflow-hidden px-4 py-20 md:px-6 lg:px-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_80%_50%,rgba(26,58,28,0.25)_0%,transparent_70%)]" />
        <div className="absolute right-[8%] top-1/2 hidden h-[420px] w-[420px] -translate-y-1/2 rounded-full border border-gold/5 bg-[radial-gradient(circle,rgba(212,175,55,0.04)_0%,transparent_70%)] lg:block" />
        <div className="absolute right-[12%] top-1/2 hidden h-[280px] w-[280px] -translate-y-1/2 rounded-full border border-gold/10 lg:block" />
        <div className="animate-float absolute right-[18%] top-[40%] hidden text-[5rem] opacity-15 drop-shadow-[0_0_30px_rgba(212,175,55,0.5)] lg:block">
          📚
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="animate-fade-up mb-8 inline-flex items-center gap-2.5 rounded-full border border-gold/20 bg-gold/5 px-5 py-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
            <span className="font-sans text-[11px] font-semibold tracking-[0.25em] text-gold/85">1967 YILDAN BUYON XIZMATDA</span>
          </div>

          <h1 className="animate-fade-up mb-8 text-5xl font-extrabold leading-[1.05] tracking-tight [animation-delay:0.15s] sm:text-6xl lg:text-[5.5rem]">
            <span className="block text-cream">Bilim —</span>
            <span className="text-gold-gradient block">Eng Katta</span>
            <span className="block text-cream">Boylik</span>
          </h1>

          <p className="animate-fade-up mb-10 max-w-lg font-sans text-base leading-loose text-cream/45 [animation-delay:0.3s] md:text-lg">
            Shahar markaziy kutubxonasi — 50,000 dan ortiq kitob, zamonaviy o&apos;qish zallari va raqamli xizmatlar bilan
            har kuni siz uchun ochiq.
          </p>

          <div className="animate-fade-up flex flex-col gap-3 font-sans [animation-delay:0.45s] sm:flex-row sm:items-center">
            <Link
              href="/kitoblar"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-gold to-gold-light px-10 py-4 text-[13px] font-extrabold tracking-[0.15em] text-ink shadow-[0_8px_32px_rgba(212,175,55,0.3)] transition hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(212,175,55,0.45)]"
            >
              🔍 KITOB QIDIRISH
            </Link>
            <Link
              href="/royxat"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-9 py-4 text-[13px] font-medium tracking-[0.12em] text-cream/75 backdrop-blur transition hover:-translate-y-1 hover:border-gold/40 hover:bg-gold/5 hover:text-gold"
            >
              RO&apos;YXATDAN O&apos;TISH →
            </Link>
          </div>

          <div className="animate-fade-up mt-10 flex flex-wrap gap-x-8 gap-y-2 font-sans text-xs text-white/35 [animation-delay:0.6s]">
            <span>✅ Onlayn ariza</span>
            <span>📍 Markaziy joylashuv</span>
            <span>⚡ Tez xizmat</span>
          </div>
        </div>
      </section>

      <Divider />

      {/* STATS */}
      <section className="relative z-10 bg-ink-2">
        <div className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`px-4 py-10 text-center transition hover:bg-gold/5 md:py-14 ${i % 2 === 0 ? 'border-r' : ''} ${
                i < 2 ? 'border-b lg:border-b-0' : ''
              } border-gold/10 lg:border-r lg:last:border-r-0`}
            >
              <div className="mb-3 text-3xl drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]">{s.icon}</div>
              <div className="bg-gradient-to-br from-gold to-gold-light bg-clip-text text-3xl font-extrabold tracking-tight text-transparent md:text-[2.6rem]">
                {s.num}
              </div>
              <div className="mt-3 font-sans text-[10px] tracking-[0.2em] text-cream/35">{s.label.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* XIZMATLAR */}
      <section id="xizmatlar" className="relative z-10 scroll-mt-24 px-4 py-24 md:px-6 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <div className="mb-5 font-sans text-[11px] font-bold tracking-[0.3em] text-gold/60">BIZNING XIZMATLAR</div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-cream md:text-5xl">Nima taklif etamiz</h2>
            <p className="mx-auto max-w-md font-sans text-[15px] leading-relaxed text-cream/35">
              Zamonaviy kutubxona xizmatlari bilan bilim olishni yanada qulay qilamiz
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <Link
                key={s.title}
                href={s.href}
                className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-8 transition duration-500 hover:-translate-y-2 hover:border-gold/25 hover:bg-gold/5 hover:shadow-[0_24px_60px_rgba(0,0,0,0.4)]"
              >
                <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 transition group-hover:opacity-100" />
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl border border-gold/15 bg-gold/10 text-3xl transition group-hover:-rotate-3 group-hover:scale-110">
                  {s.icon}
                </div>
                <h3 className="mb-3 text-[1.05rem] font-semibold text-cream">{s.title}</h3>
                <p className="font-sans text-[13px] leading-7 text-cream/40">{s.desc}</p>
                <div className="mt-7 flex items-center gap-1.5 font-sans text-[11px] font-bold tracking-[0.15em] text-gold/45 transition group-hover:text-gold">
                  BATAFSIL <span className="transition group-hover:translate-x-1">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TAVSIYA ETILGAN KITOBLAR */}
      <section className="relative z-10 px-4 pb-24 md:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-bold text-cream md:text-3xl">Tavsiya etamiz</h2>
            <Link href="/kitoblar" className="font-sans text-xs font-semibold tracking-[0.15em] text-gold/70 hover:text-gold">
              BARCHA KITOBLAR →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {featured.map((b) => (
              <Link
                key={b.id}
                href={`/kitoblar?q=${encodeURIComponent(b.title)}`}
                className="rounded-xl border border-white/5 bg-panel p-5 transition hover:border-gold/30"
              >
                <div className="mb-4 flex aspect-[3/4] items-end rounded-lg bg-gradient-to-br from-forest to-[#0b1a0c] p-4 shadow-inner">
                  <span className="font-serif text-lg font-bold leading-tight text-gold">{b.title}</span>
                </div>
                <div className="truncate font-sans text-sm text-cream/80">{b.author}</div>
                <div className="font-sans text-xs text-cream/35">
                  {b.genre} · {b.year}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-4 pb-24 md:px-6 md:pb-32">
        <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-8 overflow-hidden rounded-2xl border border-gold/20 bg-gradient-to-br from-[#0f2211] via-forest to-[#0f2211] p-8 shadow-[0_0_60px_rgba(212,175,55,0.05)] md:flex-row md:items-center md:justify-between md:p-16">
          <div className="pointer-events-none absolute right-[5%] top-1/2 -translate-y-1/2 text-[8rem] opacity-5">📚</div>
          <div>
            <h3 className="mb-3 text-2xl font-bold tracking-tight text-cream md:text-3xl">Bugun ro&apos;yxatdan o&apos;ting</h3>
            <p className="font-sans text-sm text-cream/45">Onlayn ariza qoldiring — a&apos;zolik kartangiz tayyor bo&apos;lgach xabar beramiz</p>
          </div>
          <Link
            href="/royxat"
            className="whitespace-nowrap rounded-xl bg-gradient-to-br from-gold to-gold-light px-10 py-4 font-sans text-[13px] font-extrabold tracking-[0.15em] text-ink shadow-[0_8px_32px_rgba(212,175,55,0.3)] transition hover:-translate-y-0.5"
          >
            RO&apos;YXATDAN O&apos;TISH →
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
