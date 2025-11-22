import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json(
    { message: `Get replies for comment ${params.id}` },
    { status: 200 }
  );
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json(
    { message: `Add reply to comment ${params.id}` },
    { status: 201 }
  );
}

