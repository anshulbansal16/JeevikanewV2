import type { Metadata } from "next"
import { HealthMetricsContent } from "@/components/health-metrics-content"

export const metadata: Metadata = {
  title: "Health Metrics Tracking | Jeevika Health",
  description: "Track and visualize your health metrics over time with interactive charts and trend analysis.",
}

export default function HealthMetricsPage() {
  const user = { name: "Aarav Sharma", email: "aarav.sharma@email.com" }

  return <HealthMetricsContent user={user} />
}
