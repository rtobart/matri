import { cookies } from "next/headers"
import { listAllGuests } from "@/lib/notion"
import AdminTable from "./AdminTable"
import { AdminLogin } from "./AdminLogin"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")?.value

  if (token !== "authenticated") {
    return <AdminLogin />
  }

  const guests = await listAllGuests()

  return (
    <div className="min-h-screen bg-stone-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-medium text-gray-800">
              Lista de Invitados
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {guests.length} invitados · Cada link es único y privado
            </p>
          </div>
          <div className="flex gap-2">
            <span className="text-sm text-gray-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              {guests.filter((g) => g.status === "Confirmado").length} confirmados
            </span>
            <span className="text-sm text-gray-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              {guests.filter((g) => g.status === "Tal vez").length} tal vez
            </span>
            <span className="text-sm text-gray-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              {guests.filter((g) => g.status === "Declinado").length} declinados
            </span>
            <span className="text-sm text-gray-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-400" />
              {guests.filter((g) => g.status === "Por Enviar").length} pendientes
            </span>
          </div>
        </div>

        <AdminTable guests={guests} />
      </div>
    </div>
  )
}
