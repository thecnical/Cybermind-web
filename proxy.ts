/**
 * Next.js 16 Proxy — server-side route protection
 * (renamed from middleware.ts — Next.js 16 uses "proxy" convention)
 *
 * IMPORTANT: Only protects /admin/* at the edge.
 * /dashboard/* is protected client-side by DashboardLayout (AuthProvider).
 *
 * Why: Supabase stores sessions in localStorage by default.
 * The edge proxy can only read cookies. If we protect /dashboard here,
 * it redirects users to login even when they ARE logged in (session in
 * localStorage but not in cookies → proxy sees no session → redirect loop).
 *
 * The dashboard layout already handles auth correctly client-side.
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect admin routes at the edge
  // Dashboard is protected client-side by DashboardLayout
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const supabaseUrl     = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next();
  }

  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() { return request.cookies.getAll(); },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  // Only run on admin routes — dashboard is protected client-side
  matcher: ["/admin/:path*"],
};
