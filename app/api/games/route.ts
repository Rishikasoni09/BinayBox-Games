import { NextRequest, NextResponse } from "next/server";
import { getGameProvider } from "@/lib/games";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { sanitizeSearchQuery } from "@/lib/security/sanitize";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "anonymous-client";
    const rateCheck = checkRateLimit(ip, { limit: 120, windowMs: 60 * 1000 });

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        {
          status: 429,
          headers: {
            "Retry-After": rateCheck.reset.toString(),
          },
        }
      );
    }

    const { searchParams } = new URL(request.url);
    const category = sanitizeSearchQuery(searchParams.get("category") || "");
    const tag = sanitizeSearchQuery(searchParams.get("tag") || "");
    const query = sanitizeSearchQuery(searchParams.get("q") || "");
    const sort = searchParams.get("sort") as any;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const featured = searchParams.has("featured")
      ? searchParams.get("featured") === "true"
      : undefined;
    const trending = searchParams.has("trending")
      ? searchParams.get("trending") === "true"
      : undefined;

    const provider = getGameProvider();
    const result = await provider.getGames({
      category: category || undefined,
      tag: tag || undefined,
      query: query || undefined,
      sort,
      page: isNaN(page) ? 1 : page,
      limit: isNaN(limit) ? 12 : limit,
      featured,
      trending,
    });

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("API /api/games error:", error);
    return NextResponse.json(
      { error: "Failed to fetch games collection" },
      { status: 500 }
    );
  }
}
