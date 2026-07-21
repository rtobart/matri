"use client"

import { useState } from "react"
import type { GuestData } from "@/types/guest"

const BASE_URL =
  typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.host}`
    : ""

export default function AdminTable({ guests }: { guests: GuestData[] }) {
  const [search, setSearch] = useState("")
  const [copied, setCopied] = useState<string | null>(null)

  const filtered = guests.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  )

  async function copyLink(guestId: string) {
    const url = `${BASE_URL}/invitacion/${guestId}`
    await navigator.clipboard.writeText(url)
    setCopied(guestId)
    setTimeout(() => setCopied(null), 1500)
  }

  async function copyAll() {
    const links = guests.map((g) => `${BASE_URL}/invitacion/${g.id}`).join("\n")
    await navigator.clipboard.writeText(links)
    setCopied("all")
    setTimeout(() => setCopied(null), 1500)
  }

  const statusColor: Record<string, string> = {
    "Por Enviar": "bg-orange-100 text-orange-700",
    Pendiente: "bg-gray-100 text-gray-600",
    "Tal vez": "bg-yellow-100 text-yellow-700",
    Confirmado: "bg-green-100 text-green-700",
    Declinado: "bg-red-100 text-red-700",
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Buscar invitado..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 max-w-xs px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-300"
        />
        <button
          onClick={copyAll}
          className="px-4 py-2 rounded-lg bg-stone-200 text-stone-700 text-sm font-medium hover:bg-stone-300 transition-colors"
        >
          {copied === "all" ? "¡Copiado!" : "Copiar todos"}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 text-left text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Conf. / Máx.</th>
                <th className="px-4 py-3 font-medium">Restricciones</th>
                <th className="px-4 py-3 font-medium">Regalo</th>
                <th className="px-4 py-3 font-medium">Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((guest) => (
                <tr
                  key={guest.id}
                  className="hover:bg-rose-50/30 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {guest.name}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        statusColor[guest.status] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {guest.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {guest.confirmedGuests !== null ? guest.confirmedGuests : "-"} / {guest.maxGuests}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    <div className="flex flex-wrap gap-1">
                      {guest.dietaryRestrictions.length > 0
                        ? guest.dietaryRestrictions.map((r) => (
                            <span
                              key={r}
                              className="inline-block px-1.5 py-0.5 rounded bg-stone-100 text-xs"
                            >
                              {r}
                            </span>
                          ))
                        : "-"}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {guest.gift !== null && guest.gift > 0 ? (
                      <span className="text-green-600 font-medium">
                        ${guest.gift.toLocaleString("es-CL")}
                      </span>
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => copyLink(guest.id)}
                      className="text-xs px-2 py-1 rounded bg-stone-100 text-stone-600 hover:bg-rose-100 hover:text-rose-700 transition-colors"
                    >
                      {copied === guest.id ? "Copiado!" : "Copiar link"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
