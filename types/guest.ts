export interface GuestData {
  id: string
  name: string
  email: string | null
  phone: string | null
  status: string
  maxGuests: number
  confirmedGuests: number | null
  companionNames: string[]
  dietaryRestrictions: string[]
  gift: number | null
}

export interface WeddingData {
  nombreNovio: string
  nombreNovia: string
  fecha: string | null
  hora: string
  lugar: string
  direccion: string
  dressCode: string
  mensaje: string
  urlMapa: string | null
  fotoPortada: string | null
  montosRegalo: number[]
}

export interface GuestPageData {
  guest: GuestData
  wedding: WeddingData
}

export type AttendanceStatus = "Confirmado" | "Tal vez" | "Declinado"

export interface ConfirmBody {
  guestId: string
  status: AttendanceStatus
  confirmedGuests: number
  dietaryRestrictions: string[]
}
