// Kutubxona ma'lumotlari: kitoblar katalogi va a'zolar ro'yxati.
// Demo loyiha bo'lgani uchun a'zolar brauzer localStorage'ida saqlanadi —
// /royxat sahifasidan yuborilgan ariza shu zahoti admin panelda ko'rinadi.
// Haqiqiy deploy uchun shu modulni ma'lumotlar bazasi (masalan Postgres) API'siga almashtirish kifoya.

export type Genre = 'Roman' | 'Tarixiy' | 'Klassika' | 'Bolalar' | 'Ilmiy-ommabop' | 'Shaxsiy rivojlanish'

export interface Book {
  id: string
  title: string
  author: string
  year: number
  genre: Genre
  copies: number
  available: number
}

export const GENRES: Genre[] = ['Roman', 'Tarixiy', 'Klassika', 'Bolalar', 'Ilmiy-ommabop', 'Shaxsiy rivojlanish']

export const BOOKS: Book[] = [
  { id: 'b1', title: "O'tkan kunlar", author: 'Abdulla Qodiriy', year: 1926, genre: 'Roman', copies: 12, available: 4 },
  { id: 'b2', title: 'Mehrobdan chayon', author: 'Abdulla Qodiriy', year: 1929, genre: 'Roman', copies: 8, available: 3 },
  { id: 'b3', title: 'Kecha va kunduz', author: "Abdulhamid Cho'lpon", year: 1936, genre: 'Roman', copies: 6, available: 0 },
  { id: 'b4', title: 'Shum bola', author: "G'afur G'ulom", year: 1936, genre: 'Bolalar', copies: 10, available: 7 },
  { id: 'b5', title: 'Sariq devni minib', author: "Xudoyberdi To'xtaboyev", year: 1968, genre: 'Bolalar', copies: 9, available: 5 },
  { id: 'b6', title: 'Ufq', author: 'Said Ahmad', year: 1974, genre: 'Roman', copies: 5, available: 2 },
  { id: 'b7', title: 'Dunyoning ishlari', author: "O'tkir Hoshimov", year: 1982, genre: 'Roman', copies: 11, available: 6 },
  { id: 'b8', title: 'Ikki eshik orasi', author: "O'tkir Hoshimov", year: 1986, genre: 'Roman', copies: 7, available: 1 },
  { id: 'b9', title: 'Yulduzli tunlar', author: 'Pirimqul Qodirov', year: 1978, genre: 'Tarixiy', copies: 6, available: 3 },
  { id: 'b10', title: 'Boburnoma', author: 'Zahiriddin Muhammad Bobur', year: 1530, genre: 'Tarixiy', copies: 4, available: 2 },
  { id: 'b11', title: 'Xamsa', author: 'Alisher Navoiy', year: 1485, genre: 'Klassika', copies: 5, available: 5 },
  { id: 'b12', title: "Mahbub ul-qulub", author: 'Alisher Navoiy', year: 1500, genre: 'Klassika', copies: 3, available: 1 },
  { id: 'b13', title: 'Otamdan qolgan dalalar', author: "Tog'ay Murod", year: 1994, genre: 'Roman', copies: 6, available: 0 },
  { id: 'b14', title: 'Alkimyogar', author: 'Paulo Coelho', year: 1988, genre: 'Roman', copies: 8, available: 4 },
  { id: 'b15', title: '1984', author: 'George Orwell', year: 1949, genre: 'Roman', copies: 6, available: 2 },
  { id: 'b16', title: 'Sapiens', author: 'Yuval Noah Harari', year: 2011, genre: 'Ilmiy-ommabop', copies: 5, available: 3 },
  { id: 'b17', title: 'Qisqacha vaqt tarixi', author: 'Stephen Hawking', year: 1988, genre: 'Ilmiy-ommabop', copies: 3, available: 1 },
  { id: 'b18', title: 'Atom odatlar', author: 'James Clear', year: 2018, genre: 'Shaxsiy rivojlanish', copies: 7, available: 0 },
]

