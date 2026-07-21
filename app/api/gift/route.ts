import { NextRequest, NextResponse } from "next/server"
import { createPreference } from "@/lib/mercadopago"

export async function POST(request: NextRequest) {
  const { guestId, amount } = await request.json()

  if (!guestId || !amount || amount <= 0) {
    return NextResponse.json(
      { error: "guestId y amount (mayor a 0) son requeridos" },
      { status: 400 }
    )
  }

  try {
    const initPoint = await createPreference(guestId, amount)
    return NextResponse.json({ initPoint })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error desconocido"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
