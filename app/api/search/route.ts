import { NextRequest, NextResponse } from "next/server";
import { getGameProvider } from "@/lib/games";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { sanitizeSearchQuery } from "@/lib/security/sanitize";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "anonymous-client";
    const rateCheck = checkRateLimit(ip, { limit: 100, windowMs: 60 * 1000 });

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Too many search requests. Please slow down." },
        {
          status: 429,
          headers: {
            "Retry-After": rateCheck.reset.toString(),
          },
        }
      );
    }

    const { searchParams } = new URL(request.url);
    const query = sanitizeSearchQuery(searchParams.get("q") || "");
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);

    if (!query) {
      return NextResponse.json({
        data: [],
        total: 0,
        page: 1,
        limit,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      });
    }

    const provider = getGameProvider();
    const result = await provider.searchGames(query, {
      page: isNaN(page) ? 1 : page,
      limit: isNaN(limit) ? 10 : limit,
    });

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("API /api/search error:", error);
    return NextResponse.json(
      { error: "Search query processing failed" },
      { status: 500 }
    );
  }
}
