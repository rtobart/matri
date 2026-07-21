import { NextRequest, NextResponse } from "next/server"
import { MercadoPagoConfig, Payment } from "mercadopago"
import { updateGuestGift } from "@/lib/notion"

export async function POST(request: NextRequest) {
  const body = await request.json()

  if (!body.data?.id) {
    return NextResponse.json({ success: false }, { status: 400 })
  }

  const token = process.env.MERCADOPAGO_ACCESS_TOKEN
  if (!token) {
    return NextResponse.json(
      { error: "MERCADOPAGO_ACCESS_TOKEN no configurado" },
      { status: 500 }
    )
  }

  try {
    const client = new MercadoPagoConfig({ accessToken: token })
    const paymentApi = new Payment(client)

    const payment = await paymentApi.get({ id: body.data.id })

    if (payment.status === "approved") {
      const guestId = payment.external_reference
      const amount = payment.transaction_amount

      if (guestId && amount) {
        await updateGuestGift(guestId, amount)
      }
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: "Error al procesar el webhook" },
      { status: 500 }
    )
  }
}
