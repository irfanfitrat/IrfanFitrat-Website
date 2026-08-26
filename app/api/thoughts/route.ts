import { getRequestContext } from '@cloudflare/next-on-pages';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// GET: Fetch all thoughts
export async function GET() {
  const db = getRequestContext().env.DB;
  const { results } = await db.prepare(
    "SELECT * FROM Thoughts ORDER BY created_at DESC"
  ).all();

  return NextResponse.json(results);
}

// POST: Create a new thought
export async function POST(req: NextRequest) {
  const db = getRequestContext().env.DB;
  const { content } = await req.json();
  const id = crypto.randomUUID();

  await db.prepare(
    "INSERT INTO Thoughts (id, content) VALUES (?, ?)"
  ).bind(id, content).run();

  return NextResponse.json({ success: true, id });
}
