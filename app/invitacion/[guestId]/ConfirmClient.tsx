"use client"

import { AttendanceForm } from "@/components/AttendanceForm"
import type { AttendanceStatus } from "@/types/guest"

interface Props {
  currentStatus: string
  maxGuests: number
  confirmedGuests: number | null
  confirmAttendance: (data: {
    status: AttendanceStatus
    confirmedGuests: number
    dietaryRestrictions?: string[]
  }) => Promise<void>
}

export default function ConfirmClient({
  currentStatus,
  maxGuests,
  confirmedGuests,
  confirmAttendance,
}: Props) {
  return (
    <AttendanceForm
      currentStatus={currentStatus}
      maxGuests={maxGuests}
      confirmedGuests={confirmedGuests}
      onSubmit={confirmAttendance}
    />
  )
}
