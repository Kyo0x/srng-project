import { auth } from "@/auth";
import { NextResponse } from "next/server";

type Handler = (
  request: Request,
  context?: { params?: Record<string, string> }
) => Promise<NextResponse>;

export function withAuth(handler: Handler): Handler {
  return async (request, context) => {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return handler(request, context);
  };
}

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function withRateLimit(handler: Handler, maxRequests = 100, windowMs = 60000): Handler {
  return async (request, context) => {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const entry = rateLimitStore.get(ip);

    if (entry) {
      if (now > entry.resetAt) {
        rateLimitStore.set(ip, { count: 1, resetAt: now + windowMs });
      } else if (entry.count >= maxRequests) {
        return NextResponse.json({ error: "Too many requests" }, { status: 429 });
      } else {
        entry.count++;
      }
    } else {
      rateLimitStore.set(ip, { count: 1, resetAt: now + windowMs });
    }

    return handler(request, context);
  };
}

export async function parseBody(request: Request, requiredFields: string[]) {
  try {
    const body = await request.json();
    const missing = requiredFields.filter(field => body[field] == null);
    if (missing.length > 0) {
      return { ok: false as const, error: `Missing fields: ${missing.join(", ")}` };
    }
    return { ok: true as const, body };
  } catch {
    return { ok: false as const, error: "Invalid JSON body" };
  }
}

export const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_APP_URL || "",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export function handleCors(request: Request) {
  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers: corsHeaders });
  }
  return null;
}
