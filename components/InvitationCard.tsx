import type { WeddingData } from "@/types/guest"

function formatDate(value: string | null) {
  if (!value) return ""
  return new Date(value + "T00:00:00").toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

export function InvitationCard({ wedding }: { wedding: WeddingData | null }) {
  if (!wedding) {
    return (
      <div className="py-20 text-center text-[var(--ink-muted)]">
        Datos de la boda no disponibles.
      </div>
    )
  }

  return (
    <section id="inicio" className="relative flex min-h-[calc(100svh-5rem)] flex-col items-center justify-center py-20 text-center">
      <p className="mb-8 text-[11px] font-semibold uppercase tracking-[0.42em] text-[var(--sage-dark)]">
        Nuestra celebración
      </p>

      <div className="mb-7 flex items-center gap-5 text-[var(--clay)]">
        <span className="h-px w-16 bg-[var(--clay)]/50 sm:w-24" />
        <svg aria-hidden="true" className="h-8 w-8" viewBox="0 0 48 48" fill="none">
          <path d="M24 39S7 29.6 7 17.8C7 11.8 11.3 8 16.6 8c3.3 0 6 1.6 7.4 4.2C25.4 9.6 28.1 8 31.4 8 36.7 8 41 11.8 41 17.8 41 29.6 24 39 24 39Z" stroke="currentColor" strokeWidth="1.3" />
          <path d="M24 12v22M17 20c2.1 1.2 4.4 1.5 7 1M31 20c-2.1 1.2-4.4 1.5-7 1" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
        </svg>
        <span className="h-px w-16 bg-[var(--clay)]/50 sm:w-24" />
      </div>

      <h1 className="font-display text-[clamp(3.6rem,12vw,7.8rem)] font-normal leading-[0.82] tracking-[-0.065em] text-[var(--foreground)]">
        {wedding.nombreNovia}
        <span className="my-4 block text-[clamp(1.5rem,4vw,2.5rem)] italic tracking-normal text-[var(--clay)]">&amp;</span>
        {wedding.nombreNovio}
      </h1>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-3 text-xs uppercase tracking-[0.26em] text-[var(--ink-muted)]">
        <span>{formatDate(wedding.fecha)}</span>
        <span className="text-[var(--clay)]">·</span>
        <span>{wedding.hora}</span>
        <span className="text-[var(--clay)]">·</span>
        <span>{wedding.lugar}</span>
      </div>

      {wedding.fotoPortada ? (
        <div className="mt-14 h-52 w-36 overflow-hidden rounded-[7rem] border border-[var(--sage)]/60 p-2 sm:h-64 sm:w-44">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={wedding.fotoPortada} alt="" className="h-full w-full rounded-[6rem] object-cover" />
        </div>
      ) : (
        <div className="mt-14 flex h-24 items-center gap-3 text-[var(--sage)]/70">
          <span className="h-px w-20 bg-[var(--sage)]/50" />
          <svg aria-hidden="true" className="h-12 w-12" viewBox="0 0 64 64" fill="none">
            <path d="M32 57C29 42 20 32 8 28M32 57C35 42 44 32 56 28M32 57V9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M25 45c-7-1-11-4-14-10M39 45c7-1 11-4 14-10M24 31c-5-1-8-3-10-7M40 31c5-1 8-3 10-7M32 22c-4-2-6-5-6-9M32 22c4-2 6-5 6-9" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
          </svg>
          <span className="h-px w-20 bg-[var(--sage)]/50" />
        </div>
      )}

      {wedding.dressCode && <p className="mt-10 text-xs uppercase tracking-[0.28em] text-[var(--ink-muted)]">Vestimenta · {wedding.dressCode}</p>}
    </section>
  )
}
