"use client"

import { useState } from "react"
import type { AttendanceStatus } from "@/types/guest"

interface Props {
  currentStatus: string
  maxGuests: number
  confirmedGuests: number | null
  onSubmit: (data: { status: AttendanceStatus; confirmedGuests: number }) => Promise<void>
}

export function AttendanceForm({ currentStatus, maxGuests, confirmedGuests: savedConfirmedGuests, onSubmit }: Props) {
  const savedStatus = ["Confirmado", "Tal vez", "Declinado"].includes(currentStatus)
    ? currentStatus as AttendanceStatus
    : "Confirmado"
  const [status, setStatus] = useState<AttendanceStatus>(savedStatus)
  const [confirmedGuests, setConfirmedGuests] = useState(savedConfirmedGuests ?? 0)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await onSubmit({ status, confirmedGuests })
    setLoading(false)
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="border border-[var(--sage)]/50 bg-[var(--sage)]/10 px-5 py-7 text-center">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--sage-dark)]">Gracias</p>
        <p className="font-display text-3xl text-[var(--foreground)]">Confirmación guardada</p>
        <p className="mt-2 text-sm text-[var(--ink-muted)]">Nos alegra mucho compartir este día contigo.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--sage-dark)]">RSVP</p>
        <h2 className="font-display text-3xl text-[var(--foreground)]">¿Nos acompañas?</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--ink-muted)]">Cuéntanos si podrás estar presente en este día tan especial.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {(["Confirmado", "Tal vez", "Declinado"] as AttendanceStatus[]).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setStatus(option)}
            className={`border px-4 py-3 text-sm transition-all ${
              status === option
                ? option === "Confirmado"
                  ? "border-[var(--sage-dark)] bg-[var(--sage)]/10 text-[var(--sage-dark)]"
                  : option === "Tal vez"
                    ? "border-[var(--clay)] bg-[var(--clay)]/10 text-[var(--clay)]"
                    : "border-[var(--foreground)] bg-[var(--foreground)] text-[var(--cream)]"
                : "border-[var(--line)] bg-transparent text-[var(--ink-muted)] hover:border-[var(--sage-dark)]"
            }`}
          >
            {option === "Confirmado" ? "Sí, voy" : option === "Tal vez" ? "Tal vez" : "No puedo"}
          </button>
        ))}
      </div>

      {status !== "Declinado" && maxGuests > 0 && (
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
            Acompañantes <span className="font-normal text-[var(--ink-muted)]">(máximo {maxGuests})</span>
          </label>
          <input
            type="number"
            min={0}
            max={maxGuests}
            value={confirmedGuests}
            onChange={(e) => setConfirmedGuests(Math.min(maxGuests, Math.max(0, parseInt(e.target.value) || 0)))}
            className="w-24 border-b border-[var(--foreground)] bg-transparent px-2 py-2 text-center text-[var(--foreground)] focus:outline-none"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full border border-[var(--foreground)] bg-[var(--foreground)] px-6 py-3 text-sm font-medium tracking-wide text-[var(--cream)] transition-colors hover:bg-[var(--sage-dark)] disabled:opacity-50"
      >
        {loading ? "Guardando..." : "Confirmar asistencia"}
      </button>
    </form>
  )
}
