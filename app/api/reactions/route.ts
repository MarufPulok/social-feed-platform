import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: "Get reactions" }, { status: 200 });
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ message: "Create reaction" }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json({ message: "Remove reaction" }, { status: 200 });
}

