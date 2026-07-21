import { InvitationCard } from "@/components/InvitationCard"
import { getWeddingInfo } from "@/lib/notion"

export default async function Home() {
  const wedding = await getWeddingInfo()

  return (
    <main className="invitation-shell min-h-screen px-5 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <InvitationCard wedding={wedding} showMessage />
      </div>
    </main>
  )
}
