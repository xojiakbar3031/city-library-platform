'use client'

import { useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { BOOKS, GENRES, type Genre } from '@/lib/library'

type Sort = 'title' | 'year-desc' | 'year-asc'

const norm = (s: string) => s.toLowerCase().replace(/[ʻʼ'‘’`]/g, "'")

export function Catalog() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()

  // Filtrlar URL'da saqlanadi — havolani ulashsa, xuddi shu natija ochiladi
  const q = params.get('q') ?? ''
  const genre = (params.get('janr') ?? '') as Genre | ''
  const onlyAvailable = params.get('mavjud') === '1'
  const sort = (params.get('saralash') ?? 'title') as Sort

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString())
    if (value) next.set(key, value)
    else next.delete(key)
    router.replace(`${pathname}?${next.toString()}`, { scroll: false })
  }

  const books = useMemo(() => {
    const term = norm(q.trim())
    const list = BOOKS.filter(
      (b) =>
        (!term || norm(`${b.title} ${b.author}`).includes(term)) &&
        (!genre || b.genre === genre) &&
        (!onlyAvailable || b.available > 0),
    )
    return list.sort((a, b) =>
      sort === 'year-desc' ? b.year - a.year : sort === 'year-asc' ? a.year - b.year : a.title.localeCompare(b.title, 'uz'),
    )
  }, [q, genre, onlyAvailable, sort])

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-white/5 bg-panel p-4 md:flex-row md:items-center">
        <input
          type="search"
          value={q}
          onChange={(e) => update('q', e.target.value)}
          placeholder="Kitob nomi yoki muallif..."
          aria-label="Qidiruv"
          className="flex-1 rounded-lg border border-gold/20 bg-ink px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-gold"
        />
        <select
          value={sort}
          onChange={(e) => update('saralash', e.target.value === 'title' ? '' : e.target.value)}
          aria-label="Saralash"
          className="rounded-lg border border-gold/20 bg-ink px-4 py-3 text-sm text-white outline-none focus:border-gold"
        >
          <option value="title">Nomi bo&apos;yicha (A–Z)</option>
          <option value="year-desc">Avval yangilari</option>
          <option value="year-asc">Avval eskilari</option>
        </select>
        <label className="flex cursor-pointer items-center gap-2 whitespace-nowrap px-1 text-sm text-cream/60">
          <input
            type="checkbox"
            checked={onlyAvailable}
            onChange={(e) => update('mavjud', e.target.checked ? '1' : '')}
            className="h-4 w-4 accent-[#d4af37]"
          />
          Faqat mavjudlari
        </label>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {(['', ...GENRES] as const).map((g) => (
          <button
            key={g || 'all'}
            onClick={() => update('janr', g)}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition ${
              genre === g ? 'border-gold bg-gold text-ink' : 'border-white/10 text-cream/60 hover:border-gold/40 hover:text-gold'
            }`}
          >
            {g || 'Barchasi'}
          </button>
        ))}
      </div>

      <p className="mb-4 text-xs text-cream/40" aria-live="polite">
        {books.length} ta kitob topildi
      </p>

      {books.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 py-20 text-center text-sm text-cream/40">
          🔍 Hech narsa topilmadi. Boshqa so&apos;z bilan qidirib ko&apos;ring.
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((b) => (
            <li key={b.id} className="flex gap-4 rounded-xl border border-white/5 bg-panel p-4 transition hover:border-gold/25">
              <div className="flex h-24 w-[72px] shrink-0 items-end rounded-md bg-gradient-to-br from-forest to-[#0b1a0c] p-2">
                <span className="line-clamp-3 font-serif text-[11px] font-bold leading-tight text-gold">{b.title}</span>
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <h3 className="truncate font-serif font-semibold text-cream">{b.title}</h3>
                <p className="truncate text-sm text-cream/55">{b.author}</p>
                <p className="mt-0.5 text-xs text-cream/35">
                  {b.genre} · {b.year}
                </p>
                <span
                  className={`mt-auto w-fit rounded px-2 py-0.5 text-[11px] font-semibold ${
                    b.available > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                  }`}
                >
                  {b.available > 0 ? `Mavjud: ${b.available} / ${b.copies}` : "Hammasi berilgan"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
