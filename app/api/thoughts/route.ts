import { getRequestContext } from '@cloudflare/next-on-pages';
import { NextRequest, NextResponse } from 'next/server';

// This tells Next.js to run this API on Cloudflare's Edge network
export const runtime = 'edge';

// GET: Fetch all thoughts
export async function GET() {
  const db = getRequestContext().env.DB;
  
  // Fetch thoughts from D1, ordered by newest first
  const { results } = await db.prepare(
    "SELECT * FROM Thoughts ORDER BY created_at DESC"
  ).all();

  return NextResponse.json(results);
}

// POST: Create a new thought
export async function POST(req: NextRequest) {
  const db = getRequestContext().env.DB;
  const { content } = await req.json();
  
  // Generate a random ID for the new thought
  const id = crypto.randomUUID();

  // Insert the thought securely using .bind() to prevent SQL injection
  await db.prepare(
    "INSERT INTO Thoughts (id, content) VALUES (?, ?)"
  ).bind(id, content).run();

  return NextResponse.json({ success: true, id });
}
