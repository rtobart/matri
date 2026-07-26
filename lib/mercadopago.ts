import { MercadoPagoConfig, Preference } from "mercadopago"

function getClient() {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN
  if (!token) throw new Error("MERCADOPAGO_ACCESS_TOKEN no configurado")
  return new MercadoPagoConfig({ accessToken: token })
}

export async function createPreference(
  guestId: string,
  amount: number
) {
  const client = getClient()
  const preference = new Preference(client)

  const baseUrl = process.env.BASE_URL || "http://localhost:3000"
  const isPublic = baseUrl.startsWith("https://")

  const result = await preference.create({
    body: {
      items: [
        {
          id: `regalo-${guestId}`,
          title: "Regalo de matrimonio",
          quantity: 1,
          unit_price: amount,
          currency_id: "CLP",
        },
      ],
      external_reference: guestId,
      ...(isPublic && {
        back_urls: {
          success: `${baseUrl}/invitacion/${guestId}?pago=exito`,
          failure: `${baseUrl}/invitacion/${guestId}?pago=error`,
          pending: `${baseUrl}/invitacion/${guestId}?pago=pendiente`,
        },
        auto_return: "approved",
      }),
    },
  })

  // En desarrollo usar sandbox_init_point, en producción init_point
  return isPublic ? result.init_point : result.sandbox_init_point
}
