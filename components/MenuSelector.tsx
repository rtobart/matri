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
  "Kosher",
  "Halal",
]

interface Props {
  currentRestrictions: string[]
  onSubmit: (restrictions: string[]) => Promise<void>
}

export function MenuSelector({ currentRestrictions, onSubmit }: Props) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(currentRestrictions)
  )
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function toggle(option: string) {
    const next = new Set(selected)
    if (next.has(option)) {
      next.delete(option)
    } else {
      next.add(option)
    }
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
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-gray-800">
        Restricciones alimentarias
      </h2>

      <div className="flex flex-wrap gap-2">
        {OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => toggle(option)}
            className={`px-3 py-1.5 rounded-full text-sm transition-all border ${
              selected.has(option)
                ? "border-rose-300 bg-rose-50 text-rose-700"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="py-2 px-5 rounded-lg bg-rose-500 text-white text-sm font-medium hover:bg-rose-600 transition-colors disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Guardar preferencias"}
        </button>
        {success && (
          <span className="text-sm text-green-600 font-medium">
            Guardado
          </span>
        )}
      </div>
    </div>
  )
}
