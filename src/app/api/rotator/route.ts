import { db } from '@/lib/convex'

export async function GET() {
  const rotators = await db.rotator.findMany()

  return Response.json(rotators)
}
