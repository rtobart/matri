"use client"

import { useState } from "react"
import type { AttendanceStatus } from "@/types/guest"

interface Props {
  guestId: string
  currentStatus: string
  maxGuests: number
  onSubmit: (data: { status: AttendanceStatus; confirmedGuests: number }) => Promise<void>
}

export function AttendanceForm({ guestId, currentStatus, maxGuests, onSubmit }: Props) {
  const [status, setStatus] = useState<AttendanceStatus>("Confirmado")
  const [confirmedGuests, setConfirmedGuests] = useState(0)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await onSubmit({ status, confirmedGuests })
    setLoading(false)
    setSuccess(true)
  }

  if (success && currentStatus === "Por Enviar") {
    return (
      <div className="text-center py-6 px-4 bg-green-50 rounded-xl border border-green-200">
        <svg className="w-10 h-10 text-green-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-green-700 font-medium">Confirmación guardada</p>
        <p className="text-green-600 text-sm mt-1">Gracias por confirmar tu asistencia.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-lg font-medium text-gray-800">¿Asistirás?</h2>

      <div className="grid grid-cols-3 gap-3">
        {(["Confirmado", "Tal vez", "Declinado"] as AttendanceStatus[]).map(
          (option) => (
            <button
              key={option}
              type="button"
              onClick={() => setStatus(option)}
              className={`py-3 px-4 rounded-xl text-sm font-medium transition-all border-2 ${
                status === option
                  ? option === "Confirmado"
                    ? "border-green-400 bg-green-50 text-green-700"
                    : option === "Tal vez"
                      ? "border-yellow-400 bg-yellow-50 text-yellow-700"
                      : "border-red-400 bg-red-50 text-red-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              {option === "Confirmado" ? "Sí, voy!" : option === "Tal vez" ? "Tal vez" : "No puedo"}
            </button>
          )
        )}
      </div>

      {status !== "Declinado" && maxGuests > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ¿Cuántos te acompañan? (máx. {maxGuests})
          </label>
          <input
            type="number"
            min={0}
            max={maxGuests}
            value={confirmedGuests}
            onChange={(e) => setConfirmedGuests(parseInt(e.target.value) || 0)}
            className="w-24 px-3 py-2 rounded-lg border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-300"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-6 rounded-xl bg-rose-500 text-white font-medium hover:bg-rose-600 transition-colors disabled:opacity-50"
      >
        {loading ? "Guardando..." : "Confirmar asistencia"}
      </button>
    </form>
  )
}
