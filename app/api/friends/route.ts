import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: "Get friends list" }, { status: 200 });
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ message: "Send friend request" }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  return NextResponse.json({ message: "Accept/Reject friend request" }, { status: 200 });
}

