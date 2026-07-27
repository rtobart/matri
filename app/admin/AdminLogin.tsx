"use client"

import { useState } from "react"
import { adminLogin } from "./actions"

export function AdminLogin() {
  const [input, setInput] = useState("")
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const ok = await adminLogin(input)
    if (ok) {
      window.location.reload()
    } else {
      setError(true)
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 rounded-xl bg-white p-8 shadow-sm border border-gray-100 text-center">
        <h1 className="text-xl font-medium text-gray-800">Admin</h1>
        <p className="text-sm text-gray-500">Ingresá la contraseña para continuar</p>
        <input
          type="password"
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(false) }}
          placeholder="Contraseña"
          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-center text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-300"
          autoFocus
        />
        {error && <p className="text-sm text-red-500">Contraseña incorrecta</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-stone-800 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-700 disabled:opacity-50"
        >
          {loading ? "Verificando..." : "Ingresar"}
        </button>
      </form>
    </div>
  )
}
