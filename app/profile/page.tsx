import { Suspense } from "react"
import { Sidebar } from "@/components/sidebar"
import { Breadcrumb } from "@/components/breadcrumb"
import { ProfileContent } from "@/components/profile-content"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Profile", href: "/profile" },
            ]}
          />
          <Suspense fallback={<div className="text-white">Loading profile...</div>}>
            <ProfileContent />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
