"use client"

import { AttendanceForm } from "@/components/AttendanceForm"
import type { AttendanceStatus } from "@/types/guest"

interface Props {
  guestId: string
  currentStatus: string
  maxGuests: number
  confirmAttendance: (data: {
    status: AttendanceStatus
    confirmedGuests: number
    dietaryRestrictions?: string[]
  }) => Promise<void>
}

export default function ConfirmClient({
  guestId,
  currentStatus,
  maxGuests,
  confirmAttendance,
}: Props) {
  return (
    <AttendanceForm
      guestId={guestId}
      currentStatus={currentStatus}
      maxGuests={maxGuests}
      onSubmit={confirmAttendance}
    />
  )
}
