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
  // Sandbox: explícito o por defecto en desarrollo (no en producción)
  const isSandbox = process.env.MERCADOPAGO_SANDBOX === "true"
    || (process.env.MERCADOPAGO_SANDBOX !== "false" && process.env.NODE_ENV !== "production")
  const isPublic = baseUrl.startsWith("https://")

  const result = await preference.create({
    body: {
      items: [
        {
          id: "regalo",
          title: "Regalo de matrimonio",
          description: "Aporte para los novios",
          quantity: 1,
          unit_price: amount,
          currency_id: "CLP",
        },
      ],
      external_reference: guestId,
      ...(isSandbox && { binary_mode: true }),
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 12,
        default_installments: 1,
      },
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
  return isSandbox ? result.sandbox_init_point : result.init_point
}
