"use server"

import { cookies } from "next/headers"

export async function adminLogin(password: string): Promise<boolean> {
  if (password === process.env.ADMIN_PASSWORD) {
    const cookieStore = await cookies()
    cookieStore.set("admin_token", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 horas
    })
    return true
  }
  return false
}
