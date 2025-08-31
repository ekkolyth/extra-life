import { auth } from '@clerk/nextjs/server'

import { getGoals } from '@/actions/goals'

export async function GET() {
  const { userId } = auth()
  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const data = await getGoals()
  return Response.json(data)
}
