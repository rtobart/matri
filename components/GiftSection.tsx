"use client"

import { useState } from "react"

interface Props {
  guestId: string
  currentGift: number | null
  montosRegalo: number[]
}

export function GiftSection({ guestId, currentGift, montosRegalo }: Props) {
  const presetAmounts = montosRegalo.length > 0 ? montosRegalo : [20000, 30000, 50000, 75000, 100000]
  const [amount, setAmount] = useState<number>(presetAmounts[0])
  const [customAmount, setCustomAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleGift() {
    setLoading(true)
    setError("")

    const finalAmount = customAmount
      ? parseInt(customAmount)
      : amount

    if (!finalAmount || finalAmount <= 0) {
      setError("Ingresa un monto válido")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/gift", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestId, amount: finalAmount }),
      })

      const data = await res.json()

      if (data.initPoint) {
        window.location.href = data.initPoint
      } else {
        setError(data.error || "Error al crear el pago")
      }
    } catch {
      setError("Error de conexión")
    }

    setLoading(false)
  }

  const selectedAmount = customAmount ? parseInt(customAmount) : amount

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="text-lg font-medium text-gray-800 mb-1">
          ¿Quieres hacernos un regalo?
        </h2>
        <p className="text-sm text-gray-500">
          Tu cariño es el mejor regalo, pero si deseas aportar, aquí puedes hacerlo.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {presetAmounts.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => {
              setAmount(preset)
              setCustomAmount("")
              setError("")
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
              !customAmount && amount === preset
                ? "border-rose-400 bg-rose-50 text-rose-700"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            }`}
          >
            ${preset.toLocaleString("es-CL")}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2">
        <span className="text-gray-400">$</span>
        <input
          type="number"
          placeholder="Otro monto"
          value={customAmount}
          onChange={(e) => {
            setCustomAmount(e.target.value)
            setError("")
          }}
          className="w-36 px-3 py-2 rounded-lg border border-gray-200 text-gray-800 text-center focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-300"
        />
      </div>

      {selectedAmount > 0 && (
        <p className="text-center text-sm text-gray-500">
          Vas a regalar{" "}
          <span className="font-medium text-rose-600">
            ${selectedAmount.toLocaleString("es-CL")}
          </span>
        </p>
      )}

      {error && (
        <p className="text-center text-sm text-red-500">{error}</p>
      )}

      <button
        type="button"
        onClick={handleGift}
          disabled={loading}
        className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-rose-400 to-rose-500 text-white font-medium hover:from-rose-500 hover:to-rose-600 transition-all shadow-md shadow-rose-200 disabled:opacity-50"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Redirigiendo a Mercado Pago...
          </span>
        ) : (
          "Regalar con Mercado Pago"
        )}
      </button>

      {currentGift !== null && currentGift > 0 && (
        <div className="text-center py-3 px-4 bg-green-50 rounded-xl border border-green-200">
          <p className="text-green-700 text-sm">
            Ya realizaste un regalo de{" "}
            <span className="font-medium">
              ${currentGift.toLocaleString("es-CL")}
            </span>
            . ¡Muchas gracias!
          </p>
        </div>
      )}
    </div>
  )
}
