import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define protected routes
  const protectedRoutes = [
    "/dashboard",
    "/health-metrics",
    "/health-records",
    "/bmi-analysis",
    "/ai-health-analysis",
    "/doctor-consultation",
    "/health-assistant",
    "/profile",
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
    "/health-metrics/:path*",
    "/health-records/:path*",
    "/bmi-analysis/:path*",
    "/ai-health-analysis/:path*",
    "/doctor-consultation/:path*",
    "/health-assistant/:path*",
    "/profile/:path*",
    "/signin",
    "/register",
  ],
}
