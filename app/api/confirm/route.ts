import { NextRequest, NextResponse } from "next/server"
import { updateGuest } from "@/lib/notion"
import type { ConfirmBody } from "@/types/guest"

const VALID_STATUSES = ["Confirmado", "Tal vez", "Declinado"] as const

export async function PUT(request: NextRequest) {
  const body: ConfirmBody = await request.json()

  if (!body.guestId || !body.status) {
    return NextResponse.json(
      { error: "guestId y status son requeridos" },
      { status: 400 }
    )
  }

  if (!VALID_STATUSES.includes(body.status)) {
    return NextResponse.json(
      { error: `Estado inválido. Opciones: ${VALID_STATUSES.join(", ")}` },
      { status: 400 }
    )
  }

  const confirmedNames = Array.isArray(body.confirmedCompanionNames)
    ? body.confirmedCompanionNames
    : undefined

  // confirmedGuests siempre = total de personas (invitado + acompañantes)
  const confirmed =
    confirmedNames !== undefined
      ? confirmedNames.length
      : typeof body.confirmedGuests === "number" && body.confirmedGuests >= 0
        ? 1 + Math.floor(body.confirmedGuests)   // +1 = el invitado principal
        : 0

  const restrictions = Array.isArray(body.dietaryRestrictions)
    ? body.dietaryRestrictions
    : []

  await updateGuest(body.guestId, {
    status: body.status,
    confirmedGuests: confirmed,
    confirmedCompanionNames: confirmedNames,
    dietaryRestrictions: restrictions,
  })

  return NextResponse.json({ success: true })
}
