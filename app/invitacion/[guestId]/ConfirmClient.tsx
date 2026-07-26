"use client"

import { AttendanceForm } from "@/components/AttendanceForm"
import type { AttendanceStatus } from "@/types/guest"

interface Props {
  currentStatus: string
  maxGuests: number
  confirmedGuests: number | null
  guestName: string
  companionNames: string[]
  confirmedCompanionNames: string[]
  confirmAttendance: (data: {
    status: AttendanceStatus
    confirmedGuests: number
    confirmedCompanionNames?: string[]
  }) => Promise<void>
}

export default function ConfirmClient({
  currentStatus,
  maxGuests,
  confirmedGuests,
  guestName,
  companionNames,
  confirmedCompanionNames,
  confirmAttendance,
}: Props) {
  return (
    <AttendanceForm
      currentStatus={currentStatus}
      maxGuests={maxGuests}
      confirmedGuests={confirmedGuests}
      guestName={guestName}
      companionNames={companionNames}
      confirmedCompanionNames={confirmedCompanionNames}
      onSubmit={confirmAttendance}
    />
  )
}
