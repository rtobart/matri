import { Client } from "@notionhq/client"
import type {
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints/common"
import type { GuestData, WeddingData, GiftOption } from "@/types/guest"

const notion = new Client({ auth: process.env.NOTION_TOKEN })
const WEDDING_PAGE = process.env.NOTION_WEDDING_PAGE_ID!

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractRichText(prop: any): string {
  return prop?.rich_text?.map((t: { plain_text?: string }) => t.plain_text ?? "").join("") ?? ""
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractTitle(prop: any): string {
  return prop?.title?.map((t: { plain_text?: string }) => t.plain_text ?? "").join("") ?? ""
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractStatus(prop: any): string {
  return prop?.status?.name ?? ""
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractNumber(prop: any): number | null {
  return prop?.number ?? null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractMultiSelect(prop: any): string[] {
  return prop?.multi_select?.map((o: { name?: string }) => o.name ?? "") ?? []
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractEmail(prop: any): string | null {
  return prop?.email ?? null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractPhone(prop: any): string | null {
  return prop?.phone_number ?? null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractDate(prop: any): string | null {
  return prop?.date?.start ?? null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractUrl(prop: any): string | null {
  return prop?.url ?? null
}

async function getComments(id: string): Promise<string[]> {
  try {
    const res = await fetch(
      `https://api.notion.com/v1/comments?block_id=${id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
          "Notion-Version": "2022-06-28",
        },
      }
    )
    const data = await res.json()
    const names: string[] = []
    for (const comment of data.results || []) {
      const text = (comment.rich_text || [])
        .map((t: { plain_text?: string }) => t.plain_text ?? "")
        .join("")
        .trim()
      if (text) names.push(text)
    }
    return names
  } catch {
    return []
  }
}

export async function getGuest(id: string): Promise<GuestData | null> {
  try {
    const response = await notion.pages.retrieve({ page_id: id })

    if (!("properties" in response)) return null

    const props = (response as PageObjectResponse).properties

    return {
      id: response.id,
      name: extractTitle(props["Nombre"]),
      email: extractEmail(props["Email"]),
      phone: extractPhone(props["Teléfono"]),
      status: extractStatus(props["Estado de confirmación"]),
      maxGuests: extractNumber(props["Número de acompañantes"]) ?? 0,
      confirmedGuests: extractNumber(props["acompañantes confirmados"]),
      companionNames: await getComments(response.id),
      dietaryRestrictions: extractMultiSelect(props["Restricciones alimentarias"]),
      gift: extractNumber(props["Regalo"]),
    }
  } catch {
    return null
  }
}

// Cualquier comilla recta o tipográfica: " " " '
const QUOTE = /["\u201C\u201D\u2018\u2019]/

function parseGiftOptions(text: string): GiftOption[] {
  const options: GiftOption[] = []
  const segments = text.split(";")
  for (const seg of segments) {
    const trimmed = seg.trim()
    const commaIdx = trimmed.indexOf(",")
    if (commaIdx > 0) {
      const amount = parseInt(trimmed.slice(0, commaIdx))
      const rest = trimmed.slice(commaIdx + 1).trim()
      // quitar comillas de apertura y cierre de cualquier tipo
      const label = rest.replace(new RegExp(`^${QUOTE.source}+|${QUOTE.source}+$`, "gu"), "").trim()
      if (!isNaN(amount) && amount > 0 && label) {
        options.push({ amount, label })
        continue
      }
    }
    // fallback: solo numero sin etiqueta
    const n = parseInt(trimmed)
    if (!isNaN(n) && n > 0) options.push({ amount: n, label: `$${n.toLocaleString("es-CL")}` })
  }
  return options
}

export async function getWeddingInfo(): Promise<WeddingData | null> {
  try {
    const res = await fetch(
      `https://api.notion.com/v1/pages/${WEDDING_PAGE}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
          "Notion-Version": "2022-06-28",
        },
        next: { revalidate: 3600 },
      }
    )

    if (!res.ok) return null

    const response = await res.json()

    if (!("properties" in (response as Record<string, unknown>))) return null

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const props = (response as any).properties

    return {
      nombreNovio: extractRichText(props["Nombre Novio"]),
      nombreNovia: extractRichText(props["Nombre Novia"]),
      fecha: extractDate(props["Fecha"]),
      hora: extractRichText(props["Hora"]),
      lugar: extractRichText(props["Lugar"]),
      direccion: extractRichText(props["Dirección"]),
      dressCode: extractRichText(props["Dress Code"]),
      mensaje: extractRichText(props["Mensaje"]),
      urlMapa: extractUrl(props["URL Mapa"]),
      fotoPortada: extractUrl(props["Foto Portada"]),
      montosRegalo: parseGiftOptions(extractRichText(props["Montos Regalo"])),
    }
  } catch {
    return null
  }
}

export async function updateGuest(
  id: string,
  data: {
    status?: string
    confirmedGuests?: number
    dietaryRestrictions?: string[]
    gift?: number
  }
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const properties: Record<string, any> = {}

  if (data.status !== undefined) {
    properties["Estado de confirmación"] = { status: { name: data.status } }
  }

  if (data.confirmedGuests !== undefined) {
    properties["acompañantes confirmados"] = { number: data.confirmedGuests }
  }

  if (data.dietaryRestrictions !== undefined) {
    properties["Restricciones alimentarias"] = {
      multi_select: data.dietaryRestrictions.map((name) => ({ name })),
    }
  }

  if (data.gift !== undefined) {
    properties["Regalo"] = { number: data.gift }
  }

  const res = await fetch(`https://api.notion.com/v1/pages/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ properties }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(
      `Notion update failed: ${(err as { message?: string }).message || res.statusText}`
    )
  }
}

export async function listAllGuests(): Promise<GuestData[]> {
  let all: GuestData[] = []
  let hasMore = true
  let cursor: string | null = null

  while (hasMore) {
    const body: Record<string, unknown> = {
      page_size: 100,
      sorts: [{ property: "Nombre", direction: "ascending" }],
    }
    if (cursor) body.start_cursor = cursor

    const res = await fetch(
      `https://api.notion.com/v1/databases/${process.env.NOTION_GUESTS_DB_ID}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    )

    const data = await res.json()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const page of data.results as any[]) {
      const props = page.properties as Record<string, unknown>
      all.push({
        id: page.id,
        name: extractTitle(props["Nombre"]),
        email: extractEmail(props["Email"]),
        phone: extractPhone(props["Teléfono"]),
        status: extractStatus(props["Estado de confirmación"]),
        maxGuests: extractNumber(props["Número de acompañantes"]) ?? 0,
        confirmedGuests: extractNumber(props["acompañantes confirmados"]),
        companionNames: [],
        dietaryRestrictions: extractMultiSelect(props["Restricciones alimentarias"]),
        gift: extractNumber(props["Regalo"]),
      })
    }

    hasMore = data.has_more === true
    cursor = data.next_cursor ?? null
  }

  return all
}

export async function updateGuestGift(id: string, amount: number): Promise<void> {
  const res = await fetch(`https://api.notion.com/v1/pages/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      properties: {
        Regalo: { number: amount },
      },
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(
      `Notion update failed: ${(err as { message?: string }).message || res.statusText}`
    )
  }
}
