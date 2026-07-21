import type { WeddingData } from "@/types/guest"

export function InvitationCard({ wedding }: { wedding: WeddingData | null }) {
  if (!wedding) {
    return (
      <div className="text-center py-12 text-gray-500">
        Datos de la boda no disponibles.
      </div>
    )
  }

  const hasCover = !!wedding.fotoPortada

  return (
    <div className="w-full max-w-lg mx-auto overflow-hidden rounded-2xl bg-white shadow-lg">
      {hasCover && (
        <div className="relative w-full h-64 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={wedding.fotoPortada!}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      )}

      <div className="px-8 py-10 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-rose-500 mb-3 font-medium">
          ¡Nos casamos!
        </p>

        <h1 className="text-3xl md:text-4xl font-light text-gray-800 mb-1 leading-tight">
          {wedding.nombreNovia}
        </h1>
        <p className="text-lg text-rose-400 mb-1">&</p>
        <h1 className="text-3xl md:text-4xl font-light text-gray-800 mb-8 leading-tight">
          {wedding.nombreNovio}
        </h1>

        <div className="space-y-3 text-gray-600 mb-8">
          {wedding.fecha && (
            <div className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              <span>
                {new Date(wedding.fecha + "T00:00:00").toLocaleDateString(
                  "es-CL",
                  { weekday: "long", year: "numeric", month: "long", day: "numeric" }
                )}
              </span>
            </div>
          )}

          <div className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{wedding.hora}</span>
          </div>

          <div className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <span>{wedding.lugar}</span>
          </div>

          {wedding.direccion && (
            <p className="text-sm text-gray-400">{wedding.direccion}</p>
          )}
        </div>

        {wedding.dressCode && (
          <p className="text-sm text-gray-500 mb-4">
            <span className="font-medium">Dress code:</span> {wedding.dressCode}
          </p>
        )}

        {wedding.mensaje && (
          <div className="border-t border-rose-100 pt-6 mt-6">
            <p className="text-gray-600 italic leading-relaxed">{wedding.mensaje}</p>
          </div>
        )}

        {wedding.urlMapa && (
          <a
            href={wedding.urlMapa}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 text-sm text-rose-500 hover:text-rose-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
            </svg>
            Ver mapa
          </a>
        )}
      </div>
    </div>
  )
}
