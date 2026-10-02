'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  MEMBERSHIP_FEE,
  PHONE_RE,
  activate,
  createMember,
  loadMembers,
  saveMembers,
  toCsv,
  type Member,
  type MemberStatus,
} from '@/lib/library'

const STATUS_UI: Record<MemberStatus, { label: string; cls: string }> = {
  active: { label: 'FAOL', cls: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' },
  expired: { label: "MUDDATI O'TGAN", cls: 'border-rose-500/30 bg-rose-500/10 text-rose-400' },
  pending: { label: 'KUTILMOQDA', cls: 'border-amber-500/30 bg-amber-500/10 text-amber-400' },
}

export default function AdminPanel() {
  const router = useRouter()
  const [members, setMembers] = useState<Member[]>([])
  const [ready, setReady] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | MemberStatus>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newMember, setNewMember] = useState({ firstName: '', lastName: '', phone: '+998 ' })
  const [formError, setFormError] = useState('')

  useEffect(() => {
    // localStorage faqat brauzerda — mount bo'lgach o'qiymiz
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMembers(loadMembers())
    setReady(true)
  }, [])

  const commit = (next: Member[]) => {
    setMembers(next)
    saveMembers(next)
  }

  const filtered = useMemo(() => {
    const search = searchQuery.toLowerCase().trim()
    return members.filter((m) => {
      const haystack = `${m.firstName} ${m.lastName} ${m.lastName} ${m.firstName} ${m.phone} ${m.cardNumber}`.toLowerCase()
      return (!search || haystack.includes(search)) && (statusFilter === 'all' || m.status === statusFilter)
    })
  }, [members, searchQuery, statusFilter])

  const stats = useMemo(() => {
    const active = members.filter((m) => m.status === 'active').length
    return {
      total: members.length,
      active,
      pending: members.filter((m) => m.status === 'pending').length,
      revenue: active * MEMBERSHIP_FEE,
    }
  }, [members])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMember.firstName.trim().length < 2 || newMember.lastName.trim().length < 2) {
      setFormError("Ism va familiyani to'liq kiriting")
      return
    }
    if (newMember.phone.trim() !== '+998' && !PHONE_RE.test(newMember.phone.trim())) {
      setFormError("Telefon +998 XX XXX XX XX formatida bo'lsin")
      return
    }
    const phone = newMember.phone.trim() === '+998' ? '' : newMember.phone
    commit([createMember(members, { ...newMember, phone }, 'admin'), ...members])
    setNewMember({ firstName: '', lastName: '', phone: '+998 ' })
    setFormError('')
    setShowAddModal(false)
  }

  const handleActivate = (id: string) => commit(members.map((m) => (m.id === id ? activate(m) : m)))

  const handleDelete = (m: Member) => {
    if (window.confirm(`${m.lastName} ${m.firstName} (${m.cardNumber}) o'chirilsinmi?`)) {
      commit(members.filter((x) => x.id !== m.id))
    }
  }

  const exportCsv = () => {
    const url = URL.createObjectURL(new Blob([toCsv(filtered)], { type: 'text/csv;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `azolar-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const inputCls =
    'w-full rounded-md border border-white/10 bg-ink px-3 py-2.5 text-sm text-white outline-none transition focus:border-gold'

  return (
    <div className="min-h-screen bg-[#090F0A] px-4 py-8 font-sans text-[#E3E8E4] md:px-10 md:py-10 lg:px-20">
      {/* HEADER */}
      <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-1.5 flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-gold shadow-[0_0_10px_#D4AF37]" />
            <span className="text-[11px] font-semibold tracking-[0.15em] text-[#8E9890]">KUTUBXONA BOSHQARUV PANELI</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-white md:text-[1.75rem]">A&apos;zolar va to&apos;lovlar</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleLogout}
            className="rounded-md border border-white/10 px-4 py-2.5 text-[13px] text-[#8E9890] transition hover:border-rose-500/30 hover:text-rose-400"
          >
            Chiqish
          </button>
          <button
            onClick={exportCsv}
            className="rounded-md border border-gold/30 px-4 py-2.5 text-[13px] text-gold transition hover:bg-gold/10"
          >
            ⤓ CSV
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="rounded-md bg-gradient-to-b from-gold to-[#B3922E] px-5 py-2.5 text-[13px] font-semibold text-[#090F0A] shadow-[0_4px_20px_rgba(212,175,55,0.15)] transition hover:-translate-y-px"
          >
            + Yangi a&apos;zo
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "JAMI A'ZOLAR", val: stats.total, unit: 'ta' },
          { label: "FAOL A'ZOLAR", val: stats.active, unit: 'ta' },
          { label: 'ONLAYN ARIZALAR', val: stats.pending, unit: 'kutilmoqda', accent: stats.pending > 0 },
          { label: 'TUSHUM', val: stats.revenue.toLocaleString('uz-UZ'), unit: "so'm", gold: true },
        ].map((card) => (
          <div key={card.label} className="rounded-lg border border-gold/10 bg-panel p-5">
            <div className="mb-2 text-[10px] font-semibold tracking-[0.12em] text-[#8E9890]">{card.label}</div>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-2xl font-bold tracking-tight md:text-[1.8rem] ${
                  card.gold ? 'text-gold' : card.accent ? 'text-amber-400' : 'text-white'
                }`}
              >
                {ready ? card.val : '—'}
              </span>
              <span className="text-xs text-white/40">{card.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* FILTERS */}
      <div className="mb-6 flex flex-col gap-3 rounded-lg border border-white/5 bg-panel p-4 md:flex-row">
        <input
          type="search"
          placeholder="Ism, familiya, karta raqami yoki telefon..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 rounded-md border border-gold/20 bg-[#090F0A] px-4 py-3 text-[13px] text-white outline-none transition focus:border-gold"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="rounded-md border border-gold/20 bg-[#090F0A] px-4 py-3 text-[13px] text-white outline-none md:w-56"
        >
          <option value="all">Barcha holatlar</option>
          <option value="active">✓ A&apos;zolik faol</option>
          <option value="expired">✕ Muddati o&apos;tgan</option>
          <option value="pending">⏳ To&apos;lov kutilmoqda</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-lg border border-white/5 bg-panel shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
        <table className="w-full min-w-[820px] border-collapse text-left text-[13px]">
          <thead>
            <tr className="border-b border-gold/15 bg-gold/5">
              {['ID KARTA', 'F.I.SH', 'TELEFON', "RO'YXAT SANASI", 'AMAL QILISHI', 'STATUS', ''].map((h, i) => (
                <th key={i} className={`px-5 py-4 font-semibold ${i === 0 ? 'text-gold' : 'text-white'}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.id} className="border-b border-white/[0.03] transition hover:bg-white/[0.02]">
                <td className="px-5 py-4 font-mono text-sm font-semibold text-gold">{m.cardNumber}</td>
                <td className="px-5 py-4 font-medium text-white">
                  {m.lastName} {m.firstName}
                  {m.source === 'online' && <span className="ml-2 text-[10px] text-sky-400">ONLAYN</span>}
                </td>
                <td className="px-5 py-4 text-[#8E9890]">{m.phone}</td>
                <td className="px-5 py-4 text-white/40">{m.joinedDate}</td>
                <td className="px-5 py-4 text-white/40">{m.expiresAt || '—'}</td>
                <td className="px-5 py-4">
                  <span className={`inline-block rounded border px-3 py-1 text-[11px] font-semibold ${STATUS_UI[m.status].cls}`}>
                    {STATUS_UI[m.status].label}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex justify-end gap-3 text-xs">
                    {m.status !== 'active' && (
                      <button onClick={() => handleActivate(m.id)} className="font-semibold text-emerald-400 hover:underline">
                        {m.status === 'pending' ? "To'lov qabul qilindi" : 'Yangilash'}
                      </button>
                    )}
                    <button onClick={() => handleDelete(m)} className="text-white/30 hover:text-rose-400" aria-label="O'chirish">
                      O&apos;chirish
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {ready && filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="p-16 text-center text-sm text-[#8E9890]">
                  🔍 Tizimda bunday o&apos;quvchi qayd etilmagan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-white/25">
        Demo rejim: ma&apos;lumotlar shu brauzerda saqlanadi. Ishlab chiqarish uchun lib/library.ts ni ma&apos;lumotlar bazasiga ulang.
      </p>

      {/* ADD MODAL */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(5,10,6,0.85)] p-4 backdrop-blur"
          onClick={(e) => e.target === e.currentTarget && setShowAddModal(false)}
        >
          <div role="dialog" aria-modal="true" className="w-full max-w-md rounded-xl border border-gold/25 bg-panel p-6 shadow-2xl md:p-8">
            <h3 className="mb-6 text-xl font-semibold tracking-tight text-white">Yangi a&apos;zoni ro&apos;yxatga olish</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-[#8E9890]">ISM</span>
                <input autoFocus value={newMember.firstName} onChange={(e) => setNewMember({ ...newMember, firstName: e.target.value })} className={inputCls} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-[#8E9890]">FAMILIYA</span>
                <input value={newMember.lastName} onChange={(e) => setNewMember({ ...newMember, lastName: e.target.value })} className={inputCls} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-[#8E9890]">TELEFON (ixtiyoriy)</span>
                <input type="tel" value={newMember.phone} onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })} className={inputCls} />
              </label>
              {formError && <p className="text-sm text-rose-400">{formError}</p>}
              <div className="rounded-md border border-gold/15 bg-gold/5 px-3 py-2.5 text-[11px] leading-relaxed text-[#A2B3A5]">
                ℹ Qo&apos;shilishi bilan {MEMBERSHIP_FEE.toLocaleString('uz-UZ')} so&apos;m tushum yoziladi va a&apos;zolik 1 yilga faollashadi.
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2.5 text-[13px] text-[#8E9890]">
                  Bekor qilish
                </button>
                <button type="submit" className="rounded-md bg-gold px-5 py-2.5 text-[13px] font-semibold text-[#090F0A]">
                  Tasdiqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
