import { NextResponse } from "next/server"
import { getGuest, getWeddingInfo } from "@/lib/notion"

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  const [guest, wedding] = await Promise.all([
    getGuest(id),
    getWeddingInfo(),
  ])

  if (!guest) {
    return NextResponse.json({ error: "Invitado no encontrado" }, { status: 404 })
  }

  return NextResponse.json({ guest, wedding })
}
