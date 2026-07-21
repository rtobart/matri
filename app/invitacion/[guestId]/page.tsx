import { InvitationCard } from "@/components/InvitationCard"
import { MenuSelector } from "@/components/MenuSelector"
import { GiftSection } from "@/components/GiftSection"
import ConfirmClient from "./ConfirmClient"
import type { AttendanceStatus } from "@/types/guest"

const BASE_URL = process.env.BASE_URL || "http://localhost:3000"

async function getGuestData(id: string) {
  const res = await fetch(`${BASE_URL}/api/guest/${id}`, {
    cache: "no-store",
  })
  if (!res.ok) return null
  return res.json()
}

export default async function InvitacionPage({
  params,
}: {
  params: Promise<{ guestId: string }>
}) {
  const { guestId } = await params
  const data = await getGuestData(guestId)

  if (!data || !data.guest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4">
        <div className="text-center">
          <h1 className="text-2xl font-light text-gray-600 mb-2">
            Invitación no encontrada
          </h1>
          <p className="text-gray-400">
            El enlace que usaste no es válido o la invitación ya no está disponible.
          </p>
        </div>
      </div>
    )
  }

  const { guest, wedding } = data

  async function confirmAttendance(formData: {
    status: AttendanceStatus
    confirmedGuests: number
    dietaryRestrictions?: string[]
  }): Promise<void> {
    "use server"
    await fetch(`${BASE_URL}/api/confirm`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        guestId,
        ...formData,
      }),
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
    <div className="min-h-screen bg-stone-50 py-8 px-4">
      <div className="max-w-lg mx-auto space-y-8">
        <InvitationCard wedding={wedding} />

        {guest.name && (
          <p className="text-center text-gray-500 text-sm">
            Esta invitación es para:{" "}
            <span className="font-medium text-gray-700">{guest.name}</span>
          </p>
        )}

        {guest.companionNames.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-4 text-center">
            <p className="text-sm text-gray-400 mb-2">
              Acompañante{guest.companionNames.length > 1 ? "s" : ""} incluido{guest.companionNames.length > 1 ? "s" : ""} en tu invitación
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {guest.companionNames.map((name: string) => (
                <span
                  key={name}
                  className="inline-block px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-sm font-medium"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-md p-6 space-y-8">
          <ConfirmClient
            guestId={guestId}
            currentStatus={guest.status}
            maxGuests={guest.maxGuests}
            confirmAttendance={confirmAttendance}
          />

          {guest.status !== "Declinado" && (
            <>
              <hr className="border-stone-100" />
              <MenuSelectorClient
                currentRestrictions={guest.dietaryRestrictions}
                saveRestrictions={saveRestrictions}
              />
            </>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <GiftSection guestId={guestId} currentGift={guest.gift} montosRegalo={wedding?.montosRegalo ?? []} />
        </div>
      </div>
    </div>
  )
}

function MenuSelectorClient({
  currentRestrictions,
  saveRestrictions,
}: {
  currentRestrictions: string[]
  saveRestrictions: (r: string[]) => Promise<void>
}) {
  return (
    <MenuSelector
      currentRestrictions={currentRestrictions}
      onSubmit={saveRestrictions}
    />
  )
}
