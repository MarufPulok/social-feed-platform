import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: "Get all notifications" }, { status: 200 });
}

export async function PUT(request: NextRequest) {
  return NextResponse.json({ message: "Mark notifications as read" }, { status: 200 });
}

