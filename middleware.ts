import { NextRequest, NextResponse } from "next/server";
import { isLocale } from "./src/lib/i18n";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (pathname === "/") return NextResponse.redirect(new URL(`/en${search}`, request.url));

  const segment = pathname.split("/")[1];
  if (!isLocale(segment)) {
    const rememberedLocale = request.cookies.get("route-locale")?.value;
    const locale = isLocale(rememberedLocale) ? rememberedLocale : "en";
    return NextResponse.redirect(new URL(`/${locale}${pathname}${search}`, request.url));
  }

  const internalPath = pathname.slice(segment.length + 1) || "/";
  const headers = new Headers(request.headers);
  headers.set("x-route-locale", segment);
  const url = request.nextUrl.clone();
  url.pathname = internalPath;
  const response = NextResponse.rewrite(url, { request: { headers } });
  response.cookies.set("route-locale", segment, { path: "/", sameSite: "lax" });
  return response;
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|gym_logo.png|images/|cvs/).*)"],
};
