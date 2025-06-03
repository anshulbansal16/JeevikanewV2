import { Sidebar } from "@/components/sidebar"
import { BMIAnalysisContent } from "@/components/bmi-analysis-content"
import { Breadcrumb } from "@/components/breadcrumb"
import { getUser } from "@/app/actions/auth"
import { redirect } from "next/navigation"

export default async function BMIAnalysisPage() {
  const user = await getUser()

  if (!user) {
    redirect("/signin")
  }

  return (
    <div className="min-h-screen bg-slate-900 flex">
      <Sidebar />
      <div className="flex-1">
        <Breadcrumb />
        <BMIAnalysisContent />
      </div>
    </div>
  )
}
