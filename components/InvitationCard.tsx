import type { WeddingData } from "@/types/guest"

function formatDate(value: string | null) {
  if (!value) return ""
  return new Date(value + "T00:00:00").toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

export function InvitationCard({ wedding, showMessage = false }: { wedding: WeddingData | null; showMessage?: boolean }) {
  if (!wedding) {
    return (
      <div className="py-20 text-center text-[var(--ink-muted)]">
        Datos de la boda no disponibles.
      </div>
    )
  }

  return (
    <section id="inicio" className="animate-reveal relative flex min-h-[calc(100svh-5rem)] flex-col items-center justify-center py-20 text-center">
      <p className="mb-8 text-[11px] font-semibold uppercase tracking-[0.42em] text-[var(--sage-dark)]">
        ¡Nos casamos!
      </p>

      <div className="mb-7 flex items-center gap-5 text-[var(--clay)]">
        <span className="h-px w-16 bg-[var(--clay)]/50 sm:w-24" />
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--clay)]" />
        <span className="h-px w-16 bg-[var(--clay)]/50 sm:w-24" />
      </div>

      <h1 className="font-display text-[clamp(3rem,8vw,4rem)] font-normal leading-[0.9] tracking-[-0.055em] text-[var(--foreground)]">
        {wedding.nombreNovia}
        <span className="my-4 block text-[clamp(1.5rem,4vw,2.5rem)] italic tracking-normal text-[var(--clay)]">&amp;</span>
        {wedding.nombreNovio}
      </h1>

      <div className=" flex w-full justify-center sm:mt-8">
        {/* La ilustración conserva su transparencia para integrarse con el fondo del Hero. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/novios.svg"
          alt="Ilustración de los novios"
          className="h-auto w-[min(82vw,22rem)] object-contain mix-blend-multiply sm:w-[min(58vw,26rem)]"
        />
      </div>

      {showMessage && wedding.mensaje && (
        <p className="mx-auto mt-12 max-w-xl font-display text-xl italic leading-relaxed text-[var(--ink-muted)] sm:text-2xl">
          {wedding.mensaje}
        </p>
      )}
      {wedding.direccion && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm text-[var(--ink-muted)]">
          {wedding.urlMapa && (
            <a
              href={wedding.urlMapa}
              target="_blank"
              rel="noreferrer"
              aria-label="Abrir ubicación en el mapa"
              className="inline-flex items-center gap-1.5 text-[var(--sage-dark)] transition-colors hover:text-[var(--clay)]"
            >
              <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">Ver mapa</span>
            </a>
          )}
        </div>
      )}

    </section>
  )
}
