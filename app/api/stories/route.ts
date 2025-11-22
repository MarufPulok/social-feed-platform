import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: "Get all stories" }, { status: 200 });
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ message: "Create story" }, { status: 201 });
}

