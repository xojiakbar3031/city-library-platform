'use client'

import Link from 'next/link'
import { useState } from 'react'
import { MEMBERSHIP_FEE, PHONE_RE, createMember, loadMembers, saveMembers, type Member } from '@/lib/library'

export function RegistrationForm() {
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '+998 ' })
  const [error, setError] = useState('')
  const [created, setCreated] = useState<Member | null>(null)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (form.firstName.trim().length < 2 || form.lastName.trim().length < 2) {
      setError("Ism va familiyani to'liq kiriting")
      return
    }
    if (!PHONE_RE.test(form.phone.trim())) {
      setError('Telefon raqami +998 XX XXX XX XX formatida bo\'lsin')
      return
    }
    const members = loadMembers()
    const member = createMember(members, form, 'online')
    saveMembers([member, ...members])
    setCreated(member)
  }

  if (created) {
    return (
      <div className="rounded-2xl border border-gold/25 bg-panel p-8 text-center">
        <div className="mb-4 text-5xl">✅</div>
        <h2 className="mb-2 font-serif text-2xl font-bold text-cream">Arizangiz qabul qilindi</h2>
        <p className="mb-6 text-sm text-cream/50">
          Kutubxonaga kelib {MEMBERSHIP_FEE.toLocaleString('uz-UZ')} so&apos;m a&apos;zolik to&apos;lovini qilganingizdan so&apos;ng kartangiz
          faollashtiriladi.
        </p>
        <div className="mx-auto mb-8 w-fit rounded-xl border border-gold/30 bg-gradient-to-br from-forest to-[#0b1a0c] px-8 py-5">
          <div className="text-[10px] tracking-[0.25em] text-gold/60">KARTA RAQAMI</div>
          <div className="font-mono text-2xl font-bold text-gold">{created.cardNumber}</div>
          <div className="mt-1 text-sm text-cream/70">
            {created.lastName} {created.firstName}
          </div>
        </div>
        <Link href="/kitoblar" className="text-sm font-semibold text-gold hover:underline">
          Katalogni ko&apos;rish →
        </Link>
      </div>
    )
  }

  const field = (key: keyof typeof form, label: string, props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold tracking-[0.15em] text-cream/50">{label}</span>
      <input
        {...props}
        value={form[key]}
        onChange={(e) => {
          setForm({ ...form, [key]: e.target.value })
          setError('')
        }}
        className="w-full rounded-lg border border-white/10 bg-ink px-4 py-3 text-sm text-white outline-none transition focus:border-gold"
      />
    </label>
  )

  return (
    <form onSubmit={submit} className="space-y-5 rounded-2xl border border-white/5 bg-panel p-6 md:p-8" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        {field('firstName', 'ISM', { required: true, autoComplete: 'given-name' })}
        {field('lastName', 'FAMILIYA', { required: true, autoComplete: 'family-name' })}
      </div>
      {field('phone', 'TELEFON RAQAMI', { required: true, type: 'tel', autoComplete: 'tel', inputMode: 'tel' })}

      {error && (
        <p role="alert" className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-sm text-rose-300">
          {error}
        </p>
      )}

      <div className="rounded-lg border border-gold/15 bg-gold/5 px-4 py-3 text-xs leading-relaxed text-cream/60">
        ℹ A&apos;zolik 1 yilga beriladi, to&apos;lov — {MEMBERSHIP_FEE.toLocaleString('uz-UZ')} so&apos;m. To&apos;lov kutubxonada qabul qilinadi.
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-gradient-to-br from-gold to-gold-light py-4 text-[13px] font-extrabold tracking-[0.15em] text-ink transition hover:-translate-y-0.5"
      >
        ARIZA YUBORISH
      </button>
    </form>
  )
}
