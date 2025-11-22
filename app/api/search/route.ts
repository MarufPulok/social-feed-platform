import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  return NextResponse.json(
    { message: `Search results for: ${query}` },
    { status: 200 }
  );
}

