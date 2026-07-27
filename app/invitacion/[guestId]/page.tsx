import { InvitationCard } from "@/components/InvitationCard"
import { MenuSelector } from "@/components/MenuSelector"
import { GiftSection } from "@/components/GiftSection"
import ConfirmClient from "./ConfirmClient"
import NavBar from "./NavBar"
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

  async function confirmAttendance(formData: {
    status: AttendanceStatus
    confirmedGuests: number
    confirmedCompanionNames?: string[]
  }): Promise<void> {
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
    <main className="invitation-shell min-h-screen">
      <NavBar />

      <div className="mx-auto max-w-3xl px-5 sm:px-8">
         <InvitationCard wedding={wedding} showMessage />
        <div className="hairline" />

        {[
          { label: "Vestimenta", value: wedding?.vestimenta },
          { label: "Alojamiento y transporte", value: wedding?.alojamientoTransporte },
          { label: "Horarios", value: wedding?.horarios },
        ].some((d) => d.value) && (
          <section id="detalles" className="scroll-mt-20 border-t border-[var(--line)] py-20 sm:py-28">
            <div className="space-y-7 text-center">
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/glases.svg" alt="" className="mx-auto mb-4 h-28 w-auto opacity-70" />
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--sage-dark)]">Info</p>
                <h2 className="font-display text-3xl text-[var(--foreground)]">Más detalles</h2>
              </div>
              <div className="space-y-8">
                {[
                  { label: "Vestimenta", value: wedding?.vestimenta },
                  { label: "Alojamiento y transporte", value: wedding?.alojamientoTransporte },
                  { label: "Horarios", value: wedding?.horarios },
                ].filter((d) => d.value).map((d) => (
                  <div key={d.label}>
                    <h3 className="font-display text-xl text-[var(--foreground)]">{d.label}</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--ink-muted)]">{d.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="border-t border-[var(--line)] py-20 text-center sm:py-28">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/letter-icon.svg" alt="" className="mx-auto mb-4 h-32 w-auto opacity-70" />
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--sage-dark)]">Una invitación para</p>
          {guest.name && <h2 className="font-display text-4xl text-[var(--foreground)] sm:text-5xl">{guest.name}</h2>}
          {guest.companionNames.length > 0 && (
            <div className="mx-auto mt-8 max-w-md">
              <p className="text-sm text-[var(--ink-muted)]">Y para tu{guest.companionNames.length > 1 ? "s" : ""} acompañante{guest.companionNames.length > 1 ? "s" : ""}</p>
              <p className="mt-3 text-sm text-[var(--clay)]">{guest.companionNames.join(" | ")}</p>
            </div>
          )}
        </section>

        <section id="rsvp" className="scroll-mt-20 border-t border-[var(--line)] py-20 sm:py-28">
          <ConfirmClient
            currentStatus={guest.status}
            maxGuests={guest.maxGuests}
            confirmedGuests={guest.confirmedGuests}
            guestName={guest.name}
            companionNames={guest.companionNames}
            confirmedCompanionNames={guest.confirmedCompanionNames}
            confirmAttendance={confirmAttendance}
          />
        </section>

        {guest.status !== "Declinado" && (
          <section id="menu" className="scroll-mt-20 border-t border-[var(--line)] py-20 sm:py-28">
            <MenuSelectorClient currentRestrictions={guest.dietaryRestrictions} saveRestrictions={saveRestrictions} />
          </section>
        )}

        <section id="regalos" className="scroll-mt-20 border-t border-[var(--line)] py-20 sm:py-28">
          <GiftSection guestId={guestId} currentGift={guest.gift} montosRegalo={wedding?.montosRegalo ?? []} />
        </section>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <div className="mx-auto mt-8 mb-24 max-w-xs text-center">
          <img src="/us.png" alt="Natalia y Robinson" className="w-full object-contain" />
        </div>

        <footer className="border-t border-[var(--line)] py-12 text-center text-[10px] uppercase tracking-[0.3em] text-[var(--ink-muted)]">Con cariño, Natalia &amp; Robinson</footer>
      </div>
    </main>
  )
}

function MenuSelectorClient({ currentRestrictions, saveRestrictions }: { currentRestrictions: string[]; saveRestrictions: (r: string[]) => Promise<void> }) {
  return <MenuSelector currentRestrictions={currentRestrictions} onSubmit={saveRestrictions} />
}
