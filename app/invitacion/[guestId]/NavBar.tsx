"use client"

import { useState } from "react"

const LINKS = [
  { href: "#detalles", label: "Detalles" },
  { href: "#rsvp",     label: "RSVP" },
  { href: "#menu",     label: "Menú" },
  { href: "#regalos",  label: "Regalos" },
]

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false)

  function close() { setIsOpen(false) }

  return (
    <nav className="sticky top-0 z-10 bg-[var(--background)] border-b border-[var(--line)]">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5 text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--ink-muted)] sm:px-8">
        <a href="#inicio" onClick={close} className="font-display text-lg normal-case tracking-normal text-[var(--foreground)]">
          N &amp; R
        </a>

        {/* Desktop links */}
        <div className="hidden gap-6 sm:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-[var(--sage-dark)]">
              {l.label}
            </a>
          ))}
        </div>

        {/* Hamburger button — mobile only */}
        <button
          type="button"
          onClick={() => setIsOpen((o) => !o)}
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          className="flex h-8 w-8 flex-col items-center justify-center gap-1.5 sm:hidden"
        >
          {isOpen ? (
            /* X icon */
            <svg className="h-5 w-5 text-[var(--foreground)]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" d="M4 4l12 12M16 4L4 16" />
            </svg>
          ) : (
            /* Hamburger icon */
            <svg className="h-5 w-5 text-[var(--foreground)]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" d="M3 5h14M3 10h14M3 15h14" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {isOpen && (
        <div className="border-t border-[var(--line)] sm:hidden">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={close}
              className="block px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--ink-muted)] transition-colors hover:text-[var(--sage-dark)]"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}
