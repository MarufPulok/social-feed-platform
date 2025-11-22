import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json(
    { message: `Get reactions for post ${params.id}` },
    { status: 200 }
  );
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json(
    { message: `Add reaction to post ${params.id}` },
    { status: 201 }
  );
}

