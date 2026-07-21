import { InvitationCard } from "@/components/InvitationCard"
import { MenuSelector } from "@/components/MenuSelector"
import { GiftSection } from "@/components/GiftSection"
import ConfirmClient from "./ConfirmClient"
import type { AttendanceStatus } from "@/types/guest"

const BASE_URL = process.env.BASE_URL || "http://localhost:3000"

async function getGuestData(id: string) {
  const res = await fetch(`${BASE_URL}/api/guest/${id}`, { cache: "no-store" })
  if (!res.ok) return null
  return res.json()
}

export default async function InvitacionPage({ params }: { params: Promise<{ guestId: string }> }) {
  const { guestId } = await params
  const data = await getGuestData(guestId)

  if (!data || !data.guest) {
    return (
      <div className="invitation-shell flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <h1 className="font-display text-3xl text-[var(--foreground)]">Invitación no encontrada</h1>
          <p className="mt-2 text-[var(--ink-muted)]">El enlace no es válido o ya no está disponible.</p>
        </div>
      </div>
    )
  }

  const { guest, wedding } = data

  async function confirmAttendance(formData: { status: AttendanceStatus; confirmedGuests: number; dietaryRestrictions?: string[] }): Promise<void> {
    "use server"
    await fetch(`${BASE_URL}/api/confirm`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guestId, ...formData }),
    })
  }

  async function saveRestrictions(restrictions: string[]): Promise<void> {
    "use server"
    await fetch(`${BASE_URL}/api/confirm`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        guestId,
        status: guest.status !== "Por Enviar" ? guest.status : "Confirmado",
        confirmedGuests: guest.confirmedGuests ?? 0,
        dietaryRestrictions: restrictions,
      }),
    })
  }

  return (
    <main className="invitation-shell min-h-screen px-5 sm:px-8">
      <nav className="mx-auto flex max-w-5xl items-center justify-between border-b border-[var(--line)] py-5 text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--ink-muted)]">
        <a href="#inicio" className="font-display text-lg normal-case tracking-normal text-[var(--foreground)]">N &amp; R</a>
        <div className="hidden gap-6 sm:flex">
          <a href="#rsvp" className="transition-colors hover:text-[var(--sage-dark)]">RSVP</a>
          <a href="#menu" className="transition-colors hover:text-[var(--sage-dark)]">Menú</a>
          <a href="#regalos" className="transition-colors hover:text-[var(--sage-dark)]">Regalos</a>
        </div>
      </nav>

      <div className="mx-auto max-w-3xl">
         <InvitationCard wedding={wedding} showMessage />
        <div className="hairline" />

        <section className="py-20 text-center sm:py-28">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--sage-dark)]">Una invitación para</p>
          {guest.name && <h2 className="font-display text-4xl text-[var(--foreground)] sm:text-5xl">{guest.name}</h2>}
          {guest.companionNames.length > 0 && (
            <div className="mx-auto mt-8 max-w-md">
              <p className="text-sm text-[var(--ink-muted)]">Y para tu acompañante{guest.companionNames.length > 1 ? "s" : ""}</p>
              <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-[var(--clay)]">
                {guest.companionNames.map((name: string) => <span key={name}>{name}</span>)}
              </div>
            </div>
          )}
        </section>

        <section id="rsvp" className="scroll-mt-20 border-t border-[var(--line)] py-20 sm:py-28">
          <ConfirmClient currentStatus={guest.status} maxGuests={guest.maxGuests} confirmedGuests={guest.confirmedGuests} confirmAttendance={confirmAttendance} />
        </section>

        {guest.status !== "Declinado" && (
          <section id="menu" className="scroll-mt-20 border-t border-[var(--line)] py-20 sm:py-28">
            <MenuSelectorClient currentRestrictions={guest.dietaryRestrictions} saveRestrictions={saveRestrictions} />
          </section>
        )}

        <section id="regalos" className="scroll-mt-20 border-t border-[var(--line)] py-20 sm:py-28">
          <GiftSection guestId={guestId} currentGift={guest.gift} montosRegalo={wedding?.montosRegalo ?? []} />
        </section>

        <footer className="border-t border-[var(--line)] py-12 text-center text-[10px] uppercase tracking-[0.3em] text-[var(--ink-muted)]">Con amor, Natalia &amp; Robinson</footer>
      </div>
    </main>
  )
}

function MenuSelectorClient({ currentRestrictions, saveRestrictions }: { currentRestrictions: string[]; saveRestrictions: (r: string[]) => Promise<void> }) {
  return <MenuSelector currentRestrictions={currentRestrictions} onSubmit={saveRestrictions} />
}
