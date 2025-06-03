import { Sidebar } from "@/components/sidebar"
import { DashboardContent } from "@/components/dashboard-content"
import { Breadcrumb } from "@/components/breadcrumb"
import { getUser } from "@/app/actions/auth"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const user = await getUser()

  if (!user) {
    redirect("/signin")
  }

  return (
    <div className="min-h-screen bg-slate-900 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Breadcrumb />
        <DashboardContent user={user} />
      </div>
    </div>
  )
}
