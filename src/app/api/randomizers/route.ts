import { db } from '@/lib/convex'

export async function GET(request: Request) {
  const data = await db.randomizer
    .findMany({
      include: {
        items: true
      }
    })
      .then((r: any[]) =>
        r.map((r: any) => ({
          ...r,
          items: r.items.filter((i: any) => i.limit > i.redeemed)
        }))
      )

  return Response.json(data)
}
