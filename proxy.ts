import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ROOT_DOMAIN = "srng.no";
const DEV_ROOT_DOMAIN = "localhost:3000";
const ROOT_HOSTS = new Set([`www.${ROOT_DOMAIN}`, ROOT_DOMAIN, DEV_ROOT_DOMAIN]);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const host = request.headers.get("host") ?? "";

  if (ROOT_HOSTS.has(host)) {
    return NextResponse.next();
  }

  let normalizedHost = "";

  if (host.endsWith(`.${ROOT_DOMAIN}`)) {
    normalizedHost = host.slice(0, -`.${ROOT_DOMAIN}`.length);
  }

  if (host.endsWith(`.${DEV_ROOT_DOMAIN}`)) {
    normalizedHost = host.slice(0, -`.${DEV_ROOT_DOMAIN}`.length);
  }

  if (!normalizedHost) {
    return NextResponse.next();
  }

  const rewrittenUrl = request.nextUrl.clone();
  rewrittenUrl.pathname = `/s/${normalizedHost}${pathname}`;

  return NextResponse.rewrite(rewrittenUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
