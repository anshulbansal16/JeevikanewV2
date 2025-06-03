import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { EmergencyAlertWidget } from "@/components/emergency-alert-widget"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Jeevika Health App",
  description: "Your personal health companion",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <EmergencyAlertWidget />
      </body>
    </html>
  )
}
