"use client"

import { useState } from "react"
import type { AttendanceStatus } from "@/types/guest"

interface Props {
  currentStatus: string
  maxGuests: number
  confirmedGuests: number | null
  guestName: string
  companionNames: string[]
  confirmedCompanionNames: string[]
  onSubmit: (data: {
    status: AttendanceStatus
    confirmedGuests: number
    confirmedCompanionNames?: string[]
  }) => Promise<void>
}

export function AttendanceForm({
  currentStatus,
  maxGuests,
  confirmedGuests: savedConfirmedGuests,
  guestName,
  companionNames,
  confirmedCompanionNames: savedConfirmedNames,
  onSubmit,
}: Props) {
  const savedStatus = ["Confirmado", "Tal vez", "Declinado"].includes(currentStatus)
    ? (currentStatus as AttendanceStatus)
    : "Confirmado"

  const [status, setStatus] = useState<AttendanceStatus>(savedStatus)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // --- Modo nombres ---
  const useNameMode = companionNames.length > 0
  const allNames = useNameMode ? [guestName, ...companionNames] : []

  const initialSelected = useNameMode
    ? new Set(savedConfirmedNames.length > 0 ? savedConfirmedNames : [guestName])
    : null

  const [selectedNames, setSelectedNames] = useState<Set<string>>(
    initialSelected ?? new Set()
  )

  // --- Modo numérico (fallback) ---
  const [confirmedGuests, setConfirmedGuests] = useState(savedConfirmedGuests ?? 0)

  function toggleName(name: string) {
    const next = new Set(selectedNames)
    if (next.has(name)) next.delete(name)
    else next.add(name)
    setSelectedNames(next)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    if (useNameMode) {
      const names = Array.from(selectedNames)
      await onSubmit({ status, confirmedGuests: names.length, confirmedCompanionNames: names })
    } else {
      await onSubmit({ status, confirmedGuests })
    }
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
      <div className="text-center">
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
        <div className="space-y-3">
          <label className="block text-sm font-medium text-[var(--foreground)]">
            Acompañantes
          </label>

          {useNameMode ? (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {allNames.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => toggleName(name)}
                  className={`border px-3 py-3 text-left text-sm transition-all ${
                    selectedNames.has(name)
                      ? "border-[var(--sage-dark)] bg-[var(--sage)]/10 text-[var(--sage-dark)]"
                      : "border-[var(--line)] bg-transparent text-[var(--ink-muted)] hover:border-[var(--sage-dark)]"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex gap-2">
              {Array.from({ length: maxGuests + 1 }, (_, i) => i).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setConfirmedGuests(n)}
                  className={`border px-4 py-3 text-sm transition-all ${
                    confirmedGuests === n
                      ? "border-[var(--sage-dark)] bg-[var(--sage)]/10 text-[var(--sage-dark)]"
                      : "border-[var(--line)] bg-transparent text-[var(--ink-muted)] hover:border-[var(--sage-dark)]"
                  }`}
                >
                  {n === 0 ? "Solo yo" : `+${n}`}
                </button>
              ))}
            </div>
          )}
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
