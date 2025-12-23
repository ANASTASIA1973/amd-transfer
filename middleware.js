import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Leite /legal/en/* und /legal/ar/* immer auf /legal/de/* um
  if (pathname.startsWith("/legal/en/") || pathname.startsWith("/legal/ar/")) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.replace(/^\/legal\/(en|ar)\//, "/legal/de/");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
