"use client"

import { useState } from "react"
import type { GiftOption } from "@/types/guest"

interface Props {
  guestId: string
  currentGift: number | null
  montosRegalo: GiftOption[]
}

const DEFAULT_OPTIONS: GiftOption[] = [
  { amount: 20000, label: "Un detalle especial" },
  { amount: 50000, label: "Un momento memorable" },
  { amount: 100000, label: "Una aventura juntos" },
]

export function GiftSection({ guestId, currentGift, montosRegalo }: Props) {
  const presetOptions = montosRegalo.length > 0 ? montosRegalo : DEFAULT_OPTIONS
  const [amount, setAmount] = useState(presetOptions[0].amount)
  const [customAmount, setCustomAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleGift() {
    setLoading(true)
    setError("")
    const finalAmount = customAmount ? parseInt(customAmount) : amount

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
      if (data.initPoint) window.location.href = data.initPoint
      else setError(data.error || "Error al crear el pago")
    } catch {
      setError("Error de conexión")
    }
    setLoading(false)
  }

  const selectedAmount = customAmount ? parseInt(customAmount) : amount

  return (
    <div className="space-y-7">
      <div className="text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/car.svg" alt="" className="mx-auto -mt-16 mb-2 h-56 w-auto opacity-70" />
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--sage-dark)]">Con cariño</p>
        <h2 className="font-display text-3xl text-[var(--foreground)]">Lista de regalos</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--ink-muted)]">El mejor regalo es compartir este momento contigo. Si deseas hacernos un obsequio para acompañarnos en el inicio de esta nueva etapa, puedes hacerlo aquí. Tu aporte será un lindo impulso para continuar nuestra aventura.</p>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {presetOptions.map((preset) => (
          <button
            key={preset.amount}
            type="button"
            onClick={() => { setAmount(preset.amount); setCustomAmount(""); setError("") }}
            className={`flex flex-col items-center border px-4 py-4 text-center transition-all ${
              !customAmount && amount === preset.amount
                ? "border-[var(--sage-dark)] bg-[var(--sage)]/10"
                : "border-[var(--line)] bg-transparent hover:border-[var(--sage-dark)]"
            }`}
          >
            <span className={`text-sm leading-snug ${
              !customAmount && amount === preset.amount
                ? "text-[var(--sage-dark)]"
                : "text-[var(--foreground)]"
            }`}>
              {preset.label}
            </span>
            <span className="mt-1 text-xs text-[var(--ink-muted)]">
              ${preset.amount.toLocaleString("es-CL")}
            </span>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 border-b border-[var(--line)] pb-2">
        <span className="text-[var(--ink-muted)]">$</span>
        <input
          type="number"
          placeholder="Otro monto"
          value={customAmount}
          onChange={(e) => { setCustomAmount(e.target.value); setError("") }}
          className="w-36 bg-transparent px-3 py-2 text-center text-[var(--foreground)] focus:outline-none"
        />
      </div>

      {selectedAmount > 0 && <p className="text-center text-sm text-[var(--ink-muted)]">Vas a regalar <span className="font-medium text-[var(--clay)]">${selectedAmount.toLocaleString("es-CL")}</span></p>}
      {error && <p className="text-center text-sm text-[var(--clay)]">{error}</p>}

      <button
        type="button"
        onClick={handleGift}
        disabled={loading}
        className="w-full border border-[var(--foreground)] bg-[var(--foreground)] px-6 py-3 text-sm font-medium tracking-wide text-[var(--cream)] transition-colors hover:bg-[var(--sage-dark)] disabled:opacity-50"
      >
        {loading ? "Redirigiendo a Mercado Pago..." : "Regalar"}
      </button>

      {currentGift !== null && currentGift > 0 && (
        <div className="border border-[var(--sage)]/50 bg-[var(--sage)]/10 px-4 py-3 text-center">
          <p className="text-sm text-[var(--sage-dark)]">Ya realizaste un regalo de <span className="font-medium">${currentGift.toLocaleString("es-CL")}</span>. ¡Muchas gracias!</p>
        </div>
      )}
    </div>
  )
}
