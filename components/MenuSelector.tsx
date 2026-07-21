"use client"

import { useState } from "react"

const OPTIONS = [
  "Vegetariano",
  "Vegano",
  "Sin gluten",
  "Sin lactosa",
  "Alergia a frutos secos",
  "Alergia a mariscos",
  "Alergia al huevo",
  "Ninguna"
]

interface Props {
  currentRestrictions: string[]
  onSubmit: (restrictions: string[]) => Promise<void>
}

export function MenuSelector({ currentRestrictions, onSubmit }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set(currentRestrictions))
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function toggle(option: string) {
    const next = new Set(selected)
    if (next.has(option)) next.delete(option)
    else next.add(option)
    setSelected(next)
  }

  async function handleSave() {
    setLoading(true)
    await onSubmit(Array.from(selected))
    setLoading(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--sage-dark)]">Mesa</p>
        <h2 className="font-display text-3xl text-[var(--foreground)]">Preferencias del menú</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--ink-muted)]">Selecciona cualquier restricción o preferencia que debamos considerar.</p>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => toggle(option)}
            className={`border px-3 py-3 text-left text-sm transition-all ${
              selected.has(option)
                ? "border-[var(--sage-dark)] bg-[var(--sage)]/10 text-[var(--sage-dark)]"
                : "border-[var(--line)] bg-transparent text-[var(--ink-muted)] hover:border-[var(--sage-dark)]"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="border border-[var(--foreground)] bg-[var(--foreground)] px-5 py-2 text-sm font-medium text-[var(--cream)] transition-colors hover:bg-[var(--sage-dark)] disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Guardar preferencias"}
        </button>
        {success && <span className="text-sm font-medium text-[var(--sage-dark)]">Guardado</span>}
      </div>
    </div>
  )
}
