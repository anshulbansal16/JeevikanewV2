import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define protected routes
  const protectedRoutes = [
    "/dashboard",
    "/bmi-analysis",
    "/health-assistant",
    "/health-records",
    "/doctor-consultation",
    "/ai-health-analysis",
    "/health-metrics",
    "/emergency-alerts",
  ]

  // Check if the path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))

  // For protected routes, let the page component handle auth validation
  if (isProtectedRoute) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/bmi-analysis/:path*",
    "/health-assistant/:path*",
    "/health-records/:path*",
    "/doctor-consultation/:path*",
    "/ai-health-analysis/:path*",
    "/health-metrics/:path*",
    "/emergency-alerts/:path*",
    "/signin",
    "/register",
  ],
}
