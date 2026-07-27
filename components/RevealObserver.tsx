"use client"

import { useEffect } from "react"

/**
 * Intersection Observer fallback para navegadores que no soportan
 * animation-timeline: view() (Firefox, Safari <18, etc.).
 *
 * Busca todos los elementos con [data-reveal] y les aplica
 * la animación cuando entran al viewport.
 */
export function RevealObserver() {
  useEffect(() => {
    // Solo activar si el navegador NO soporta animation-timeline: view()
    const supports = CSS.supports("animation-timeline: view()")
    if (supports) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement
            el.classList.remove("js-reveal-hidden")
            el.classList.add("js-reveal-visible")
            observer.unobserve(el)
          }
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -40px 0px" }
    )

    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return null // no renderiza nada
}