// ─── A'zolar ───

export type MemberStatus = 'active' | 'expired' | 'pending'

export interface Member {
  id: string
  firstName: string
  lastName: string
  phone: string
  cardNumber: string
  joinedDate: string
  status: MemberStatus
  expiresAt: string
  source: 'admin' | 'online'
}

export const MEMBERSHIP_FEE = 5000

const STORAGE_KEY = 'kutubxona-members-v1'

const SEED: Member[] = [
  { id: 'm1', firstName: 'Asilbek', lastName: 'Karimov', phone: '+998 90 000 00 01', cardNumber: 'AK-2026-0001', joinedDate: '2026-01-15', status: 'active', expiresAt: '2027-01-15', source: 'admin' },
  { id: 'm2', firstName: 'Zilola', lastName: 'Umarova', phone: '+998 90 000 00 02', cardNumber: 'AK-2026-0002', joinedDate: '2025-02-10', status: 'expired', expiresAt: '2026-02-10', source: 'admin' },
  { id: 'm3', firstName: 'Bekzod', lastName: 'Aliyev', phone: '+998 90 000 00 03', cardNumber: 'AK-2026-0003', joinedDate: '2026-03-01', status: 'pending', expiresAt: '', source: 'online' },
]

const today = () => new Date().toISOString().slice(0, 10)
const inOneYear = () => {
  const d = new Date()
  d.setFullYear(d.getFullYear() + 1)
  return d.toISOString().slice(0, 10)
}

/** Muddati o'tgan faol a'zolarni avtomatik "expired" holatiga o'tkazadi. */
function withExpiry(members: Member[]): Member[] {
  const now = today()
  return members.map((m) => (m.status === 'active' && m.expiresAt && m.expiresAt < now ? { ...m, status: 'expired' } : m))
}

export function loadMembers(): Member[] {
  if (typeof window === 'undefined') return SEED
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? (JSON.parse(raw) as Member[]) : null
    return withExpiry(Array.isArray(parsed) ? parsed : SEED)
  } catch {
    return SEED
  }
}

export function saveMembers(members: Member[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(members))
  } catch {
    /* storage to'la yoki bloklangan — demo uchun jim o'tkazamiz */
  }
}

function nextCardNumber(members: Member[]): string {
  const year = new Date().getFullYear()
  const max = members.reduce((acc, m) => Math.max(acc, Number(m.cardNumber.split('-').pop()) || 0), 0)
  return `AK-${year}-${String(max + 1).padStart(4, '0')}`
}

export function createMember(
  members: Member[],
  data: { firstName: string; lastName: string; phone: string },
  source: Member['source'],
): Member {
  const active = source === 'admin'
  return {
    id: crypto.randomUUID(),
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    phone: data.phone.trim() || '—',
    cardNumber: nextCardNumber(members),
    joinedDate: today(),
    status: active ? 'active' : 'pending',
    expiresAt: active ? inOneYear() : '',
    source,
  }
}

/** To'lov qabul qilinganda yoki a'zolik yangilanganda: 1 yilga faollashtiradi. */
export function activate(member: Member): Member {
  return { ...member, status: 'active', joinedDate: member.joinedDate || today(), expiresAt: inOneYear() }
}

export function toCsv(members: Member[]): string {
  const header = ['Karta', 'Familiya', 'Ism', 'Telefon', "Ro'yxat sanasi", 'Amal qilish muddati', 'Holat', 'Manba']
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`
  const rows = members.map((m) =>
    [m.cardNumber, m.lastName, m.firstName, m.phone, m.joinedDate, m.expiresAt, m.status, m.source].map(esc).join(','),
  )
  return '﻿' + [header.map(esc).join(','), ...rows].join('\n')
}

export const PHONE_RE = /^\+998\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/
